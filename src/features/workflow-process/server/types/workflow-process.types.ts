import { z } from 'zod';
import {
  createWorkflowProcessPayloadSchema,
  createWorkflowProcessResponseSchema,
  fillWorkflowProcessFieldPayloadSchema,
  workflowProcessBoardByStepsSchema,
  workflowProcessBoardItemSchema,
  workflowProcessDetailSchema,
  workflowProcessFieldTypeSchema,
  workflowProcessStatusSchema,
  workflowProcessStepFieldSchema,
  workflowProcessStepGroupItemSchema,
  workflowProcessStepGroupSchema,
  workflowProcessStepInstanceSchema,
  workflowProcessStepStatusSchema,
  workflowProcessTaskFieldSchema,
  workflowProcessTaskInstanceSchema,
  workflowProcessTaskStatusSchema,
  workflowProcessTypeSchema,
} from '../../schemas';

export type WorkflowProcessType = z.infer<typeof workflowProcessTypeSchema>;
export type WorkflowProcessStatus = z.infer<
  typeof workflowProcessStatusSchema
>;
export type WorkflowProcessStepStatus = z.infer<
  typeof workflowProcessStepStatusSchema
>;
export type WorkflowProcessTaskStatus = z.infer<
  typeof workflowProcessTaskStatusSchema
>;
export type WorkflowProcessFieldType = z.infer<
  typeof workflowProcessFieldTypeSchema
>;

export type WorkflowProcessBoardItem = z.infer<
  typeof workflowProcessBoardItemSchema
>;
export type WorkflowProcessStepGroupItem = z.infer<
  typeof workflowProcessStepGroupItemSchema
>;
export type WorkflowProcessStepGroup = z.infer<
  typeof workflowProcessStepGroupSchema
>;
export type WorkflowProcessBoardBySteps = z.infer<
  typeof workflowProcessBoardByStepsSchema
>;
export type WorkflowProcessDetail = z.infer<
  typeof workflowProcessDetailSchema
>;
export type WorkflowProcessStepInstance = z.infer<
  typeof workflowProcessStepInstanceSchema
>;
export type WorkflowProcessTaskInstance = z.infer<
  typeof workflowProcessTaskInstanceSchema
>;
export type WorkflowProcessStepField = z.infer<
  typeof workflowProcessStepFieldSchema
>;
export type WorkflowProcessTaskField = z.infer<
  typeof workflowProcessTaskFieldSchema
>;

export type CreateWorkflowProcessPayload = z.infer<
  typeof createWorkflowProcessPayloadSchema
>;
export type FillWorkflowProcessFieldPayload = z.infer<
  typeof fillWorkflowProcessFieldPayloadSchema
>;
export type CreateWorkflowProcessResponse = z.infer<
  typeof createWorkflowProcessResponseSchema
>;

export type WorkflowProcessTaskActionParams = {
  processId: string;
  stepInstanceId: string;
  taskInstanceId: string;
};

export type FillWorkflowProcessStepFieldParams = {
  processId: string;
  stepInstanceId: string;
  fieldInstanceId: string;
  value: string;
};

export type FillWorkflowProcessTaskFieldParams =
  FillWorkflowProcessStepFieldParams & {
    taskInstanceId: string;
  };
