import { ApiProperty } from '@nestjs/swagger';

export class UploadUserImageDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  image: Express.Multer.File;
}
