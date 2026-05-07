import { z } from 'zod';
import {
  workflowTemplateFieldSchema,
  workflowTemplateTaskSchema,
  workflowTemplateStepSchema,
  workflowTemplateListItemSchema,
  workflowTemplateDetailSchema,
  createTemplateSchemaDTO,
  updateTemplateSchemaDTO,
  createStepSchemaDTO,
  updateStepSchemaDTO,
  createTaskSchemaDTO,
  updateTaskSchemaDTO,
  createFieldSchemaDTO,
  updateFieldSchemaDTO,
  templateStatusEnum,
  fieldTypeEnum,
  pagedWorkflowTemplatesSchema,
  taskTypeEnum,
} from '../../schemas';

// ====== Entity Types ======
export type WorkflowTemplateField = z.infer<typeof workflowTemplateFieldSchema>;
export type WorkflowTemplateTask = z.infer<typeof workflowTemplateTaskSchema>;
export type WorkflowTemplateStep = z.infer<typeof workflowTemplateStepSchema>;
export type WorkflowTemplateListItem = z.infer<
  typeof workflowTemplateListItemSchema
>;
export type WorkflowTemplateDetail = z.infer<
  typeof workflowTemplateDetailSchema
>;
export type TemplateStatus = z.infer<typeof templateStatusEnum>;
export type FieldType = z.infer<typeof fieldTypeEnum>;
export type TaskType = z.infer<typeof taskTypeEnum>;
export type PagedWorkflowTemplates = z.infer<
  typeof pagedWorkflowTemplatesSchema
>;
export type WorkflowTemplateListParams = {
  includeDraft?: boolean;
  includeArchive?: boolean;
  pageNumber?: number;
  pageSize?: number;
};

// ====== DTO Types ======
export type CreateTemplateDTO = z.infer<typeof createTemplateSchemaDTO>;
export type UpdateTemplateDTO = z.infer<typeof updateTemplateSchemaDTO>;
export type CreateStepDTO = z.infer<typeof createStepSchemaDTO>;
export type UpdateStepDTO = z.infer<typeof updateStepSchemaDTO>;
export type CreateTaskDTO = z.infer<typeof createTaskSchemaDTO>;
export type UpdateTaskDTO = z.infer<typeof updateTaskSchemaDTO>;
export type CreateFieldDTO = z.infer<typeof createFieldSchemaDTO>;
export type UpdateFieldDTO = z.infer<typeof updateFieldSchemaDTO>;

// ====== API Response Types ======
export type CreateEntityResponse = { id: string };

// ====== Mutation Param Types ======
export type UpdateStepParams = {
  templateId: string;
  stepId: string;
  data: UpdateStepDTO;
};

export type RemoveStepParams = {
  templateId: string;
  stepId: string;
};

export type AddTaskParams = {
  templateId: string;
  stepId: string;
  data: CreateTaskDTO;
  clientId?: string;
};

export type UpdateTaskParams = {
  templateId: string;
  stepId: string;
  taskId: string;
  data: UpdateTaskDTO;
};

export type RemoveTaskParams = {
  templateId: string;
  stepId: string;
  taskId: string;
};

export type AddStepFieldParams = {
  templateId: string;
  stepId: string;
  data: CreateFieldDTO;
  clientId?: string;
};

export type UpdateStepFieldParams = {
  templateId: string;
  stepId: string;
  fieldId: string;
  data: UpdateFieldDTO;
};

export type RemoveStepFieldParams = {
  templateId: string;
  stepId: string;
  fieldId: string;
};

export type AddTaskFieldParams = {
  templateId: string;
  stepId: string;
  taskId: string;
  data: CreateFieldDTO;
  clientId?: string;
};

export type UpdateTaskFieldParams = {
  templateId: string;
  stepId: string;
  taskId: string;
  fieldId: string;
  data: UpdateFieldDTO;
};

export type RemoveTaskFieldParams = {
  templateId: string;
  stepId: string;
  taskId: string;
  fieldId: string;
};

export type AddStepParams = {
  templateId: string;
  data: CreateStepDTO;
  clientId?: string;
};

export type UpdateTemplateParams = {
  templateId: string;
  data: UpdateTemplateDTO;
};

export type PublishTemplateResponse = CreateEntityResponse;
