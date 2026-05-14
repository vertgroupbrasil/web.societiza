'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Skeleton,
} from '@shadcn/index';
import { useCurrentUser } from '@societiza/hooks/useCurrentUser';
import { useMyProfile } from '@societiza/features/identity-users/hooks/queries/useIdentityUserQueries';
import { useUpdateMyProfile } from '@societiza/features/identity-users/hooks/mutations/useIdentityUserMutations';
import {
  getUserFullName,
  profileFormSchema,
  splitFullName,
  type ProfileFormInput,
} from '@societiza/features/identity-users/schemas/identity-user.schema';
import { roleLabel } from '@societiza/features/identity-users/lib/identity-user.utils';

export function SettingsProfileScreen() {
  const currentUser = useCurrentUser();
  const { data: profile, isLoading } = useMyProfile(!!currentUser);
  const updateProfile = useUpdateMyProfile();

  const form = useForm<ProfileFormInput>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: currentUser?.name ?? '',
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({ fullName: getUserFullName(profile) });
    }
  }, [form, profile]);

  const user = profile
    ? {
        name: getUserFullName(profile),
        email: profile.email,
        initials: `${profile.firstName[0] ?? ''}${profile.lastName[0] ?? ''}`,
        role: profile.role,
        accountancyId: profile.accountancyId ?? undefined,
      }
    : (currentUser ?? {
        name: 'Usuário',
        email: 'E-mail indisponível',
        initials: 'U',
        role: undefined,
        accountancyId: undefined,
      });

  const onSubmit = (data: ProfileFormInput) => {
    updateProfile.mutate(splitFullName(data.fullName));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Perfil</h1>
        <p className="text-sm text-muted-foreground">
          Veja os dados usados na sua sessão atual.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados da conta</CardTitle>
          <CardDescription>
            Estas informações vêm do cadastro da sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <Skeleton className="size-16 rounded-lg" />
              <div className="flex flex-1 flex-col gap-3">
                <Skeleton className="h-5 w-52" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <Avatar className="size-16 rounded-lg">
                <AvatarFallback className="rounded-lg text-lg font-semibold">
                  {user.initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-semibold">{user.name}</span>
                  <span className="truncate text-sm text-muted-foreground">
                    {user.email}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{roleLabel(user.role)}</Badge>
                  {user.accountancyId ? (
                    <Badge variant="outline">Escritório vinculado</Badge>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edição de perfil</CardTitle>
          <CardDescription>
            O e-mail não pode ser alterado neste momento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="fullName"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input
                        error={fieldState.error?.message ?? undefined}
                        placeholder="Seu nome e sobrenome"
                        autoComplete="name"
                        disabled={updateProfile.isPending}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-2">
                <FormLabel>E-mail</FormLabel>
                <Input value={user.email} disabled readOnly />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  loading={updateProfile.isPending}
                  disabled={updateProfile.isPending}
                >
                  {updateProfile.isPending ? 'Salvando...' : 'Salvar perfil'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
