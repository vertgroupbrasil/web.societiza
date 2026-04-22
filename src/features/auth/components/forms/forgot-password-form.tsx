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
import { Mail, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useForgotPasswordForm } from '../../hooks/forms/useAuthForm';

export function ForgotPasswordForm() {
  const { form, onSubmit, isSubmitting, submitted } = useForgotPasswordForm();

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-4">
        <CheckCircle className="size-12 text-emerald-500" />
        <div className="space-y-1">
          <p className="font-semibold text-base">Verifique seu e-mail</p>
          <p className="text-sm text-muted-foreground">
            Se esse endereço estiver cadastrado, você receberá um link de
            redefinição em até alguns minutos.
          </p>
        </div>
        <Link
          href="/login"
          className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
        >
          Voltar ao login
        </Link>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>E-mail da conta</FormLabel>
              <FormControl>
                <Input
                  error={fieldState.error?.message ?? undefined}
                  icon={Mail}
                  placeholder="seu@email.com"
                  autoComplete="email"
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
          {isSubmitting ? 'Enviando...' : 'Enviar link de redefinição'}
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
