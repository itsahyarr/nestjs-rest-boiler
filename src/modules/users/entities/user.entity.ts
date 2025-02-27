import { IBaseEntity } from '@/core';
import { Exclude } from 'class-transformer';
import { IsEnum } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';

@Entity()
export class User implements IBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullname: string;

  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  image_url?: string;

  @Column()
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ name: 'is_active', default: true })
  is_active?: boolean;

  @Exclude()
  @Column({ name: 'refresh_token', nullable: true })
  refresh_token?: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at?: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at?: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
