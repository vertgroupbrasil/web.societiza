import { z } from 'zod';
import { addressSchema } from './address.schema';

const estadoCivilEnum = z.enum([
  'solteiro',
  'casado',
  'separado',
  'divorciado',
  'viuvo',
]);

const regimeCasamentoEnum = z.enum([
  'separacao_total',
  'comunhao_parcial',
  'comunhao_universal',
  'participacao_final',
]);

const tipoAdministradorEnum = z.enum([
  'conjunto',
  'isoladamente',
  'nao_aplica',
]);

export const socioSchema = z
  .object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    nacionalidade: z.string().min(1, 'Nacionalidade é obrigatória'),
    data_nascimento: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
    estado_civil: estadoCivilEnum,
    regime_casamento: regimeCasamentoEnum.optional(),
    profissao: z.string().min(1, 'Profissão é obrigatória'),
    cpf: z
      .string()
      .regex(/^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido')
      .transform((val) => val.replace(/\D/g, ''))
      .refine((val) => val.length === 11, 'CPF deve ter 11 dígitos'),
    rg: z
      .string()
      .max(14, 'RG não pode ter mais de 14 caracteres')
      .min(1, 'RG é obrigatório'),
    orgao_expedidor: z
      .string()
      .max(8, 'Órgão expedidor não pode ter mais de 8 caracteres')
      .min(1, 'Órgão expedidor é obrigatório'),
    uf: z.string().length(2, 'UF deve ter 2 caracteres').toUpperCase(),
    administrador: z.boolean(),
    tipo_administrador: tipoAdministradorEnum.optional(),
    qtd_cotas: z
      .number()
      .int()
      .positive('Quantidade de cotas deve ser positiva'),
    endereco: addressSchema,
  })
  .refine(
    (data) => {
      if (data.estado_civil === 'casado') {
        return data.regime_casamento;
      }
      return true;
    },
    {
      message: "Regime de casamento é obrigatório para estado civil 'casado'",
      path: ['regime_casamento'],
    },
  )
  .refine(
    (data) => {
      if (data.administrador) {
        return data.tipo_administrador;
      }
      return true;
    },
    {
      message: 'Tipo de administrador é obrigatório quando é administrador',
      path: ['tipo_administrador'],
    },
  );

export const _partners = z.object({
  empresa_id: z.string().uuid('ID da empresa deve ser um UUID válido'),
  socios: z.array(socioSchema),
});
