import { AccessTokenGuard, IApiResponse } from '@/core';
import { Roles } from '@/core/decorators/role.decorator';
import { PageOptionsDto2 } from '@/core/generic/page-options.dto';
import { RolesGuard } from '@/core/guards/role.guard';
import { createApiResponse, paginBuilder } from '@/core/utils/response.util';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto, UserRole } from '.';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MARKETING)
  @Post()
  async createUser(
    @Body()
    createUserDto: CreateUserDto,
  ): Promise<IApiResponse> {
    return {
      code: HttpStatus.CREATED,
      message: 'user added successfully!',
      status: true,
      result: await this.usersService.create(createUserDto),
    };
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MARKETING)
  @Get()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto2,
  ): Promise<IApiResponse> {
    const { limit, offset } = pageOptionsDto;
    const { data, total } =
      await this.usersService.findAllPaged(pageOptionsDto);

    return createApiResponse(
      HttpStatus.OK,
      true,
      'Get all data success!',
      paginBuilder(data, total, limit, offset),
    );

    // return {
    //   code: HttpStatus.OK,
    //   status: true,
    //   message: 'fetch users success!',
    //   // result: await this.usersService.findAll(),
    //   result: await this.usersService.findAllPaged(pageOptionsDto),
    // };
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MARKETING)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IApiResponse> {
    return {
      code: HttpStatus.OK,
      message: 'fetch user success!',
      status: true,
      result: await this.usersService.findById(+id),
    };
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MARKETING)
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body()
    updateUserDto: UpdateUserDto,
  ): Promise<IApiResponse> {
    return {
      code: HttpStatus.OK,
      message: 'user updated successfully!',
      status: true,
      result: await this.usersService.updateById(+id, updateUserDto),
    };
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MARKETING)
  @Delete(':id')
  async removeUser(@Param('id') id: string): Promise<IApiResponse> {
    return {
      code: HttpStatus.OK,
      message: 'user deleted successfully!',
      status: true,
      result: {
        deleted_id: await this.usersService.deleteById(+id),
      },
    };
  }

  // @HttpCode(HttpStatus.OK)
  // @ApiBearerAuth()
  // @UseGuards(AccessTokenGuard, RolesGuard)
  // @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MARKETING)
  // @Post('image-upload')
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileInterceptor('image'))
  // async imageUpload(
  //   @Req() req: any,
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body() _: UploadUserImageDto,
  // ): Promise<IApiResponse> {
  //   const data = await this.usersService.uploadImage(+req.user.sub, file);

  //   return {
  //     code: HttpStatus.OK,
  //     status: true,
  //     message: 'user image upload success!',
  //     result: data,
  //   };
  // }
}
