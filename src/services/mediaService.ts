import axiosInstance from '../api/axiosConfig';
import { AxiosError } from 'axios';

export const getMediaBrandKit = async () => {
  try {
    const response = await axiosInstance.get(`/brand-kit`);
    return response.data;
  } catch (error) {
    // Handle error, e.g., show notification or rethrow
    if (error instanceof AxiosError) {
      // Handle Axios-specific errors if needed
      console.error('Axios Error:', error.response?.data);
    } else {
      console.error('Unknown Error:', error);
    }
    throw error;  // Rethrow the error so it can be caught by SWR or the caller
  }
};
