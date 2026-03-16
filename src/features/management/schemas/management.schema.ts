import { z } from '@societiza/lib/zod-portuguese';
import { Document } from '../domain/cnpj-cpf-validation';
import { formatDateBR, formatISOToBRDate } from '@societiza/lib/format';
import { paginationSchema } from '@societiza/types/pagination';

export const accountingSchema = z.object({
  id: z.string(),
  cnpj: Document,
  data_abertura: z.string().transform(formatDateBR),
  situacao: z.string(),
  tipo: z.string(),
  nome: z.string(),
  nome_fantasia: z.string(),
  porte: z.string(),
  natureza_juridica: z.string(),
  cod_atividade_principal: z.string(),
  desc_atividade_principal: z.string(),
  endereco: z.string(),
  cep: z.string(),
  created_at: z.string().transform(formatISOToBRDate),
  updated_at: z.string().transform(formatISOToBRDate),
});

export const accountiesSchema = paginationSchema.extend({
  results: z.object({
    empresas: z.array(accountingSchema),
  }),
});

export const emptyCNPJ = {
  cnpj: '',
};

export type Management = z.infer<typeof accountiesSchema>;
export type Accounting = z.infer<typeof accountingSchema>;
export type Accounties = z.infer<typeof accountiesSchema>;
