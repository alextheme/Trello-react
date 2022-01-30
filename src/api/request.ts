/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import axios from 'axios';
import { api } from '../common/constants';
import { getFromSessionStorageToken } from '../store/modules/user/session-storage-actions';

const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    // Authorization: `Bearer 123`, // к этому мы ещё вернёмся как-нибудь потом
  },
});

instance.interceptors.request.use((config) => {
  const token = getFromSessionStorageToken() || '';
  return { ...config, headers: { ...config.headers, Authorization: `Bearer ${token}` } };
});

instance.interceptors.response.use((res) => res.data);

export default instance;
