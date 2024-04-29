import axios from 'axios';
import toast from '@/utils/toast';
import { useCodeContentStore, useUserStore } from '@/store';

const { VITE_API_URL } = import.meta.env;
const axiosInstance = axios.create({ baseURL: VITE_API_URL });

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('code_token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  response => response.data,
  error => {
    const { data } = error.response;

    if (data === 'Unauthorized') {
      useCodeContentStore().setCodeId('');
      useUserStore().setUser({});
      localStorage.removeItem('code_token');
      toast.showToast('account is logged out', 'error');
    } else {
      toast.showToast(data?.message ?? error.message, 'error');
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
