import axios from 'axios';
import { showToast } from '@/components/common';
import { STORAGE_TOKEN, useCodeContentStore, useUserStore } from '@/store';
import type { RequestMethod } from './types';

const { VITE_API_URL } = import.meta.env;

/** interceptor 的註冊集中於此，模組頂層才不會出現裸的副作用呼叫 */
function createAxiosInstance() {
  const instance = axios.create({ baseURL: VITE_API_URL });

  instance.interceptors.request.use(
    config => {
      const token = localStorage.getItem(STORAGE_TOKEN);

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error),
  );

  instance.interceptors.response.use(
    response => response.data,
    error => {
      const { data } = error.response;

      if (data === 'Unauthorized') {
        useCodeContentStore().setCodeId('');
        useUserStore().setUser({});
        localStorage.removeItem(STORAGE_TOKEN);
        showToast({ message: 'account is logged out', type: 'error' });
      } else {
        showToast({ message: data?.message ?? error.message, type: 'error' });
      }
      return Promise.reject(error);
    },
  );

  return instance;
}

const axiosInstance = createAxiosInstance();

export const get: RequestMethod = axiosInstance.get;
export const post: RequestMethod = axiosInstance.post;
export const put: RequestMethod = axiosInstance.put;
export const del: RequestMethod = axiosInstance.delete;
