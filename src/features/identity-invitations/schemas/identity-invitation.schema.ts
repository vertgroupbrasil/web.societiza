import { z } from 'zod';
import { identityRoleSchema } from '@societiza/features/identity-users/schemas/identity-user.schema';

export const invitationLinkStatusSchema = z.enum([
  'Active',
  'Expired',
  'Exhausted',
]);

export const createInvitationLinkPayloadSchema = z.object({
  targetRole: identityRoleSchema,
  accountancyId: z.string().uuid().nullable().optional(),
  maxUses: z.number().int().min(1).nullable().optional(),
});

export const createInvitationLinkResponseSchema = z.object({
  id: z.string().uuid(),
  token: z.string(),
  url: z.string().url(),
  expiresAt: z.coerce.date(),
});

export const registerInvitationUserPayloadSchema = z
  .object({
    token: z.string().min(1, 'Link de convite inválido'),
    firstName: z.string().min(1, 'Nome é obrigatório'),
    lastName: z.string().min(1, 'Sobrenome é obrigatório'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
    confirmPassword: z
      .string()
      .min(8, 'Confirmação deve ter pelo menos 8 caracteres'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export const identifierResponseSchema = z.object({
  id: z.string().uuid(),
});

export const invitationLinkUserSchema = z.object({
  userId: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  joinedAt: z.coerce.date(),
});

export const invitationLinkDetailSchema = z.object({
  id: z.string().uuid(),
  targetRole: identityRoleSchema,
  status: invitationLinkStatusSchema,
  accountancyId: z.string().uuid().nullable(),
  createdByUserId: z.string().uuid(),
  maxUses: z.number().int(),
  uses: z.number().int(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  url: z.string().url(),
});

export const invitationLinkByIdSchema = invitationLinkDetailSchema.extend({
  users: z.array(invitationLinkUserSchema),
});

export const pageMetaSchema = z.object({
  pageNumber: z.number().int(),
  pageSize: z.number().int(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  totalCount: z.number().int(),
  totalPages: z.number().int(),
});

export const pagedInvitationLinksSchema = z.object({
  items: z.array(invitationLinkDetailSchema),
  page: pageMetaSchema,
});

export type InvitationLinkStatus = z.infer<typeof invitationLinkStatusSchema>;
export type CreateInvitationLinkPayload = z.infer<
  typeof createInvitationLinkPayloadSchema
>;
export type CreateInvitationLinkResponse = z.infer<
  typeof createInvitationLinkResponseSchema
>;
export type RegisterInvitationUserPayload = z.infer<
  typeof registerInvitationUserPayloadSchema
>;
export type IdentifierResponse = z.infer<typeof identifierResponseSchema>;
export type InvitationLinkDetail = z.infer<typeof invitationLinkDetailSchema>;
export type InvitationLinkById = z.infer<typeof invitationLinkByIdSchema>;
export type PagedInvitationLinks = z.infer<typeof pagedInvitationLinksSchema>;

export function invitationLinkStatusLabel(
  status?: InvitationLinkStatus | string,
) {
  switch (status) {
    case 'Active':
      return 'Ativo';
    case 'Expired':
      return 'Expirado';
    case 'Exhausted':
      return 'Esgotado';
    default:
      return 'Indisponível';
  }
}
