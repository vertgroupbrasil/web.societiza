import { z } from 'zod';
import { addressSchema } from './address.schema';

export const infoAdicionaisSchema = z.object({
  resp_tecnica: z.boolean().default(false),
  nome_responsavel: z.string().optional(),
  nmr_carteira_profissional: z.string().optional(),
  uf: z.string().optional(),
  area_resp: z.string().optional(),
});

export const _companyData = z.object({
  processo_id: z.string().uuid('ID do processo deve ser um UUID válido'),
  opcoes_nome_empresa: z
    .array(z.string().min(1, 'Nome não pode estar vazio'))
    .length(3, 'Deve conter exatamente 3 opções de nome'),
  nome_fantasia: z.string().min(1, 'Nome fantasia é obrigatório'),
  endereco: addressSchema,
  inscricao_imob: z
    .string()
    .regex(/^\d{2}-\d{3}-\d{3}\.\d{3}-\d$/, 'Formato inválido'),
  telefone: z
    .string()
    .regex(/^\d{10,11}$/, 'Telefone deve ter 10 ou 11 dígitos')
    .transform((val) => val.replace(/\D/g, '')),
  email: z.string().email('Email inválido'),

  // ✅ CORREÇÃO: Use preprocess em vez de union
  val_capital_social: z.preprocess(
    (val) => (typeof val === 'string' ? Number(val) : val),
    z.number().positive('Deve ser positivo'),
  ),

  capital_integralizado: z.boolean(),
  data_integralizacao: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD')
    .optional(),
  empresa_anexa_resid: z.boolean(),
  endereco_apenas_contato: z.boolean(),
  area_empresa: z.preprocess(
    (val) => (typeof val === 'string' ? Number(val) : val),
    z.number().positive('Deve ser positivo'),
  ),

  info_adicionais: infoAdicionaisSchema,

  // Campos opcionais da API
  id: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().nullable().optional(),
});