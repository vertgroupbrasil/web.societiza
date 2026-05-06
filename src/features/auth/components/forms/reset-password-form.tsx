'use client';

import { useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@societiza/components/ui/shadcnui/form';
import { Button } from '@societiza/components/ui/shadcnui/button';
import { Input } from '@societiza/components/ui/shadcnui/input';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useResetPasswordForm } from '../../hooks/forms/useAuthForm';

type Props = {
  token: string;
};

export function ResetPasswordForm({ token }: Props) {
  const { form, onSubmit, isSubmitting } = useResetPasswordForm(token);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
                  type={showNewPassword ? 'text' : 'password'}
                  error={fieldState.error?.message ?? undefined}
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
                  endAdornment={
                    <button
                      type="button"
                      aria-label={
                        showNewPassword ? 'Ocultar senha' : 'Mostrar senha'
                      }
                      aria-pressed={showNewPassword}
                      onClick={() => setShowNewPassword((current) => !current)}
                      className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  }
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
                  type={showConfirmPassword ? 'text' : 'password'}
                  error={fieldState.error?.message ?? undefined}
                  placeholder="Repita a senha"
                  autoComplete="new-password"
                  endAdornment={
                    <button
                      type="button"
                      aria-label={
                        showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'
                      }
                      aria-pressed={showConfirmPassword}
                      onClick={() =>
                        setShowConfirmPassword((current) => !current)
                      }
                      className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  }
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
