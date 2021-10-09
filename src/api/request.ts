/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import axios, { AxiosResponse } from 'axios';
import { api } from '../common/constants';

const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    // Authorization: 'Bearer 123', // к этому мы ещё вернёмся как-нибудь потом
  },
});

instance.interceptors.request.use((config) => {
  config.headers.authorization = 'Bearer 123';
  console.log('axios 4');
  return config;
});

instance.interceptors.response.use(
  (res: AxiosResponse) => {
    console.log('axios 5');
    // eslint-disable-next-line no-console
    console.log('response: ', res.data);
    return res.data;
  },
  (error) => Promise.reject(error)
);

export default instance;
