// src/axiosInstance.js
import axios from 'axios';

const baseURLs = [
  'https://stardb-api.onrender.com/api',
  'https://stardb-api.vercel.app/api',
  'https://star-database-api.up.railway.app/api',
];

const createAxiosInstance = (baseURL) => {
  return axios.create({
    baseURL: baseURL,
    timeout: 1000,
    headers: { 'Authorization': 'Bearer yourToken' } // Replace with your token or any other headers
  });
};

const axiosInstances = baseURLs.map(url => createAxiosInstance(url));

const getFastestAxiosInstance = async () => {
  const promises = axiosInstances.map(instance => 
    instance.get('/health-check').then(() => instance).catch(() => null)
  );
  const fastestInstance = await Promise.race(promises.filter(p => p !== null));
  if (!fastestInstance) {
    throw new Error('No API instance is available');
  }
  return fastestInstance;
};

let selectedAxiosInstance;

const makeRequestWithRetries = async (config, retries = 0) => {
  if (!selectedAxiosInstance) {
    selectedAxiosInstance = await getFastestAxiosInstance();
  }
  try {
    const response = await selectedAxiosInstance.request(config);
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

// Updated API functions

const callAPI = async (method, url, data) => {
  const config = {
    method,
    url,
    data
  };
  return makeRequestWithRetries(config);
};

// CREATE STAR API
export const createStar = async (data) => {
  try {
    const response = await callAPI('post', '/stars/create-star/create-new-star', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// UPDATE STAR API
export const updateStar = async (albumId, data) => {
  try {
    const response = await callAPI('post', `/stars/albums/update-album/${albumId}`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// DELETE STAR API
export const deleteStar = async (albumId, data) => {
  try {
    const response = await callAPI('post', `/stars/albums/delete-album/${albumId}`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// GET STAR API
export const getStar = async (data) => {
  try {
    const response = await callAPI('post', '/stars/create-star/get-all-star', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// CREATE STAR BIO API
export const createStarBio = async (data) => {
  try {
    const response = await callAPI('post', '/stars/create-star/get-all-star', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// GET STAR BIO API
export const getStarBio = async (data) => {
  try {
    const response = await callAPI('post', '/stars/create-star/get-all-star', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
