export interface IApiResponse {
  code: number;
  status: boolean;
  message: string;
  result?: unknown;
}
