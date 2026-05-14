'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { Eye, EyeOff, Mail, User } from 'lucide-react';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
} from '@shadcn/index';
import { useRegisterInvitationUser } from '../hooks/mutations/useIdentityInvitationMutations';
import {
  registerInvitationUserPayloadSchema,
  type RegisterInvitationUserPayload,
} from '../schemas/identity-invitation.schema';

type InvitationRegisterFormProps = {
  token: string | undefined;
};

export function InvitationRegisterForm({ token }: InvitationRegisterFormProps) {
  const router = useRouter();
  const registerInvitationUser = useRegisterInvitationUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterInvitationUserPayload>({
    resolver: zodResolver(registerInvitationUserPayloadSchema),
    defaultValues: {
      token: token ?? '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  if (!token) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center">
        <p className="text-sm font-medium">Link de convite inválido</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Abra novamente o link completo enviado pelo administrador.
        </p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/login">Voltar ao login</Link>
        </Button>
      </div>
    );
  }

  const onSubmit = form.handleSubmit(async (data) => {
    await registerInvitationUser.mutateAsync(data);
    router.push('/login?cadastro=sucesso');
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <input type="hidden" {...form.register('token')} />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    icon={User}
                    placeholder="Seu nome"
                    autoComplete="given-name"
                    error={fieldState.error?.message}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Sobrenome</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Seu sobrenome"
                    autoComplete="family-name"
                    error={fieldState.error?.message}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  icon={Mail}
                  type="email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  error={fieldState.error?.message}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
                  error={fieldState.error?.message}
                  endAdornment={
                    <button
                      type="button"
                      aria-label={
                        showPassword ? 'Ocultar senha' : 'Mostrar senha'
                      }
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword((current) => !current)}
                      className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none"
                    >
                      {showPassword ? (
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
              <FormLabel>Confirmar senha</FormLabel>
              <FormControl>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repita a senha"
                  autoComplete="new-password"
                  error={fieldState.error?.message}
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
          type="submit"
          className="w-full"
          loading={registerInvitationUser.isPending}
          disabled={registerInvitationUser.isPending}
        >
          {registerInvitationUser.isPending ? 'Cadastrando...' : 'Criar conta'}
        </Button>

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Já tenho conta
          </Link>
        </div>
      </form>
    </Form>
  );
}
