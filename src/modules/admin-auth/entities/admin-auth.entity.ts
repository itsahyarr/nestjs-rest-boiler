import { User } from '@/modules/users';
import { Entity } from 'typeorm';

@Entity()
export class AdminAuth extends User {}
