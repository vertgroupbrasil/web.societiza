'use client';

import {
  Button,
  Card,
  CardContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@shadcn/index';
import { useCurrentUser } from '@societiza/hooks/useCurrentUser';
import {
  useAccountancyMembers,
  useMyProfile,
} from '../hooks/queries/useIdentityUserQueries';
import {
  useDeleteIdentityUser,
  usePromoteAccountancyMember,
} from '../hooks/mutations/useIdentityUserMutations';
import type { UserListItem } from '../schemas/identity-user.schema';
import { IdentityUserListPanel } from './IdentityUserListPanel';

const MEMBERS_PAGE_SIZE = 100;

function getInactiveUsers(
  activeUsers: UserListItem[],
  allUsers: UserListItem[],
) {
  const activeIds = new Set(activeUsers.map((user) => user.id));
  return allUsers.filter((user) => !activeIds.has(user.id));
}

function countActiveAdmins(users: UserListItem[]) {
  return users.filter((user) => user.role === 'AccountancyAdmin').length;
}

export function AccountancyMembersScreen() {
  const currentUser = useCurrentUser();
  const profileQuery = useMyProfile(true);
  const profile = profileQuery.data;
  const accountancyId = profile?.accountancyId ?? currentUser?.accountancyId;
  const role = profile?.role ?? currentUser?.role;
  const currentUserId = profile?.id ?? currentUser?.id;
  const isAccountancyAdmin = role === 'AccountancyAdmin';

  const activeMembersQuery = useAccountancyMembers(
    accountancyId,
    true,
    1,
    MEMBERS_PAGE_SIZE,
    !!accountancyId,
  );
  const allMembersQuery = useAccountancyMembers(
    accountancyId,
    false,
    1,
    MEMBERS_PAGE_SIZE,
    !!accountancyId && isAccountancyAdmin,
  );

  const promoteMember = usePromoteAccountancyMember(accountancyId ?? '');
  const deleteUser = useDeleteIdentityUser(accountancyId);

  const activeMembers = activeMembersQuery.data?.items ?? [];
  const allMembers = allMembersQuery.data?.items ?? activeMembers;
  const inactiveMembers = getInactiveUsers(activeMembers, allMembers);
  const activeAdminCount = countActiveAdmins(activeMembers);

  if (profileQuery.isLoading && !currentUser) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Membros</h1>
          <p className="text-sm text-muted-foreground">
            Carregando dados da contabilidade.
          </p>
        </div>
        <IdentityUserListPanel
          title="Membros"
          description="Buscando vínculo da sua conta com a contabilidade."
          users={[]}
          currentUserId={currentUserId}
          activeAdminCount={0}
          isLoading
          emptyMessage="Nenhum membro encontrado."
        />
      </div>
    );
  }

  if (profileQuery.isError && !accountancyId) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Membros</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie quem tem acesso à contabilidade.
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Não foi possível carregar seu perfil para identificar a contabilidade.
            </p>
            <Button variant="outline" onClick={() => void profileQuery.refetch()}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!accountancyId) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Membros</h1>
          <p className="text-sm text-muted-foreground">
            Seu usuário não está vinculado a uma contabilidade.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Membros</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie quem tem acesso à contabilidade.
        </p>
      </div>

      {isAccountancyAdmin ? (
        <Tabs defaultValue="active" className="gap-4">
          <TabsList>
            <TabsTrigger value="active">Ativos</TabsTrigger>
            <TabsTrigger value="inactive">Inativos</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <IdentityUserListPanel
              title="Membros ativos"
              description={`${activeMembers.length} membro${
                activeMembers.length === 1 ? '' : 's'
              } com acesso à contabilidade.`}
              users={activeMembers}
              currentUserId={currentUserId}
              activeAdminCount={activeAdminCount}
              isLoading={activeMembersQuery.isLoading}
              isError={activeMembersQuery.isError}
              canPromote
              canRemove
              isPromoting={promoteMember.isPending}
              isRemoving={deleteUser.isPending}
              emptyMessage="Nenhum membro ativo encontrado."
              onPromote={(userId) => promoteMember.mutate(userId)}
              onRemove={(userId) => deleteUser.mutate(userId)}
            />
          </TabsContent>

          <TabsContent value="inactive">
            <IdentityUserListPanel
              title="Membros inativos"
              description="Usuários removidos mantêm histórico preservado, mas não têm acesso."
              users={inactiveMembers}
              currentUserId={currentUserId}
              activeAdminCount={activeAdminCount}
              isLoading={allMembersQuery.isLoading}
              isError={allMembersQuery.isError}
              isInactiveList
              emptyMessage="Nenhum membro inativo encontrado."
            />
          </TabsContent>
        </Tabs>
      ) : (
        <IdentityUserListPanel
          title="Membros ativos"
          description={`${activeMembers.length} membro${
            activeMembers.length === 1 ? '' : 's'
          } na contabilidade.`}
          users={activeMembers}
          currentUserId={currentUserId}
          activeAdminCount={activeAdminCount}
          isLoading={activeMembersQuery.isLoading}
          isError={activeMembersQuery.isError}
          emptyMessage="Nenhum membro encontrado."
        />
      )}
    </div>
  );
}
