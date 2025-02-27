import { IApiResponse, RefreshTokenGuard } from '@/core';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<IApiResponse> {
    return {
      code: HttpStatus.OK,
      status: true,
      message: 'login success!',
      result: await this.authService.login(loginDto),
    };
  }

  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshAuthSession(@Req() req: any): Promise<IApiResponse> {
    return {
      code: HttpStatus.OK,
      message: 'session updated successfully!',
      status: true,
      result: await this.authService.refreshSession(
        +req.user.sub,
        req.user.username,
        req.user.refreshToken,
      ),
    };
  }
}
