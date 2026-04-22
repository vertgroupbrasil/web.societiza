'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  login,
  logout,
  forgotPassword,
  resetPassword,
} from '@societiza/features/auth/server/services/auth.service';

// ── useLogin ──────────────────────────────────────────────────────────────────

export function useLogin() {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      // Invalida todo o cache — usuário recém-autenticado pode ter dados diferentes
      qc.clear();
      router.push('/dashboard');
    },
  });
}

// ── useLogout ─────────────────────────────────────────────────────────────────

export function useLogout() {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      qc.clear();
      router.push('/login');
      toast.success('Sessão encerrada', {
        description: 'Você saiu da sua conta com sucesso.',
      });
    },
    onError: () => {
      // Mesmo em erro, redireciona — o token local já foi limpo no service
      qc.clear();
      router.push('/login');
      toast.error('Erro ao encerrar sessão', {
        description: 'Sua sessão foi encerrada localmente.',
      });
    },
  });
}

// ── useForgotPassword ─────────────────────────────────────────────────────────

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success('E-mail enviado', {
        description:
          'Se esse endereço estiver cadastrado, você receberá um link em breve.',
      });
    },
    onError: () => {
      toast.error('Erro ao enviar e-mail', {
        description: 'Tente novamente em alguns instantes.',
      });
    },
  });
}

// ── useResetPassword ──────────────────────────────────────────────────────────

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success('Senha redefinida com sucesso', {
        description: 'Entre com sua nova senha para continuar.',
      });
      router.push('/login');
    },
    onError: () => {
      toast.error('Link inválido ou expirado', {
        description:
          'Solicite um novo link de redefinição de senha.',
      });
    },
  });
}

// ── useAuthMutations (compat) ─────────────────────────────────────────────────

/** @deprecated Use os hooks individuais: useLogin, useLogout, useForgotPassword, useResetPassword */
export function useAuthMutations() {
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  return {
    login: loginMutation,
    logout: logoutMutation,
  };
}
