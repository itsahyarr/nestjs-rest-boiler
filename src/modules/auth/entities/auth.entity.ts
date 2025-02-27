import { User } from '@/modules/users';
import { Entity } from 'typeorm';

@Entity()
export class Auth extends User {}
