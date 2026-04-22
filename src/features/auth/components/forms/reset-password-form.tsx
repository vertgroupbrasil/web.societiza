'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@societiza/components/ui/shadcnui/form';
import { Button } from '@societiza/components/ui/shadcnui/button';
import { Input } from '@societiza/components/ui/shadcnui/input';
import Link from 'next/link';
import { useResetPasswordForm } from '../../hooks/forms/useAuthForm';

type Props = {
  token: string;
};

export function ResetPasswordForm({ token }: Props) {
  const { form, onSubmit, isSubmitting } = useResetPasswordForm(token);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Campo oculto com o token */}
        <input type="hidden" {...form.register('token')} />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Nova senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  error={fieldState.error?.message ?? undefined}
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Confirmar nova senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  error={fieldState.error?.message ?? undefined}
                  placeholder="Repita a senha"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          loading={isSubmitting}
          variant="default"
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Redefinindo...' : 'Redefinir senha'}
        </Button>

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Voltar ao login
          </Link>
        </div>
      </form>
    </Form>
  );
}
