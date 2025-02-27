import { User } from '@/modules/users';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { PageMetaDto } from '../../../core/generic/page-meta.dto';

export class PageUserGraphResponse {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: User[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto;
}
