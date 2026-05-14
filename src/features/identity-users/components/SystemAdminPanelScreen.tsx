'use client';

import { DataTableDemo } from '@accountancy/components/data-table';
import {
  Card,
  CardContent,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@shadcn/index';
import { useCurrentUser } from '@societiza/hooks/useCurrentUser';
import { useMyProfile } from '../hooks/queries/useIdentityUserQueries';
import { SystemAdminUsersScreen } from './SystemAdminUsersScreen';

export function SystemAdminPanelScreen() {
  const currentUser = useCurrentUser();
  const { data: profile, isLoading: isProfileLoading } =
    useMyProfile(!!currentUser);
  const role = profile?.role ?? currentUser?.role;

  if (isProfileLoading || (!currentUser && !role)) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-[28rem] w-full rounded-lg" />
      </div>
    );
  }

  if (role !== 'SystemAdmin') {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">
            Painel admin
          </h1>
          <p className="text-sm text-muted-foreground">
            Esta área é restrita a administradores do sistema.
          </p>
        </div>
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Você não tem permissão para visualizar as ferramentas administrativas.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-6 overflow-hidden">
      <div className="flex-shrink-0">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">
            Painel admin
          </h1>
          <p className="text-sm text-muted-foreground">
            Ferramentas administrativas restritas ao administrador do sistema.
          </p>
        </div>
      </div>

      <Tabs defaultValue="accountancies" className="min-h-0 flex-1 gap-4">
        <TabsList>
          <TabsTrigger value="accountancies">Contabilidades</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
        </TabsList>

        <TabsContent value="accountancies" className="min-h-0">
          <DataTableDemo />
        </TabsContent>

        <TabsContent value="users">
          <SystemAdminUsersScreen />
        </TabsContent>
      </Tabs>
    </div>
  );
}
