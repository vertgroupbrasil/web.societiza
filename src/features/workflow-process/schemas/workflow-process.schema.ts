import { z } from 'zod';

export const workflowProcessTypeSchema = z.enum([
  'Abertura',
  'Alteracao',
  'Baixa',
]);

export const workflowProcessStatusSchema = z.enum([
  'InProgress',
  'Completed',
]);

export const workflowProcessStepStatusSchema = z.enum([
  'NotStarted',
  'InProgress',
  'Completed',
]);

export const workflowProcessTaskStatusSchema = z.enum([
  'Pending',
  'Completed',
  'Skipped',
]);

export const workflowProcessFieldTypeSchema = z.enum([
  'Text',
  'Boolean',
  'Integer',
  'Select',
  'Date',
]);

const nullableDateSchema = z.coerce.date().nullable();

export const workflowProcessBoardItemSchema = z.object({
  id: z.string().uuid(),
  processType: workflowProcessTypeSchema,
  targetClient: z.string(),
  status: workflowProcessStatusSchema,
  currentStepTitle: z.string().nullable(),
  totalSteps: z.number().int(),
  completedSteps: z.number().int(),
  createdAt: z.coerce.date(),
  completedAt: nullableDateSchema,
});

export const workflowProcessStepFieldSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  fieldType: workflowProcessFieldTypeSchema,
  isRequired: z.boolean().optional().default(false),
  order: z.number().int(),
  value: z.string().nullable(),
  options: z.string().nullable(),
  filledAt: nullableDateSchema,
});

export const workflowProcessTaskFieldSchema =
  workflowProcessStepFieldSchema;

export const workflowProcessTaskInstanceSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable().optional(),
  order: z.number().int(),
  isOptional: z.boolean(),
  status: workflowProcessTaskStatusSchema,
  completedAt: nullableDateSchema,
  skippedAt: nullableDateSchema,
  fields: z.array(workflowProcessTaskFieldSchema),
});

export const workflowProcessStepInstanceSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  order: z.number().int(),
  status: workflowProcessStepStatusSchema,
  completedAt: nullableDateSchema,
  fields: z.array(workflowProcessStepFieldSchema),
  tasks: z.array(workflowProcessTaskInstanceSchema),
});

export const workflowProcessDetailSchema = z.object({
  id: z.string().uuid(),
  accountancyId: z.string().uuid(),
  templateId: z.string().uuid(),
  templateVersion: z.string(),
  processType: workflowProcessTypeSchema,
  targetClient: z.string(),
  status: workflowProcessStatusSchema,
  createdAt: z.coerce.date(),
  completedAt: nullableDateSchema,
  steps: z.array(workflowProcessStepInstanceSchema),
});

export const workflowProcessBoardSchema = z.array(
  workflowProcessBoardItemSchema,
);

export const workflowProcessStepGroupItemSchema = z.object({
  processId: z.string().uuid(),
  stepInstanceId: z.string().uuid(),
  processType: workflowProcessTypeSchema,
  targetClient: z.string(),
  processStatus: workflowProcessStatusSchema,
  stepStatus: workflowProcessStepStatusSchema,
  createdAt: z.coerce.date(),
  completedAt: z.coerce.date().nullable(),
});

export const workflowProcessStepGroupSchema = z.object({
  stepTitle: z.string(),
  stepOrder: z.number().int(),
  processCount: z.number().int(),
  processes: z.array(workflowProcessStepGroupItemSchema),
});

export const workflowProcessBoardByStepsSchema = z.object({
  items: z.array(workflowProcessStepGroupSchema),
  page: z.object({
    pageNumber: z.number(),
    pageSize: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
    totalCount: z.number(),
    totalPages: z.number(),
  }),
});

export const createWorkflowProcessPayloadSchema = z.object({
  accountancyId: z.string().uuid(),
  templateId: z.string().uuid(),
  processType: workflowProcessTypeSchema,
  targetClient: z.string().trim().min(1, 'Informe o cliente-alvo.'),
});

export const fillWorkflowProcessFieldPayloadSchema = z.object({
  value: z.string(),
});

export const createWorkflowProcessResponseSchema = z.object({
  id: z.string().uuid(),
});
