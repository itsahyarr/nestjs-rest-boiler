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
import { AdminAuthService } from './admin-auth.service';
import { LoginAdminDto } from './dto/login-admin.dto';

@Controller('admin-auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async loginAdmin(
    @Body() loginAdminDto: LoginAdminDto,
  ): Promise<IApiResponse> {
    return {
      code: HttpStatus.OK,
      status: true,
      message: 'login success!',
      result: await this.adminAuthService.login(loginAdminDto),
    };
  }

  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshAdminSession(@Req() req: any): Promise<IApiResponse> {
    return {
      code: HttpStatus.OK,
      message: 'session updated successfully!',
      status: true,
      result: await this.adminAuthService.refreshSession(
        +req.user.sub,
        req.user.username,
        req.user.refreshToken,
      ),
    };
  }
}
