import { z } from 'zod';

// ====== Response schema (GET) ======
export const accountancySchema = z.object({
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
  updatedAt: z.coerce.date(),
});

export const accountanciesSchema = z.array(accountancySchema);

// ====== Create / Update DTO ======
export const createAccountancyDTO = z.object({
  cnpj: z.string().min(1, 'CNPJ é obrigatório'),
  legalName: z.string().min(1, 'Razão social é obrigatória').max(150),
  tradeName: z.string().max(150).optional(),
  address: z.string().min(1, 'Endereço é obrigatório').max(200),
  city: z.string().min(1, 'Cidade é obrigatória').max(100),
  state: z.string().length(2, 'UF deve ter 2 letras'),
  postalCode: z.string().min(1, 'CEP é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  email: z
    .string()
    .email('E-mail inválido')
    .max(100)
    .optional()
    .or(z.literal('')),
});

export const updateAccountancyDTO = createAccountancyDTO;

// ====== Types ======
export type Accountancy = z.infer<typeof accountancySchema>;
export type Accountancies = z.infer<typeof accountanciesSchema>;
export type CreateAccountancyInput = z.infer<typeof createAccountancyDTO>;
export type UpdateAccountancyInput = z.infer<typeof updateAccountancyDTO>;
