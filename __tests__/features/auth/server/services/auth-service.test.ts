import axios from 'axios';
import * as authService from '@societiza/features/auth/server/services/auth-service';
import { API_ENDPOINTS } from '@societiza/routes/endpoints';

const api = API_ENDPOINTS;

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('authService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar o endpoint de login', async () => {
    mockedAxios.post.mockResolvedValue({}); // Simula a resposta vazia só pra passar

    const data = { email: 'teste@email.com', password: 'senha' };
    await authService.login(data);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining(api.auth.login),
      data,
    );
  });

  it('deve chamar o endpoint de logout', async () => {
    mockedAxios.post.mockResolvedValue({});

    await authService.logout();

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining(api.auth.logout),
    );
  });

  it('deve chamar o endpoint de refresh', async () => {
    mockedAxios.post.mockResolvedValue({});

    await authService.refresh();

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining(api.auth.refresh),
    );
  });
});
