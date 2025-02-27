import { User } from '@/modules/users';
import { IsString, MinLength } from 'class-validator';

export class LoginAdminDto implements Pick<User, 'username' | 'password'> {
  @IsString()
  username: string;

  @IsString()
  @MinLength(8)
  password: string;
}
