import axios from 'axios'

const instance = axios.create({
    baseURL: 'star-database-api.vercel.app/api/',
    // baseURL: 'http://localhost:1769/api/',
  });

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