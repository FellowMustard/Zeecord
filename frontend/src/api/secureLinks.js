import axios from "axios";
import { refreshUrl } from "./fetchLinks";
axios.defaults.withCredentials = true;

const secureAxios = (token) => {
  const axiosInstance = axios.create();
  axiosInstance.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  axiosInstance.interceptors.response.use(
    (response) => {
      return { ...response, token };
    },
    async (error) => {
      if (error.response?.status === 403) {
        try {
          const refreshTokenResponse = await axiosInstance.get(refreshUrl);
          token = refreshTokenResponse.data.accessToken;
          const originalRequest = error.config;
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
          return null;
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};
export default secureAxios;
