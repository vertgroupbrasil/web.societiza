import { z } from 'zod';
import { workflowTemplateFieldSchema } from './field.schema';

export const taskTypeEnum = z.enum(['Manual', 'Automatic', 'Approval']);

export const workflowTemplateTaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  type: taskTypeEnum,
  configuration: z.string(),
  order: z.coerce.number(),
  isOptional: z.coerce.boolean(),
  fields: z.array(workflowTemplateFieldSchema),
});

export const createTaskSchemaDTO = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Título é obrigatório')
    .max(150, 'Título deve ter no máximo 150 caracteres'),
  description: z
    .string()
    .trim()
    .min(1, 'Descrição é obrigatória')
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
  type: taskTypeEnum,
  configuration: z
    .string()
    .min(1, 'Configuração é obrigatória')
    .refine((value) => {
      try {
        JSON.parse(value);
        return true;
      } catch {
        return false;
      }
    }, 'Configuração deve ser um JSON válido'),
  order: z.coerce.number().min(1, 'Ordem deve ser pelo menos 1'),
  isOptional: z.coerce.boolean(),
});

export const updateTaskSchemaDTO = createTaskSchemaDTO;
