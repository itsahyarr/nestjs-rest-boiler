import { IsString } from 'class-validator';

export class RefreshSessionDto {
  @IsString()
  refresh_token: string;
}
