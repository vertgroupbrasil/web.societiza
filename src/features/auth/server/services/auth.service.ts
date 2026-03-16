import { Auth } from '../../schemas/auth.schema';
import { API_ENDPOINTS } from '@societiza/routes/endpoints';
import fetcher from '@societiza/lib/axios';

const api = API_ENDPOINTS;

export async function login(data: Auth) {
  const response = await fetcher.post(api.auth.login, data);
  return response.data;
}

export async function logout() {
  const response = await fetcher.post(api.auth.login);
  return response.data;
}

export async function refresh() {
  const response = await fetcher.post(api.auth.refresh);
  return response.data;
}
