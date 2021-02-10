import axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';
import Router from 'next/router';

import config from '../config';
import { addNotification } from '../../utils/notifications';
import { getStore } from '../../stores/initStore';

const { API_URL } = config();

export type Response<T = {}> = (...args: any) => Promise<T>;

export type Config = Pick<AxiosRequestConfig, 'baseURL' | 'cancelToken' | 'headers'>;

class ClientParams {
  skipHandleErrors?: boolean = false;
  responseTypeIsBlob?: boolean = false;
  returnFullResponse?: boolean = false;
}

const internalClient = (params?:ClientParams) => {
  const isServer = typeof window === 'undefined';
  const token = isServer ? '' : (window.localStorage.getItem('token') || window.sessionStorage.getItem('token'));
  const store = getStore();
  const client = axios.create({
    baseURL: API_URL,
    headers: {
      common: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      Authorization: token ? `Bearer ${token}` : '',
    },
    responseType: params && params.responseTypeIsBlob ? 'blob' : 'json'
  });

  client.interceptors.response.use(
    (response) => {
      if ((client.defaults as any).configParams.returnFullResponse) {
        return response;
      }

      return response.data;
    },
    (error) => {
      if (!(client.defaults as any).configParams.skipHandleErrors) {
        const errorText = 'Error in request';
        if (error.response && error.response.status === 401 && error.response.statusText === 'Unauthorized') {
          //addNotification('info', '', 'You need re-login!');
          //store.userStore.signOut(true);
          //setTimeout(() => {
          //    Router.push('/sign-in');
          //}, 3000);
        } else {
          const { message, name } = error.response.data?.error || {};
          let errorMessage = message || errorText;
          addNotification('error', name || '', errorMessage);
        }
        throw error;
      } else {
        return error.response;
      }
    }
  );
  client.interceptors.request.use((config) => {
    config.paramsSerializer = (params) => {
      return qs.stringify(params, { arrayFormat: 'indices', encode: true });
    };

    return config;
  });

  return client;
};

const client = (params?: ClientParams) => {
  const cli = internalClient(params);
  (cli.defaults as any).configParams = { ...params } || new ClientParams();
  return cli;
};
export { client };
