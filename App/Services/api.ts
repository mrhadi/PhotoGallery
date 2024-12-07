import { createContext } from 'react';
import axios, { AxiosInstance } from 'axios';

import { logConsole, logError } from './LogTracker.ts';
import ENV from './env';

const BASE_URL = ENV.BASE_API_URL;

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
      );

      return Promise.reject(error);
    }
  );
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

  const getTrending = async () => {
    const url = `trending?api_key=${ENV.API_KEY}&limit=15`;
    return client.get(url);
  };

  return {
    getTrending,
  };
};

export const ApiServiceContext = createContext<typeof ApiService>(null);

export default ApiService;
