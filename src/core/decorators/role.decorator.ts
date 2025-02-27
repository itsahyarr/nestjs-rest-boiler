import { UserRole } from '@/modules/users';
import { SetMetadata } from '@nestjs/common';

export const USER_ROLES_KEY = 'user_roles';

export const Roles = (...roles: UserRole[]) =>
  SetMetadata(USER_ROLES_KEY, roles);
