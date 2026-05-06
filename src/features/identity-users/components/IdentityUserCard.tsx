import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@shadcn/index';
import { ShieldCheck, Trash2 } from 'lucide-react';
import {
  getUserFullName,
  isUserDetail,
  type UserListItem,
} from '../schemas/identity-user.schema';
import {
  formatJoinedAt,
  getRemovalBlockReason,
  roleLabel,
  userInitials,
} from '../lib/identity-user.utils';

interface IdentityUserCardProps {
  user: UserListItem;
  currentUserId?: string | undefined;
  activeAdminCount: number;
  isInactive?: boolean | undefined;
  canPromote?: boolean | undefined;
  canRemove?: boolean | undefined;
  isPromoting?: boolean | undefined;
  isRemoving?: boolean | undefined;
  onPromote?: ((userId: string) => void) | undefined;
  onRemove?: ((userId: string) => void) | undefined;
}

export function IdentityUserCard({
  user,
  currentUserId,
  activeAdminCount,
  isInactive = false,
  canPromote = false,
  canRemove = false,
  isPromoting = false,
  isRemoving = false,
  onPromote,
  onRemove,
}: IdentityUserCardProps) {
  const name = getUserFullName(user);
  const removalBlockReason = getRemovalBlockReason({
    currentUserId,
    target: user,
    activeAdminCount,
  });
  const showPromote =
    !isInactive && canPromote && user.role === 'AccountancyEmployee';
  const showRemove = !isInactive && canRemove;

  return (
    <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="size-9">
          <AvatarFallback className="text-xs font-medium">
            {userInitials(user)}
          </AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate text-sm font-medium leading-none">
              {name}
              {user.id === currentUserId ? (
                <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                  (você)
                </span>
              ) : null}
            </span>
            <Badge variant="secondary" className="px-1.5 py-0 text-xs">
              {roleLabel(user.role)}
            </Badge>
            {isInactive ? (
              <Badge variant="outline" className="px-1.5 py-0 text-xs">
                Inativo
              </Badge>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {isUserDetail(user) ? <span>{user.email}</span> : null}
            {isUserDetail(user) ? (
              <span>Entrada em {formatJoinedAt(user.joinedAt)}</span>
            ) : null}
            {isUserDetail(user) && user.invitationLinkId ? (
              <span>Convite vinculado</span>
            ) : null}
          </div>
        </div>
      </div>

      {(showPromote || showRemove) && (
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {showPromote ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={isPromoting}
                >
                  <ShieldCheck />
                  Promover
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Promover membro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {name} passará a ter permissões de administrador da
                    contabilidade.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onPromote?.(user.id)}>
                    Promover
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}

          {showRemove && removalBlockReason ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled
                    aria-label={`Remover ${name}`}
                  >
                    <Trash2 />
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{removalBlockReason}</p>
              </TooltipContent>
            </Tooltip>
          ) : null}

          {showRemove && !removalBlockReason ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground hover:text-destructive"
                  disabled={isRemoving}
                  aria-label={`Remover ${name}`}
                >
                  <Trash2 />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remover acesso?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {name} perderá acesso à contabilidade imediatamente. O
                    histórico de autoria será preservado.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => onRemove?.(user.id)}
                  >
                    Remover acesso
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}
        </div>
      )}
    </div>
  );
}
