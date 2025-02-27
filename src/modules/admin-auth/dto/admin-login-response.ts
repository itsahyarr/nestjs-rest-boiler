import { User } from '@/modules/users';
import { IsObject, IsString } from 'class-validator';

export class AdminLoginResponse {
  @IsString()
  access_token: string;

  @IsString()
  refresh_token: string;

  @IsObject()
  user: User;
}
