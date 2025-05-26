import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as authService from '@flowtec/features/auth/server/services/auth-service';
import { useAuthMutations } from '@flowtec/features/auth/hooks/useAuth';
import { AxiosResponse } from 'axios';

jest.mock('@flowtec/features/auth/server/services/auth-service');
const mockedAuth = authService as jest.Mocked<typeof authService>;

describe('useAuthMutations', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Para não ficar tentando em testes
      },
    },
  });

  const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama login e executa onSuccess corretamente', async () => {
    mockedAuth.login.mockResolvedValue({
      data: { token: 'fake-token' },
    } as unknown as AxiosResponse<{ token: string }>);
    
    const { result } = renderHook(() => useAuthMutations(), {
      wrapper,
    });

    await act(async () => {
      await result.current.login.mutateAsync({
        email: 'email',
        password: 'senha',
      });
    });

    expect(mockedAuth.login).toHaveBeenCalledWith({
      email: 'email',
      password: 'senha',
    });

    // Verifica se o invalidateQueries rodou após sucesso
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: expect.arrayContaining(['/auth/login']),
    });
  });

  it('trata erro no login', async () => {
    mockedAuth.login.mockRejectedValue(new Error('Erro no login'));

    const { result } = renderHook(() => useAuthMutations(), {
      wrapper,
    });

    await act(async () => {
      try {
        await result.current.login.mutateAsync({
          email: 'email',
          password: 'senha',
        });
      } catch (e) {
        // Espera erro, não faz nada
      }
    });

    expect(mockedAuth.login).toHaveBeenCalled();
    expect(result.current.login.isError).toBe(true);
    expect(result.current.login.error).toEqual(expect.any(Error));
  });
});
