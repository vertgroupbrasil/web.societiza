import { z } from 'zod';
import { stageSchema, stagesSchema } from './stage.schema';
import { accountingSchema } from '@societiza/features/management/schemas/management.schema';

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

export const processSchemaDTO = z.object({
  nome: z.string(),
  contabilidade_id: z.string().uuid(),
  tipo_processo_id: z.string().uuid(),
  etapa_id: z.string().uuid(),
});

export const updateProcessSchema = z.object({
  processo_id: z.string().uuid(),
  etapa_id: z.string().uuid(),
  tarefas: z.array(tasksSchema),
});

export const processTypeSchema = z.object({
  id: z.string().uuid(),
  descricao: z.string(),
});

export const processTypesSchema = z.object({
  tipo_processo: z.array(processTypeSchema),
});

export const processSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
  contabilidade: accountingSchema.partial(),
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
  tipo_processo_id: '',
  etapa_id: '',
};
