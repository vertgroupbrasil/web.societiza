import {
  customMessage,
  portugueseMessages,
  z,
} from '@flowtec/lib/zod-portuguese';
import { stageSchema, stagesSchema } from './stage.schema';
import { accountingSchema } from '@flowtec/features/management/schemas/management.schema';

export const taskSchema = z.object({
  id: z.string().uuid(),
  descricao: z.string(),
  etapa: stageSchema,
  obrigatoria: z.coerce.boolean(),
});

export const tasksSchema = z.object({
  id: z.string().uuid(),
  etapa: stageSchema,
  concluida: z.coerce.boolean(),
  nao_aplicavel: z.coerce.boolean(),
  expire_at: z.coerce.date().nullable(),
  tipo_tributacao: z.string().nullable(),
});

export const processSchemaDTO = z.object({
  nome: z.string(customMessage(portugueseMessages.required)),
  contabilidade_id: z.string().uuid(customMessage(portugueseMessages.uuid)),
  tipo_processo_id: z.string().uuid(customMessage(portugueseMessages.uuid)),
  etapa_id: z.string().uuid(customMessage(portugueseMessages.uuid)),
});

export const updateProcessSchemaDTO = processSchemaDTO.partial().extend({
  processo_id: z.string(customMessage(portugueseMessages.required)),
  tarefas: taskSchema.partial(),
});

export const processTypeSchema = z.object({
  id: z.string().uuid(),
  descricao: z.string(),
});

export const processesTypeSchema = z.object({
  tipo_processo: z.array(processTypeSchema),
});

export const processSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
  contabilidade: accountingSchema.partial(),
  tipo_processo: processTypeSchema,
  observacao: z.string().nullable(),
  created_at: z.coerce.date(),
  expire_at: z.coerce.date(),
  tarefas: z.array(tasksSchema),
  isOptimistic: z.coerce.boolean().optional(),
});

export const stagesProcessSchema = stageSchema.extend({
  processos: z.array(processSchema),
});

export const processByStagesSchema = stagesSchema.extend({
  processos_por_etapa: z.array(stagesProcessSchema),
});
