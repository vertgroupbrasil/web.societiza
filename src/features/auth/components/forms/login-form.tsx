'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@flowtec/components/ui/shadcnui/form';
import { useLoginForm } from '../../hooks/useAuthForm';
import { Button } from '@flowtec/components/ui/shadcnui/button';
import { Input } from '@flowtec/components/ui/shadcnui/input';
import { Mail } from 'lucide-react';

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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  error={fieldState.error?.message ?? undefined}
                  icon={Mail}
                  placeholder="seu@email.com"
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
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  error={fieldState.error?.message ?? undefined}
                  placeholder="********"
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
