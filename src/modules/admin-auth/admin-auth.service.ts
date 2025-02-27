import { AuthToken, passwordVerify } from '@/core';
import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { UsersService } from '../users/users.service';
import { AdminLoginResponse } from './dto/admin-login-response';
import { LoginAdminDto } from './dto/login-admin.dto';

@Injectable()
export class AdminAuthService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private async getTokens(
    userId: number,
    username: string,
    role: string,
  ): Promise<AuthToken> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role,
        },
        {
          secret: process.env.JWT_ADMIN_ACCESS_SECRET,
          expiresIn: '3d',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role,
        },
        {
          secret: process.env.JWT_ADMIN_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  private async updateRefreshToken(userId: number, refreshToken: string) {
    await this.usersService.updateById(userId, {
      refresh_token: await this.hashData(refreshToken),
    });
  }

  private async hashData(data: string): Promise<string> {
    return await argon2.hash(data, {
      secret: Buffer.from(process.env.JWT_ADMIN_REFRESH_SECRET),
    });
  }

  private async verifyTokenData(
    digest: string,
    token: string,
  ): Promise<boolean> {
    return await argon2.verify(digest, token, {
      secret: Buffer.from(process.env.JWT_ADMIN_REFRESH_SECRET),
    });
  }

  async login(loginAdminInput: LoginAdminDto): Promise<AdminLoginResponse> {
    try {
      const user = await this.usersService.findByUsername(
        loginAdminInput.username,
      );
      if (!user) {
        this.logger.verbose('user is not found');
        throw new UnauthorizedException(`invalid username/password`);
      }

      if (!(await passwordVerify(user.password, loginAdminInput.password))) {
        this.logger.verbose('failed password verification');
        throw new UnauthorizedException(`invalid username/password`);
      }
      // Generate accessToken and refreshToken
      const { access_token, refresh_token } = await this.getTokens(
        user.id,
        user.username,
        user.role,
      );

      // Update refresh token inside database
      await this.updateRefreshToken(user.id, refresh_token);

      return {
        access_token,
        refresh_token,
        user,
      };
    } catch (error) {
      throw error;
    }
  }

  async refreshSession(userId: number, username: string, refreshToken: string) {
    // this.hashData(refreshToken)
    const user = await this.usersService.findById(userId);
    if (!(await this.verifyTokenData(user.refresh_token, refreshToken))) {
      throw new BadRequestException('invalid request token');
    }
    // Generate accessToken and refreshToken
    const { access_token, refresh_token } = await this.getTokens(
      userId,
      username,
      user.role,
    );

    // Update refresh token inside database
    await this.updateRefreshToken(userId, refresh_token);

    return {
      access_token,
      refresh_token,
    };
  }
}
