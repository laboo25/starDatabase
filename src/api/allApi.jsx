// src/axiosInstance.js
import axios from 'axios';

const baseURLs = [
  'https://stardb-api.onrender.com/api',
  'https://star-database-api.up.railway.app/api',
  'https://stardb-api.vercel.app/api'
];

const createAxiosInstance = (baseURL) => {
  return axios.create({
    baseURL: baseURL,
    timeout: 1000,
    headers: { 'Authorization': 'Bearer yourToken' } // Replace with your token or any other headers
  });
};

const axiosInstances = baseURLs.map(url => createAxiosInstance(url));

const makeRequestWithRetries = async (config, retries = 0) => {
  try {
    const response = await axiosInstances[retries].request(config);
    return response;
  } catch (error) {
    if (retries < axiosInstances.length - 1) {
      return makeRequestWithRetries(config, retries + 1);
    } else {
      throw error;
    }
  }
};

export default makeRequestWithRetries;

  
  //  CREATE STAR API
  export const createStar = async (data) => {
    try {
      const response = await instance.post('/stars/create-star/create-new-star', data);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

    //  UPDATE STAR API
    export const updateStar = async (data) => {
      try {
        const response = await instance.post(`/stars/albums/update-album/${albumId}`, data);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    };
    
    //  DELETE STAR API
    export const deleteStar = async (data) => {
      try {
        const response = await instance.post(`/stars/albums/delete-album/${albumId}`, data);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    };
    
    //  GET STAR API
    export const getStar = async (data) => {
      try {
        const response = await instance.post(`/stars/create-star/get-all-star`, data);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    };
    
    //  CREATE STAR BIO API
    export const createStarBio = async (data) => {
      try {
        const response = await instance.post(`/stars/create-star/get-all-star`, data);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    };
    
    //  GET STAR BIO API
    export const getStarBio = async (data) => {
      try {
        const response = await instance.post(`/stars/create-star/get-all-star`, data);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    };