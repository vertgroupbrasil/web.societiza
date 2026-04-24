'use client';

import {
  Avatar,
  AvatarFallback,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shadcn/index';
import { useCurrentUser } from '@societiza/hooks/useCurrentUser';

function roleLabel(role?: string) {
  switch (role) {
    case 'SystemAdmin':
      return 'Administrador do sistema';
    case 'AccountancyAdmin':
      return 'Administrador do escritório';
    case 'AccountancyEmployee':
      return 'Colaborador do escritório';
    default:
      return 'Usuário';
  }
}

export function SettingsProfileScreen() {
  const currentUser = useCurrentUser();
  const user = currentUser ?? {
    name: 'Usuário',
    email: 'E-mail indisponível',
    initials: 'U',
    role: undefined,
    accountancyId: undefined,
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
            Estas informações vêm do token de acesso atual.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edição de perfil</CardTitle>
          <CardDescription>
            A atualização de nome, foto e dados pessoais será habilitada quando
            o contrato de perfil estiver disponível no backend.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
