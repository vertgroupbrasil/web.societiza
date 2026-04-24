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
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { useLoginForm } from '../../hooks/forms/useAuthForm';

export function LoginForm() {
  const { form, onSubmit, isSubmitting } = useLoginForm();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
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

        {/* Senha */}
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Senha</FormLabel>
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  Esqueci minha senha
                </Link>
              </div>
              <FormControl>
                <Input
                  type="password"
                  error={fieldState.error?.message ?? undefined}
                  placeholder="********"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Botão */}
        <Button
          loading={isSubmitting}
          variant="default"
          effect="shineHover"
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </Form>
  );
}
