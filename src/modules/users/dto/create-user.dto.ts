import { CommonDBMeta } from '@/core';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { User } from '../entities/user.entity';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto implements Omit<User, CommonDBMeta> {
  @IsString()
  fullname: string;

  @IsString()
  username: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsBoolean()
  is_active: boolean;

  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  role: UserRole;
}
