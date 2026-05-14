'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@shadcn/index';
import { useCurrentUser } from '@societiza/hooks/useCurrentUser';
import { accountancyService } from '@societiza/features/accountancy/server/services/accountancy.service';
import { accountancyQueryKeys } from '@societiza/features/accountancy/hooks/queries/useAccountancyQueries';
import {
  useAccountancyMembers,
  useSystemAdmins,
} from '../hooks/queries/useIdentityUserQueries';
import { useDeleteIdentityUser } from '../hooks/mutations/useIdentityUserMutations';
import type { UserListItem } from '../schemas/identity-user.schema';
import { IdentityUserListPanel } from './IdentityUserListPanel';
import { roleLabel } from '../lib/identity-user.utils';

const ADMIN_PAGE_SIZE = 100;

function getInactiveUsers(
  activeUsers: UserListItem[],
  allUsers: UserListItem[],
) {
  const activeIds = new Set(activeUsers.map((user) => user.id));
  return allUsers.filter((user) => !activeIds.has(user.id));
}

function countAdmins(users: UserListItem[], role: UserListItem['role']) {
  return users.filter((user) => user.role === role).length;
}

export function SystemAdminUsersScreen() {
  const currentUser = useCurrentUser();
  const [selectedAccountancyId, setSelectedAccountancyId] = useState('');
  const isSystemAdmin = currentUser?.role === 'SystemAdmin';

  const activeSystemAdminsQuery = useSystemAdmins(
    true,
    1,
    ADMIN_PAGE_SIZE,
    isSystemAdmin,
  );
  const allSystemAdminsQuery = useSystemAdmins(
    false,
    1,
    ADMIN_PAGE_SIZE,
    isSystemAdmin,
  );
  const accountanciesQuery = useQuery({
    queryKey: accountancyQueryKeys.list(1, ADMIN_PAGE_SIZE),
    queryFn: () => accountancyService.list(1, ADMIN_PAGE_SIZE),
    enabled: isSystemAdmin,
  });

  const activeMembersQuery = useAccountancyMembers(
    selectedAccountancyId,
    true,
    1,
    ADMIN_PAGE_SIZE,
    isSystemAdmin && !!selectedAccountancyId,
  );
  const allMembersQuery = useAccountancyMembers(
    selectedAccountancyId,
    false,
    1,
    ADMIN_PAGE_SIZE,
    isSystemAdmin && !!selectedAccountancyId,
  );

  const deleteSystemAdmin = useDeleteIdentityUser();
  const deleteAccountancyUser = useDeleteIdentityUser(selectedAccountancyId);

  const accountancies = useMemo(
    () => accountanciesQuery.data?.items ?? [],
    [accountanciesQuery.data?.items],
  );
  const activeSystemAdmins = activeSystemAdminsQuery.data?.items ?? [];
  const allSystemAdmins =
    allSystemAdminsQuery.data?.items ?? activeSystemAdmins;
  const inactiveSystemAdmins = getInactiveUsers(
    activeSystemAdmins,
    allSystemAdmins,
  );
  const activeMembers = activeMembersQuery.data?.items ?? [];
  const allMembers = allMembersQuery.data?.items ?? activeMembers;
  const inactiveMembers = getInactiveUsers(activeMembers, allMembers);
  const activeSystemAdminCount = countAdmins(activeSystemAdmins, 'SystemAdmin');
  const activeAccountancyAdminCount = countAdmins(
    activeMembers,
    'AccountancyAdmin',
  );

  useEffect(() => {
    if (!selectedAccountancyId && accountancies[0]) {
      setSelectedAccountancyId(accountancies[0].id);
    }
  }, [accountancies, selectedAccountancyId]);

  if (!isSystemAdmin) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Usuários administrativos
          </h1>
          <p className="text-sm text-muted-foreground">
            Esta área é restrita a administradores do sistema.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Usuários administrativos
        </h1>
        <p className="text-sm text-muted-foreground">
          Gerencie acessos administrativos da plataforma e das contabilidades.
        </p>
      </div>

      <Tabs defaultValue="system" className="gap-4">
        <TabsList>
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="accountancy">Contabilidades</TabsTrigger>
        </TabsList>

        <TabsContent value="system">
          <Tabs defaultValue="active" className="gap-4">
            <TabsList>
              <TabsTrigger value="active">Ativos</TabsTrigger>
              <TabsTrigger value="inactive">Inativos</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <IdentityUserListPanel
                title={`${roleLabel('SystemAdmin')} ativos`}
                description={`${activeSystemAdmins.length} administrador${
                  activeSystemAdmins.length === 1 ? '' : 'es'
                } com acesso à plataforma.`}
                users={activeSystemAdmins}
                currentUserId={currentUser?.id}
                activeAdminCount={activeSystemAdminCount}
                isLoading={activeSystemAdminsQuery.isLoading}
                isError={activeSystemAdminsQuery.isError}
                canRemove
                isRemoving={deleteSystemAdmin.isPending}
                emptyMessage={`Nenhum ${roleLabel('SystemAdmin')} ativo encontrado.`}
                onRemove={(userId) => deleteSystemAdmin.mutate(userId)}
              />
            </TabsContent>

            <TabsContent value="inactive">
              <IdentityUserListPanel
                title={`${roleLabel('SystemAdmin')} inativos`}
                description="Administradores removidos não têm acesso, mas permanecem no histórico."
                users={inactiveSystemAdmins}
                currentUserId={currentUser?.id}
                activeAdminCount={activeSystemAdminCount}
                isLoading={allSystemAdminsQuery.isLoading}
                isError={allSystemAdminsQuery.isError}
                isInactiveList
                emptyMessage={`Nenhum ${roleLabel('SystemAdmin')} inativo encontrado.`}
              />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="accountancy" className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Contexto da contabilidade</CardTitle>
              <CardDescription>
                Selecione uma contabilidade para visualizar seus usuários.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedAccountancyId}
                onValueChange={setSelectedAccountancyId}
                disabled={
                  accountanciesQuery.isLoading || accountancies.length === 0
                }
              >
                <SelectTrigger className="w-full sm:w-96">
                  <SelectValue placeholder="Selecione uma contabilidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {accountancies.map((accountancy) => (
                      <SelectItem key={accountancy.id} value={accountancy.id}>
                        {accountancy.tradeName ?? accountancy.legalName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Tabs defaultValue="active" className="gap-4">
            <TabsList>
              <TabsTrigger value="active">Ativos</TabsTrigger>
              <TabsTrigger value="inactive">Inativos</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <IdentityUserListPanel
                title="Usuários ativos"
                description={`${activeMembers.length} usuário${
                  activeMembers.length === 1 ? '' : 's'
                } com acesso nesta contabilidade.`}
                users={activeMembers}
                currentUserId={currentUser?.id}
                activeAdminCount={activeAccountancyAdminCount}
                isLoading={activeMembersQuery.isLoading}
                isError={activeMembersQuery.isError}
                canRemove={!!selectedAccountancyId}
                isRemoving={deleteAccountancyUser.isPending}
                emptyMessage="Nenhum usuário ativo encontrado."
                onRemove={(userId) => deleteAccountancyUser.mutate(userId)}
              />
            </TabsContent>

            <TabsContent value="inactive">
              <IdentityUserListPanel
                title="Usuários inativos"
                description="Usuários removidos não têm acesso, mas permanecem no histórico."
                users={inactiveMembers}
                currentUserId={currentUser?.id}
                activeAdminCount={activeAccountancyAdminCount}
                isLoading={allMembersQuery.isLoading}
                isError={allMembersQuery.isError}
                isInactiveList
                emptyMessage="Nenhum usuário inativo encontrado."
              />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
