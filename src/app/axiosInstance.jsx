// axiosInstance.js
import axios from 'axios';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const baseURLs = [
  'https://stardb-api.vercel.app/api',
  'https://stardb-api.onrender.com/api',
];

// Function to get a random base URL
const getBaseURL = () => baseURLs[Math.floor(Math.random() * baseURLs.length)];

const axiosInstance = axios.create({
  baseURL: getBaseURL()
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      message.error('Unauthorized access. Please log in.');
      const navigate = useNavigate();
      navigate('/login');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
