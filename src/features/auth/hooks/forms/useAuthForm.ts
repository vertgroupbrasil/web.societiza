'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { handleFormError } from '@societiza/handlers/error';
import {
  loginSchema,
  emptyLogin,
  forgotPasswordSchema,
  emptyForgotPassword,
  resetPasswordSchema,
  type LoginInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from '../../schemas/auth.schema';
import {
  useLogin,
  useForgotPassword,
  useResetPassword,
} from '../mutations/useAuthMutations';

// ── useLoginForm ──────────────────────────────────────────────────────────────

export function useLoginForm() {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: emptyLogin,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const loginMutation = useLogin();
  const [globalError, setGlobalError] = useState<string | undefined>();

  const onSubmit = form.handleSubmit(async (data) => {
    setGlobalError(undefined);
    try {
      await loginMutation.mutateAsync(data);
      toast.success('Autenticado com sucesso!', {
        description: 'Você está sendo redirecionado...',
      });
      // redirect é feito pelo useLogin.onSuccess
    } catch (err) {
      const parsed = handleFormError<LoginInput>(
        err,
        form.setError,
        setGlobalError,
      );
      toast.error('Credenciais inválidas', {
        description:
          parsed.globalError ?? 'Verifique seu e-mail e senha e tente novamente.',
      });
    }
  });

  return {
    form,
    onSubmit,
    globalError,
    isSubmitting: form.formState.isSubmitting || loginMutation.isPending,
  };
}

// ── useForgotPasswordForm ─────────────────────────────────────────────────────

export function useForgotPasswordForm() {
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: emptyForgotPassword,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const mutation = useForgotPassword();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await mutation.mutateAsync(data);
      setSubmitted(true);
      // toast já é exibido pelo useForgotPassword.onSuccess
    } catch {
      // toast já é exibido pelo useForgotPassword.onError
    }
  });

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting || mutation.isPending,
    submitted, // permite mostrar tela de confirmação após envio
  };
}

// ── useResetPasswordForm ──────────────────────────────────────────────────────

export function useResetPasswordForm(token: string) {
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, newPassword: '', confirmPassword: '' },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const mutation = useResetPassword();

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await mutation.mutateAsync({
        token: data.token,
        newPassword: data.newPassword,
      });
      // redirect é feito pelo useResetPassword.onSuccess
    } catch {
      // toast já é exibido pelo useResetPassword.onError
    }
  });

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting || mutation.isPending,
  };
}
