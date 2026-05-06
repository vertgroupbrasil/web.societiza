import { z } from 'zod';
import { isValidCNPJ } from '../lib/cnpj.validator';

const onlyDigits = (value: string): string => value.replace(/\D/g, '');

// ====== Response schema (GET /{id} | GET /me | item de GET /) ======
export const accountancyDetailSchema = z.object({
  id: z.string().uuid(),
  cnpj: z.string(),
  legalName: z.string(),
  tradeName: z.string().nullable(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  phone: z.string(),
  email: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
});

// ====== Paged envelope (GET /) ======
export const pageMetaSchema = z.object({
  pageNumber: z.number().int(),
  pageSize: z.number().int(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  totalCount: z.number().int(),
  totalPages: z.number().int(),
});

export const pagedAccountanciesSchema = z.object({
  items: z.array(accountancyDetailSchema),
  page: pageMetaSchema,
});

// ====== Create / Update DTO ======
//
// Replace completo no PUT — `tradeName` e `email` precisam ser enviados
// (aceita null). Email vazio do form vira null antes de enviar.
export const accountancyFormSchema = z.object({
  cnpj: z
    .string()
    .min(1, 'CNPJ é obrigatório')
    .transform(onlyDigits)
    .refine((v) => v.length === 14, 'CNPJ deve ter 14 dígitos')
    .refine(isValidCNPJ, 'CNPJ inválido'),
  legalName: z
    .string()
    .min(1, 'Razão social é obrigatória')
    .max(150, 'Razão social não pode exceder 150 caracteres'),
  tradeName: z
    .string()
    .max(150, 'Nome fantasia não pode exceder 150 caracteres')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .min(1, 'Endereço é obrigatório')
    .max(200, 'Endereço não pode exceder 200 caracteres'),
  city: z
    .string()
    .min(1, 'Cidade é obrigatória')
    .max(100, 'Cidade não pode exceder 100 caracteres'),
  state: z
    .string()
    .length(2, 'UF deve ter 2 letras')
    .transform((v) => v.toUpperCase()),
  postalCode: z
    .string()
    .min(1, 'CEP é obrigatório')
    .transform(onlyDigits)
    .refine((v) => v.length === 8, 'CEP deve ter 8 dígitos'),
  phone: z
    .string()
    .min(1, 'Telefone é obrigatório')
    .transform(onlyDigits)
    .refine(
      (v) => v.length >= 9 && v.length <= 11,
      'Telefone deve ter entre 9 e 11 dígitos',
    ),
  email: z
    .string()
    .max(100, 'E-mail não pode exceder 100 caracteres')
    .email('E-mail inválido')
    .optional()
    .or(z.literal('')),
});

// Payload enviado ao backend (após normalização do form)
export const accountancyPayloadSchema = z.object({
  cnpj: z.string().length(14),
  legalName: z.string().min(1).max(150),
  tradeName: z.string().max(150).nullable(),
  address: z.string().min(1).max(200),
  city: z.string().min(1).max(100),
  state: z.string().length(2),
  postalCode: z.string().length(8),
  phone: z.string().min(9).max(11),
  email: z.string().email().max(100).nullable(),
});

// ====== Types ======
export type AccountancyDetail = z.infer<typeof accountancyDetailSchema>;
/**
 * @deprecated Prefira `AccountancyDetail`. Mantido apenas por compatibilidade
 * com módulos legados (workflow) que ainda referenciam o nome antigo.
 */
export type Accountancy = AccountancyDetail;
export type PagedAccountancies = z.infer<typeof pagedAccountanciesSchema>;
export type AccountancyFormInput = z.input<typeof accountancyFormSchema>;
export type AccountancyFormOutput = z.output<typeof accountancyFormSchema>;
export type AccountancyPayload = z.infer<typeof accountancyPayloadSchema>;

// Adapter form → payload (campos opcionais string vazia → null)
export const formToPayload = (
  form: AccountancyFormOutput,
): AccountancyPayload => ({
  cnpj: form.cnpj,
  legalName: form.legalName,
  tradeName: form.tradeName && form.tradeName.length > 0 ? form.tradeName : null,
  address: form.address,
  city: form.city,
  state: form.state,
  postalCode: form.postalCode,
  phone: form.phone,
  email: form.email && form.email.length > 0 ? form.email : null,
});
