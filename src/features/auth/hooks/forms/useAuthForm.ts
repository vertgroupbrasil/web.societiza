'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { handleFormError } from '@flowtec/handlers/error';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Auth, authSchema, emptyAuth } from '../../schemas/auth.schema';
import { useAuthMutations } from '../mutations/useAuthMutations';

export function useLoginForm() {
  const form = useForm<Auth>({
    resolver: zodResolver(authSchema),
    defaultValues: emptyAuth,
    mode: 'onSubmit', // Define quando a validação acontece
    reValidateMode: 'onChange', // Re-valida ao alterar após o primeiro submit
  });

  const router = useRouter();
  const { login } = useAuthMutations();
  const [globalError, setGlobalError] = useState<string | undefined>();

  const onSubmit = form.handleSubmit(
    // Success callback - só executa se a validação passar
    async (data) => {
      setGlobalError(undefined);
      try {
        await login.mutateAsync(data);
        toast.success('Autenticado com sucesso!', {
          description: 'Você está sendo redirecionado...',
        });
        router.push('/dashboard');
      } catch (err) {
        const parsed = handleFormError<Auth>(
          err,
          form.setError,
          setGlobalError,
        );
        toast.error('Erro ao autenticar!', {
          description: parsed.globalError ?? 'Algo deu errado',
        });
      }
    },
  );

  return {
    form,
    onSubmit,
    formError: form.setError,
    globalError,
    isSubmitting: form.formState.isSubmitting || login.isPending,
  };
}
