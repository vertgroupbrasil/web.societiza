import type { IdentityRole } from '@societiza/features/identity-users/schemas/identity-user.schema';

const TEMPLATE_MANAGER_ROLES: IdentityRole[] = ['SystemAdmin', 'AccountancyAdmin'];

export function canManageTemplates(role: IdentityRole | undefined): boolean {
  if (!role) return false;
  return TEMPLATE_MANAGER_ROLES.includes(role);
}
