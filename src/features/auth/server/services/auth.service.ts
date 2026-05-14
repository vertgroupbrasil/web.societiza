import { API_ENDPOINTS } from '@societiza/routes/endpoints';
import fetcher, { setAccessToken, clearAccessToken } from '@societiza/lib/axios';
import type {
  LoginInput,
  LoginResponse,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '../../schemas/auth.schema';

const api = API_ENDPOINTS;

export async function login(data: LoginInput): Promise<LoginResponse> {
  const response = await fetcher.post<LoginResponse>(api.auth.login, data);
  // Armazena o access token em memória + cookie não-HttpOnly para o middleware
  setAccessToken(response.data.accessToken);
  return response.data;
}

export async function logout(): Promise<void> {
  try {
    await fetcher.post(api.auth.logout);
  } finally {
    // Limpa o token local independente da resposta do servidor
    clearAccessToken();
  }
}

export async function refresh(): Promise<LoginResponse> {
  // O refreshToken vai no cookie HttpOnly automaticamente (withCredentials: true)
  const response = await fetcher.post<LoginResponse>(api.auth.refresh);
  setAccessToken(response.data.accessToken);
  return response.data;
}

export async function forgotPassword(
  data: ForgotPasswordInput,
): Promise<void> {
  // O backend sempre retorna 200 independente de o email existir (silent success)
  await fetcher.post(api.auth.forgotPassword, data);
}

export async function resetPassword(
  data: Omit<ResetPasswordInput, 'confirmPassword'>,
): Promise<void> {
  await fetcher.post(api.auth.resetPassword, {
    token: data.token,
    newPassword: data.newPassword,
  });
}
