import type { InternalAxiosRequestConfig } from "axios";
import axios from "axios";

// Create an Axios instance with default configurations
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://api.example.com", // Default base URL
  timeout: 10000, // Request timeout of 10 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Modify config, e.g., add authentication token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Handle responses
    return response;
  },
  (error) => {
    // Handle errors, e.g., log out the user if the token is invalid
    if (error.response?.status === 401) {
      // Optionally log out the user or redirect to login
      localStorage.removeItem("token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
