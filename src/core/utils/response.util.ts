import { IApiResponse } from '../interfaces/api-response';

export const createApiResponse = <T = any>(
  code: number,
  status: boolean,
  message: string,
  result: T | null = null,
): IApiResponse => {
  return {
    code,
    status,
    message,
    result,
  };
};

export const paginBuilder = <T = any>(
  data: T[],
  total: number,
  limit: number,
  offset: number,
) => {
  const current_page = Math.floor(offset / limit) + 1;
  const total_page = Math.ceil(total / limit);
  const has_previous_page = current_page > 1;
  const has_next_page = current_page < total_page;

  return {
    data,
    total,
    total_page,
    current_page,
    has_previous_page,
    has_next_page,
  };
};
