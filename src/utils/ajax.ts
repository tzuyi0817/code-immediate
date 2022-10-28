import axios from 'axios';
import toast from '@/utils/toast';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('code_token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => response.data,
  error => {
    const { data } = error.response;
    data && toast.showToast(data.message, data.status);
    return Promise.reject(error);
  }
);

export default axiosInstance;
