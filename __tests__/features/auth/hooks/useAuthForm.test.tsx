
import { renderHook, act, waitFor } from '@testing-library/react';
import { handleFormError } from '@flowtec/handlers/error';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useLoginForm } from '@flowtec/features/auth/hooks/useAuthForm';
import { useAuthMutations } from '@flowtec/features/auth/hooks/useAuth';

// Mocks
jest.mock('./useAuth.test');
jest.mock('@flowtec/handlers/error');
jest.mock('sonner');
jest.mock('next/navigation');

// Mock do schema para testes
jest.mock('../schemas/auth-schema', () => ({
  authSchema: { parse: jest.fn(), safeParse: jest.fn() },
  emptyAuth: { email: '', password: '' }
}));

// Mock do react-hook-form
const mockSetError = jest.fn();
const mockHandleSubmit = jest.fn();
const mockFormState = { isSubmitting: false, errors: {} };

jest.mock('react-hook-form', () => ({
  useForm: jest.fn(() => ({ handleSubmit: mockHandleSubmit, setError: mockSetError, formState: mockFormState }))
}));

describe('useLoginForm', () => {
  const mockLogin = { mutateAsync: jest.fn(), isPending: false };
  const mockPush = jest.fn();
  const mockToastSuccess = jest.fn();
  const mockToastError = jest.fn();
  const mockHandleFormError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthMutations as jest.Mock).mockReturnValue({ login: mockLogin });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (toast.success as jest.Mock).mockImplementation(mockToastSuccess);
    (toast.error as jest.Mock).mockImplementation(mockToastError);
    (handleFormError as jest.Mock).mockImplementation(mockHandleFormError);
    // handleSubmit retorna a própria função de dados para facilitar testes
    mockHandleSubmit.mockImplementation((fn) => fn);
  });

  describe('Hook inicialization', () => {
    it('initialize with default values', () => {
      const { result } = renderHook(() => useLoginForm());
      expect(result.current.globalError).toBeUndefined();
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.form).toBeDefined();
      expect(typeof result.current.onSubmit).toBe('function');
    });
  });

  describe('Success flow', () => {
    it('Send success data and redirect', async () => {
      const mockData: any = { email: 'test@gmail.com', password: '123456789' };
      mockLogin.mutateAsync.mockResolvedValue({ success: true });

      const { result } = renderHook(() => useLoginForm());
      await act(async () => {
        await result.current.onSubmit(mockData);
      });

      expect(mockLogin.mutateAsync).toHaveBeenCalledWith(mockData);
      expect(mockToastSuccess).toHaveBeenCalledWith(
        'Autenticado com sucesso!',
        { description: 'Você está sendo redirecionado...' }
      );
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
      expect(result.current.globalError).toBeUndefined();
    });

    it('clear globalError before login', async () => {
      mockLogin.mutateAsync.mockResolvedValue({ success: true });
      const { result } = renderHook(() => useLoginForm());
      await act(async () => {
        await result.current.onSubmit({ email: 'a@b.com', password: '123' } as any);
      });
      expect(result.current.globalError).toBeUndefined();
    });
  });

  describe('Error treatment', () => {
    it('treats login error and verify toast.error', async () => {
      const mockData: any = { email: 'test@test.com', password: 'wrong' };
      const error = new Error('Credenciais inválidas');
      const parsed = { globalError: 'Email ou senha incorretos' };
      mockLogin.mutateAsync.mockRejectedValue(error);
      mockHandleFormError.mockReturnValue(parsed);

      const { result } = renderHook(() => useLoginForm());
      await act(async () => {
        await result.current.onSubmit(mockData);
      });

      expect(mockHandleFormError).toHaveBeenCalledWith(
        error,
        mockSetError,
        expect.any(Function)
      );
      expect(mockToastError).toHaveBeenCalledWith(
        'Erro ao autenticar!',
        { description: 'Email ou senha incorretos' }
      );
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('usa mensagem padrão quando não há globalError', async () => {
      mockLogin.mutateAsync.mockRejectedValue(new Error('Network'));
      mockHandleFormError.mockReturnValue({ globalError: undefined });

      const { result } = renderHook(() => useLoginForm());
      await act(async () => {
        await result.current.onSubmit({ email: 'test@test.com', password: '123456' } as any);
      });
      expect(mockToastError).toHaveBeenCalledWith(
        'Erro ao autenticar!',
        { description: 'Algo deu errado' }
      );
    });

    it('define globalError quando handleFormError retorna mensagem', async () => {
      mockLogin.mutateAsync.mockRejectedValue(new Error('Server'));
      mockHandleFormError.mockImplementation((_, __, setGlobalError) =>
        setGlobalError('Servidor indisponível')
      );

      const { result } = renderHook(() => useLoginForm());
      await act(async () => {
        await result.current.onSubmit({ email: 'test@test.com', password: '123456' } as any);
      });
      await waitFor(() =>
        expect(result.current.globalError).toBe('Servidor indisponível')
      );
    });
  });

  describe('Integração com react-hook-form', () => {
    it('chama handleSubmit do RHF', () => {
      renderHook(() => useLoginForm());
      expect(mockHandleSubmit).toHaveBeenCalled();
    });

    it('pode ser usado como event handler', async () => {
      const mockEvent: any = { preventDefault: jest.fn() };
      mockLogin.mutateAsync.mockResolvedValue({ success: true });

      const { result } = renderHook(() => useLoginForm());
      await act(async () => {
        await result.current.onSubmit(mockEvent);
      });
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });
  });

  describe('Casos extremos', () => {
    it('lida com exceção síncrona', async () => {
      mockLogin.mutateAsync.mockImplementation(() => { throw new Error('Sync'); });
      const { result } = renderHook(() => useLoginForm());
      await act(async () => {
        await result.current.onSubmit({ email: 'x@y.com', password: 'z' } as any);
      });
      expect(mockToastError).toHaveBeenCalled();
    });

    it('lida com dados undefined', async () => {
      mockLogin.mutateAsync.mockResolvedValue({ success: true });
      const { result } = renderHook(() => useLoginForm());
      await act(async () => {
        await result.current.onSubmit(undefined as any);
      });
      expect(mockLogin.mutateAsync).toHaveBeenCalledWith(undefined);
    });

    it('ignora falha no push', async () => {
      mockLogin.mutateAsync.mockResolvedValue({ success: true });
      mockPush.mockImplementation(() => { throw new Error('Nav'); });
      const { result } = renderHook(() => useLoginForm());
      await act(async () => {
        expect(async () => { await result.current.onSubmit({ email: 'a', password: 'b' } as any); }).not.toThrow();
      });
    });
  });

  describe('Dependências externas', () => {
    it('usa useAuthMutations', () => {
      renderHook(() => useLoginForm());
      expect(useAuthMutations).toHaveBeenCalled();
    });

    it('usa useRouter', () => {
      renderHook(() => useLoginForm());
      expect(useRouter).toHaveBeenCalled();
    });
  });
});

