import { z } from 'zod';
import { stageSchema, stagesSchema } from './stage.schema';

const contabilidadeSchema = z.object({
  id: z.string(),
  cnpj: z.string(),
  data_abertura: z.string(),
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
  created_at: z.string(),
  updated_at: z.string(),
});

export const taskSchema = z.object({
  id: z.string().uuid(),
  descricao: z.string(),
  etapa: stageSchema,
  obrigatoria: z.coerce.boolean(),
});

export const tasksSchema = z.object({
  id: z.string().uuid(),
  etapa: stageSchema,
  tarefa: taskSchema,
  concluida: z.coerce.boolean(),
  sequencia: z.coerce.number(),
  nao_aplicavel: z.coerce.boolean(),
  expire_at: z.coerce.date().nullable(),
  tipo_tributacao: z.string().optional(),
});

export const workflowProcessTypeEnum = z.enum(['Abertura', 'Alteracao', 'Baixa']);

export const processSchemaDTO = z.object({
  nome: z.string(),
  contabilidade_id: z.string().uuid(),
  tipo_processo_id: workflowProcessTypeEnum,
  template_id: z.string().uuid().optional(),
  etapa_id: z.string().uuid().optional(),
});

export const updateProcessSchema = z.object({
  processo_id: z.string().uuid(),
  etapa_id: z.string().uuid(),
  tarefas: z.array(tasksSchema),
});

export const processTypeSchema = z.object({
  id: z.string(),
  descricao: z.string(),
});

export const processTypesSchema = z.object({
  tipo_processo: z.array(processTypeSchema),
});

export const processSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
  contabilidade: contabilidadeSchema.partial(),
  etapa: stageSchema,
  tipo_processo: processTypeSchema,
  observacao: z.string().nullable(),
  created_at: z.coerce.date(),
  expire_at: z.coerce.date(),
  tarefas: z.array(tasksSchema),
  formulario_abertura_id: z.string().uuid().nullable().optional(),
  isOptimistic: z.coerce.boolean().optional(),
});

export const processByIdSchema = z.object({
  processo: processSchema,
});

export const stagesProcessSchema = stageSchema.extend({
  processos: z.array(processSchema),
});

export const processByStagesSchema = stagesSchema.extend({
  processos_por_etapa: z.array(stagesProcessSchema),
});

export const updateTaskSchema = z.object({
  id: z.string().uuid(),
  concluida: z.string(),
  nao_aplicavel: z.string(),
  tipo_tributacao: z.string().optional(),
  expire_at: z.coerce.date().nullable().optional(),
});

export const updateProcessSchemaDTO = processSchema.partial().extend({
  processo_id: z.string().uuid(),
  etapa_id: z.string().uuid(),
  tipo_processo_id: z.string().uuid().optional(),
  tarefas: z.array(updateTaskSchema).optional(),
});

export const emptyProcess = {
  nome: '',
  contabilidade_id: '',
  tipo_processo_id: 'Abertura' as const,
  template_id: '',
  etapa_id: undefined,
};
