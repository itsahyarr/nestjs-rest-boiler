export type CommonDBMeta =
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
  | 'created_at'
  | 'updated_at'
  | 'deleted_at';

export type AuthToken = {
  access_token: string;
  refresh_token: string;
};

export type JwtPayload = {
  sub: number;
  username: string;
  role: string;
};
