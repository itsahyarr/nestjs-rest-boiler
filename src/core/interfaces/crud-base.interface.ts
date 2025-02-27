import { CommonDBMeta } from '..';
import { IBaseEntity } from './base-entity.interface';

export interface ICrudBase<T extends IBaseEntity> {
  findAll(...args: any[]): Promise<T[]>;

  findById(id: number, ...args: any[]): Promise<T>;

  create(input: Omit<T, CommonDBMeta>, ...args: any[]): Promise<T>;

  updateById(
    id: number,
    input: Partial<Omit<T, CommonDBMeta>>,
    ...args: any[]
  ): Promise<T>;

  deleteById(id: number, ...args: any[]): Promise<number>;
}
