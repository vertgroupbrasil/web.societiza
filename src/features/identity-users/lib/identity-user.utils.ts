import type {
  IdentityRole,
  UserListItem,
} from '../schemas/identity-user.schema';
import { getUserFullName } from '../schemas/identity-user.schema';

export function roleLabel(role?: IdentityRole | string) {
  switch (role) {
    case 'SystemAdmin':
      return 'Administrador do Sistema';
    case 'AccountancyAdmin':
      return 'Administrador da Contabilidade';
    case 'AccountancyEmployee':
      return 'Colaborador da Contabilidade';
    default:
      return 'Usuário';
  }
}

export function memberRoleLabel(role?: string) {
  switch (role) {
    case 'Owner':
      return 'Administrador';
    case 'Member':
      return 'Membro';
    default:
      return 'Membro';
  }
}

export function userInitials(
  user: Pick<UserListItem, 'firstName' | 'lastName'>,
) {
  return `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();
}

export function formatJoinedAt(date?: Date) {
  if (!date) return '';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function getRemovalBlockReason({
  currentUserId,
  target,
  activeAdminCount,
}: {
  currentUserId?: string | undefined;
  target: UserListItem;
  activeAdminCount: number;
}) {
  if (target.id === currentUserId) {
    return 'Você não pode remover o próprio acesso.';
  }

  if (target.role === 'AccountancyAdmin' && activeAdminCount <= 1) {
    return 'Não é possível remover o último administrador da contabilidade.';
  }

  if (target.role === 'SystemAdmin' && activeAdminCount <= 1) {
    return 'Não é possível remover o último administrador do sistema.';
  }

  return null;
}

export function memberSearchText(user: UserListItem) {
  return `${getUserFullName(user)} ${user.role}`.toLowerCase();
}
