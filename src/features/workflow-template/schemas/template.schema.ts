import { z } from 'zod';
import { workflowTemplateStepSchema } from './step.schema';

export const templateStatusEnum = z.enum(['Draft', 'Active', 'Archived']);

export const workflowTemplateListItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  version: z.string(),
  status: templateStatusEnum,
  createdAt: z.coerce.date(),
  sourceTemplateId: z.string().uuid().nullable().optional(),
  isDerivedDraft: z.coerce.boolean().optional(),
});

export const workflowTemplateDetailSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  version: z.string(),
  status: templateStatusEnum,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  sourceTemplateId: z.string().uuid().nullable().optional(),
  isDerivedDraft: z.coerce.boolean().optional(),
  steps: z.array(workflowTemplateStepSchema),
});

export const workflowTemplateListSchema = z.array(
  workflowTemplateListItemSchema,
);

export const createTemplateSchemaDTO = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
});

export const updateTemplateSchemaDTO = createTemplateSchemaDTO;
