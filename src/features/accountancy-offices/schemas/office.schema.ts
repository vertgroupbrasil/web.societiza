import { z } from 'zod';

// ============================================================
// PROPOSTO — contratos inferidos da spec accountancy-offices
// Aguardando implementação de backend
// ============================================================

// ---- Enums ----

export const officePlanSchema = z.enum(['Free', 'Escrivaninha', 'Executivo']);

export const officeStatusSchema = z.enum(['Active', 'Frozen']);

export const memberRoleSchema = z.enum(['Owner', 'Member']);

// ---- Office ----

export const officeSchema = z.object({
  id: z.string().uuid(),
  cnpj: z.string(),
  legalName: z.string(),
  tradeName: z.string().nullable(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  phone: z.string(),
  email: z.string().email().nullable(),
  description: z.string().nullable(),
  profilePhotoUrl: z.string().url().nullable(),
  bannerUrl: z.string().url().nullable(),
  plan: officePlanSchema,
  status: officeStatusSchema,
  processCount: z.number().int().min(0),
  memberCount: z.number().int().min(0),
  isOwner: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const officesSchema = z.array(officeSchema);

// ---- Member ----

export const memberSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  role: memberRoleSchema,
  avatarUrl: z.string().url().nullable(),
  joinedAt: z.coerce.date(),
});

export const membersSchema = z.array(memberSchema);

// ---- Invite ----

export const inviteLinkSchema = z.object({
  token: z.string(),
  url: z.string().url(),
  officeId: z.string().uuid(),
  createdAt: z.coerce.date(),
});

// ---- DTOs de Request ----

export const updateOfficeDTO = z.object({
  legalName: z.string().min(1, 'Razão social é obrigatória').max(150),
  tradeName: z.string().max(150).optional(),
  cnpj: z.string().min(14, 'CNPJ inválido'),
  address: z.string().min(1, 'Endereço é obrigatório').max(200),
  city: z.string().min(1, 'Cidade é obrigatória').max(100),
  state: z.string().length(2, 'UF deve ter 2 letras'),
  postalCode: z.string().min(8, 'CEP inválido'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  email: z
    .string()
    .email('E-mail inválido')
    .max(100)
    .optional()
    .or(z.literal('')),
  description: z.string().max(280, 'Descrição deve ter no máximo 280 caracteres').optional(),
  profilePhotoUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  bannerUrl: z.string().url('URL inválida').optional().or(z.literal('')),
});

export const createOfficeDTO = updateOfficeDTO;

export const inviteByEmailDTO = z.object({
  email: z.string().email('E-mail inválido'),
});

export const transferOwnershipDTO = z.object({
  memberId: z.string().uuid(),
});

// ---- Types ----

export type OfficePlan = z.infer<typeof officePlanSchema>;
export type OfficeStatus = z.infer<typeof officeStatusSchema>;
export type MemberRole = z.infer<typeof memberRoleSchema>;
export type Office = z.infer<typeof officeSchema>;
export type Offices = z.infer<typeof officesSchema>;
export type Member = z.infer<typeof memberSchema>;
export type Members = z.infer<typeof membersSchema>;
export type InviteLink = z.infer<typeof inviteLinkSchema>;
export type UpdateOfficeInput = z.infer<typeof updateOfficeDTO>;
export type CreateOfficeInput = z.infer<typeof createOfficeDTO>;
export type InviteByEmailInput = z.infer<typeof inviteByEmailDTO>;
export type TransferOwnershipInput = z.infer<typeof transferOwnershipDTO>;
