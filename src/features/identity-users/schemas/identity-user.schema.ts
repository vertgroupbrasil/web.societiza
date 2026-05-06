import { z } from 'zod';

export const identityRoleSchema = z.enum([
  'SystemAdmin',
  'AccountancyAdmin',
  'AccountancyEmployee',
]);

export const userProfileSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  role: identityRoleSchema,
  accountancyId: z.string().uuid().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
});

export const userDetailSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  role: identityRoleSchema,
  joinedAt: z.coerce.date(),
  invitationLinkId: z.string().uuid().nullable(),
});

export const userSummarySchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  role: identityRoleSchema,
});

export const userListItemSchema = z.union([
  userDetailSchema,
  userSummarySchema,
]);

export const pageMetaSchema = z.object({
  pageNumber: z.number().int(),
  pageSize: z.number().int(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  totalCount: z.number().int(),
  totalPages: z.number().int(),
});

export const pagedUserListSchema = z.object({
  items: z.array(userListItemSchema),
  page: pageMetaSchema,
});

export const pagedUserDetailsSchema = z.object({
  items: z.array(userDetailSchema),
  page: pageMetaSchema,
});

export const updateProfilePayloadSchema = z.object({
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
});

export const profileFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, 'Informe seu nome completo')
    .refine((value) => value.split(/\s+/).filter(Boolean).length >= 2, {
      message: 'Informe nome e sobrenome',
    }),
});

export type IdentityRole = z.infer<typeof identityRoleSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type UserDetail = z.infer<typeof userDetailSchema>;
export type UserSummary = z.infer<typeof userSummarySchema>;
export type UserListItem = z.infer<typeof userListItemSchema>;
export type PagedUserList = z.infer<typeof pagedUserListSchema>;
export type PagedUserDetails = z.infer<typeof pagedUserDetailsSchema>;
export type UpdateProfilePayload = z.infer<typeof updateProfilePayloadSchema>;
export type ProfileFormInput = z.infer<typeof profileFormSchema>;

export function getUserFullName(
  user: Pick<UserListItem, 'firstName' | 'lastName'>,
) {
  return `${user.firstName} ${user.lastName}`.trim();
}

export function splitFullName(fullName: string): UpdateProfilePayload {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? '';
  const lastName = parts.slice(1).join(' ');

  return updateProfilePayloadSchema.parse({ firstName, lastName });
}

export function isUserDetail(user: UserListItem): user is UserDetail {
  return 'email' in user;
}
