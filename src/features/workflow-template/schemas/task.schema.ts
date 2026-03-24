import { z } from 'zod';
import { workflowTemplateFieldSchema } from './field.schema';

export const workflowTemplateTaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  type: z.string(),
  configuration: z.string(),
  order: z.coerce.number(),
  isOptional: z.coerce.boolean(),
  fields: z.array(workflowTemplateFieldSchema),
});

export const createTaskSchemaDTO = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  type: z.string().min(1, 'Tipo é obrigatório'),
  configuration: z.string(),
  order: z.coerce.number().min(1, 'Ordem deve ser pelo menos 1'),
  isOptional: z.coerce.boolean(),
});

export const updateTaskSchemaDTO = createTaskSchemaDTO;
