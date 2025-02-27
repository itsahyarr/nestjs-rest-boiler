import { User } from '@/modules/users';
import { IsObject, IsString } from 'class-validator';

export class AuthLoginResponse {
  @IsString()
  access_token: string;

  @IsString()
  refresh_token: string;

  @IsObject()
  user: User;
}
