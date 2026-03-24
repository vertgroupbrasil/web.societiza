import { z } from 'zod';
import { workflowTemplateFieldSchema } from './field.schema';
import { workflowTemplateTaskSchema } from './task.schema';

export const workflowTemplateStepSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  order: z.coerce.number(),
  fields: z.array(workflowTemplateFieldSchema),
  tasks: z.array(workflowTemplateTaskSchema),
});

export const createStepSchemaDTO = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  order: z.coerce.number().min(1, 'Ordem deve ser pelo menos 1'),
});

export const updateStepSchemaDTO = createStepSchemaDTO;
