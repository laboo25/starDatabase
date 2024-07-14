import axios from 'axios';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const axiosInstance = axios.create({
  baseURL: 'https://stardb-api.vercel.app/api',
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      message.error('Unauthorized access. Please log in.');
      const navigate = useNavigate();
      navigate('/login');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
