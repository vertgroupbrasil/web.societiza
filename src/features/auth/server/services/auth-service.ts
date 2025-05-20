import axios from 'axios';
import { Auth } from '../../schemas/auth-schema';
import { API_ENDPOINTS } from '@flowtec/routes/endpoints';

const api = API_ENDPOINTS;

export function login(data: Auth) {
  return axios.post(api.auth.login, data);
}

export function logout() {
  return axios.post(api.auth.login);
}

export function refresh() {
  return axios.post(api.auth.refresh);
}
