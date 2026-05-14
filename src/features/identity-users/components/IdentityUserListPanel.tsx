import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@shadcn/index';
import { Users } from 'lucide-react';
import type { UserListItem } from '../schemas/identity-user.schema';
import { IdentityUserCard } from './IdentityUserCard';

interface IdentityUserListPanelProps {
  title: string;
  description: string;
  users: UserListItem[];
  currentUserId?: string | undefined;
  activeAdminCount: number;
  isLoading?: boolean | undefined;
  isError?: boolean | undefined;
  isInactiveList?: boolean | undefined;
  canPromote?: boolean | undefined;
  canRemove?: boolean | undefined;
  isPromoting?: boolean | undefined;
  isRemoving?: boolean | undefined;
  emptyMessage: string;
  onPromote?: ((userId: string) => void) | undefined;
  onRemove?: ((userId: string) => void) | undefined;
}

export function IdentityUserListPanel({
  title,
  description,
  users,
  currentUserId,
  activeAdminCount,
  isLoading = false,
  isError = false,
  isInactiveList = false,
  canPromote = false,
  canRemove = false,
  isPromoting = false,
  isRemoving = false,
  emptyMessage,
  onPromote,
  onRemove,
}: IdentityUserListPanelProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="size-5 text-muted-foreground" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="divide-y">
        {isLoading ? (
          <>
            <UserListSkeleton />
            <UserListSkeleton />
            <UserListSkeleton />
          </>
        ) : isError ? (
          <div className="py-12 text-center text-sm text-destructive">
            Não foi possível carregar os usuários. Tente novamente em instantes.
          </div>
        ) : users.length > 0 ? (
          users.map((user) => (
            <IdentityUserCard
              key={user.id}
              user={user}
              currentUserId={currentUserId}
              activeAdminCount={activeAdminCount}
              isInactive={isInactiveList}
              canPromote={canPromote}
              canRemove={canRemove}
              isPromoting={isPromoting}
              isRemoving={isRemoving}
              onPromote={onPromote}
              onRemove={onRemove}
            />
          ))
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            <p className="text-sm">{emptyMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function UserListSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3">
      <Skeleton className="size-9 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-3 w-64" />
      </div>
      <Skeleton className="size-8 rounded-md" />
    </div>
  );
}
