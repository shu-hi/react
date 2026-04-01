export type ApiResult<T> = {
  status: string;
  error: string;
  data: T;
};