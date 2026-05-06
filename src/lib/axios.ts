import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ── Token management ──────────────────────────────────────────────────────────
//
// O backend retorna o accessToken no body do login/refresh.
// O refreshToken viaja APENAS em cookie HttpOnly (o browser envia automaticamente).
//
// Estratégia:
//  - accessToken fica em memória (evita XSS via localStorage)
//  - Uma cópia não-HttpOnly é salva no cookie `societiza_at` para que o
//    middleware Next.js consiga verificar se há sessão ativa sem chamar o backend
//  - O cookie `societiza_at` expira em 15 minutos (mesmo lifetime do access token)
//  - Na renovação silenciosa, ambos são atualizados em sincronia

const ACCESS_TOKEN_COOKIE = 'societiza_at';
const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutos

let _accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  _accessToken = token;

  if (typeof document === 'undefined') return; // SSR guard

  if (token) {
    const expires = new Date(Date.now() + ACCESS_TOKEN_TTL_MS);
    document.cookie = `${ACCESS_TOKEN_COOKIE}=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
  } else {
    // Limpa o cookie
    document.cookie = `${ACCESS_TOKEN_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict`;
  }
}

export function getAccessToken(): string | null {
  if (_accessToken) return _accessToken;

  // Tenta recuperar do cookie em page refresh (memória foi perdida)
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${ACCESS_TOKEN_COOKIE}=([^;]*)`),
  );
  if (match) {
    _accessToken = decodeURIComponent(match[1]);
    return _accessToken;
  }

  return null;
}

export function clearAccessToken(): void {
  setAccessToken(null);
  _accessToken = null;
}

// ── Axios instance ────────────────────────────────────────────────────────────

const fetcher = axios.create({
  baseURL: API_URL!,
  withCredentials: true, // envia o cookie refresh_token automaticamente
  timeout: 20000,
});

// Adiciona o Authorization: Bearer em cada requisição
fetcher.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// ── Renovação silenciosa ──────────────────────────────────────────────────────

let _refreshPromise: Promise<string> | null = null;

async function doRefresh(): Promise<string> {
  // Usa /identity/auth/refresh — o refreshToken vai no cookie HttpOnly automaticamente
  const { data } = await axios.post(
    `${API_URL}/identity/auth/refresh`,
    {},
    { withCredentials: true },
  );
  const newToken: string = data.accessToken;
  setAccessToken(newToken);
  return newToken;
}

fetcher.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isRefreshCall = originalRequest.url?.includes('/identity/auth/refresh');
    const isLoginCall = originalRequest.url?.includes('/identity/auth/login');

    if (
      status === 401 &&
      !originalRequest._retry &&
      !isRefreshCall &&
      !isLoginCall
    ) {
      originalRequest._retry = true;

      try {
        // Deduplica refresh simultâneo de múltiplas abas/requisições
        if (!_refreshPromise) {
          _refreshPromise = doRefresh().finally(() => {
            _refreshPromise = null;
          });
        }

        const newToken = await _refreshPromise;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return fetcher(originalRequest);
      } catch {
        clearAccessToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default fetcher;
