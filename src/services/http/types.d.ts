import type { AxiosRequestConfig } from 'axios';

export interface ResponseResult<T = unknown> {
  message: string;
  resultMap: T;
  status: 'success' | 'error';
}

export interface RequestMethod {
  <T = unknown, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<ResponseResult<T>>;
  <T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<ResponseResult<T>>;
}
