//import { createContext } from 'react';
import axios, { AxiosInstance } from 'axios';
import applyCaseMiddleware from 'axios-case-converter';

import { logConsole, logError } from './LogTracker.ts';
import ENV from './env';

const BASE_URL = ENV.BASE_API_URL;

const ApiService = () => {
  const client: AxiosInstance = applyCaseMiddleware(axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
  }));

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

  const getTrending = async (offset: number = 0, maxGIFPerLoad: number) => {
    const url = `/trending?api_key=${ENV.API_KEY}&offset=${offset}&limit=${maxGIFPerLoad}`;
    return client.get(url);
  };

  const searchGIFs = async (query: string, offset: number = 0, maxGIFPerLoad: number) => {
    const url = `/search?api_key=${ENV.API_KEY}&offset=${offset}&q=${query}&limit=${maxGIFPerLoad}`;
    return client.get(url);
  };

  return {
    getTrending,
    searchGIFs,
  };
};

//export const ApiServiceContext = createContext<typeof ApiService>(null);

export default ApiService;
