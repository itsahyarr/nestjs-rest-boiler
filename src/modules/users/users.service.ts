import { CommonDBMeta, passwordHash } from '@/core';
import { PageOptionsDto2 } from '@/core/generic/page-options.dto';
import { ICrudBase } from '@/core/interfaces/crud-base.interface';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ILike, IsNull, Repository } from 'typeorm';
import { Logger } from 'winston';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService implements ICrudBase<User> {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(input: Omit<User, CommonDBMeta>): Promise<User> {
    // hash user password
    input.password = await passwordHash(input.password);

    const newUser = this.usersRepository.create({
      ...input,
    });

    try {
      return await this.usersRepository.save(newUser);
    } catch (error) {
      this.logger.debug(`error code : ${error.code}`);
      this.logger.error(`details : ${JSON.stringify(error)}`);
      if (error.code === '23505')
        throw new BadRequestException('username/email has been used');

      throw new InternalServerErrorException('unknown error');
    }
  }

  async updateById(
    id: number,
    input: Partial<Omit<User, CommonDBMeta>>,
  ): Promise<User> {
    try {
      this.logger.verbose(`updated id : ${id}`);
      await this.usersRepository
        .createQueryBuilder()
        .update(User)
        .set({ ...input })
        .where('id = :id', { id })
        .execute();

      const updated = await this.usersRepository.findOne({ where: { id } });

      return updated;
    } catch (error) {
      this.logger.error(`error : ${JSON.stringify(error)}`);
      this.logger.debug(`${error}`);
      throw error;
    }
  }

  // only implement soft-delete mechanism (set deletedAt to not null)
  async deleteById(id: number): Promise<number> {
    try {
      this.logger.verbose(`id for deletion : ${id}`);
      await this.usersRepository
        .createQueryBuilder()
        .softDelete()
        .where('id = :id', { id })
        .execute();

      const deleted = await this.usersRepository.findOne({
        where: { id },
        withDeleted: true,
      });

      return deleted.id;
    } catch (error) {
      this.logger.error(`error : ${JSON.stringify(error)}`);
      this.logger.debug(`${error}`);
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.usersRepository.find({
        where: { deleted_at: IsNull() },
      });
    } catch (error) {
      this.logger.error(`error : ${JSON.stringify(error)}`);
      this.logger.debug(`${error}`);
      throw error;
    }
  }

  // async findAllPaged(pageOptionsDto: PageOptionsDto2): Promise<PageDto<User>> {
  async findAllPaged(pageOptionsDto: PageOptionsDto2) {
    try {
      const { sort_by, sort_order, offset, limit, search_field, search_value } =
        pageOptionsDto;

      const whereCondition: any = {
        deleted_at: null,
      };

      if (search_field && search_value) {
        whereCondition[search_field] = ILike(`%${search_value}%`);
      }

      const [data, total] = await this.usersRepository.findAndCount({
        where: whereCondition,
        order: { [sort_by]: sort_order },
        take: limit,
        skip: offset,
      });

      // for (const d of data){
      //   d.image_url = this.minioService.getImageUrl(d.image)
      // }

      return { data, total };
      // const queryBuilder = this.usersRepository
      //   .createQueryBuilder('user')
      //   .orderBy('user.created_at', pageOptionsDto.order)
      //   .skip(pageOptionsDto.skip)
      //   .take(pageOptionsDto.take);

      // const itemCount = await queryBuilder.getCount();
      // const { entities } = await queryBuilder.getRawAndEntities();

      // const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

      // return new PageDto(entities, pageMetaDto);
    } catch (error) {
      this.logger.error(`error : ${JSON.stringify(error)}`);
      this.logger.debug(`${error}`);
      throw error;
    }
  }

  async findById(id: number): Promise<User> {
    try {
      return await this.usersRepository.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      this.logger.error(`error : ${JSON.stringify(error)}`);
      this.logger.debug(`${error}`);
      throw error;
    }
  }

  async findByUsername(username: string): Promise<User> {
    try {
      return await this.usersRepository.findOne({
        where: {
          username,
        },
      });
    } catch (error) {
      this.logger.error(`error : ${JSON.stringify(error)}`);
      this.logger.debug(`${error}`);
      throw error;
    }
  }

  // async uploadImage(userId: number, image: Express.Multer.File): Promise<User> {
  //   const imgObjectName = await this.minioService.uploadImage(
  //     `user-images/${userId}`,
  //     image,
  //   );

  //   const imageUrl = await this.minioService.getImageUrl(imgObjectName);

  //   // update user info
  //   return await this.updateById(userId, {
  //     image: imageUrl,
  //     image_url: imageUrl,
  //   });
  // }
}
