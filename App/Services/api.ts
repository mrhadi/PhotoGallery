import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { logConsole, logError } from './LogTracker.ts';

const BASE_URL = 'https://api.giphy.com/v1/gifs/trending';

const ApiService = () => {
  const client: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
  });

  client.interceptors.request.use(
    config => {
      logConsole(`\x1b[36mAPI Call: ${config.url}\x1b[0m`);

      return config;
    },
    error => {
      logError(
        `API Error:${error?.message} Url:\x1b[31m${
          error?.config?.url
        }\x1b[0m Data:${JSON.stringify(error?.response?.data)}`
      )

      return Promise.reject(error);
    }
  )
  client.interceptors.response.use(
    config => {
      return config;
    },
    error => {
      logError(
        `API Error:${error?.message} Url:\x1b[31m${
          error?.config?.url
        }\x1b[0m Data:${JSON.stringify(error?.response?.data)}`
      );

      return Promise.reject(error);
    }
  );
};

export default ApiService
