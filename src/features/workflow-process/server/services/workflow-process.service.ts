import fetcher from '@societiza/lib/axios';
import { API_ENDPOINTS } from '@societiza/routes/endpoints';
import {
  createWorkflowProcessPayloadSchema,
  createWorkflowProcessResponseSchema,
  fillWorkflowProcessFieldPayloadSchema,
  workflowProcessBoardByStepsSchema,
  workflowProcessBoardSchema,
  workflowProcessDetailSchema,
} from '../../schemas';
import type {
  CreateWorkflowProcessPayload,
  CreateWorkflowProcessResponse,
  FillWorkflowProcessFieldPayload,
  WorkflowProcessBoardBySteps,
  WorkflowProcessBoardItem,
  WorkflowProcessDetail,
  WorkflowProcessTaskActionParams,
  WorkflowProcessType,
} from '../types';

const api = API_ENDPOINTS.workflowProcess;

export const workflowProcessService = {
  listBoardBySteps: async (
    accountancyId: string,
    templateId?: string,
    pageNumber = 1,
    pageSize = 100,
  ): Promise<WorkflowProcessBoardBySteps> => {
    const response = await fetcher.get(
      api.boardBySteps(accountancyId, templateId, pageNumber, pageSize),
    );
    return workflowProcessBoardByStepsSchema.parse(response.data);
  },

  listBoard: async (
    accountancyId: string,
    processType?: WorkflowProcessType,
  ): Promise<WorkflowProcessBoardItem[]> => {
    const response = await fetcher.get(api.board(accountancyId, processType));
    return workflowProcessBoardSchema.parse(response.data);
  },

  getById: async (processId: string): Promise<WorkflowProcessDetail> => {
    const response = await fetcher.get(api.detail(processId));
    return workflowProcessDetailSchema.parse(response.data);
  },

  create: async (
    payload: CreateWorkflowProcessPayload,
  ): Promise<CreateWorkflowProcessResponse> => {
    const parsedPayload = createWorkflowProcessPayloadSchema.parse(payload);
    const response = await fetcher.post(api.create, parsedPayload);
    return createWorkflowProcessResponseSchema.parse(response.data);
  },

  completeTask: async ({
    processId,
    stepInstanceId,
    taskInstanceId,
  }: WorkflowProcessTaskActionParams): Promise<void> => {
    await fetcher.post(
      api.completeTask(processId, stepInstanceId, taskInstanceId),
    );
  },

  skipTask: async ({
    processId,
    stepInstanceId,
    taskInstanceId,
  }: WorkflowProcessTaskActionParams): Promise<void> => {
    await fetcher.post(api.skipTask(processId, stepInstanceId, taskInstanceId));
  },

  revertTask: async ({
    processId,
    stepInstanceId,
    taskInstanceId,
  }: WorkflowProcessTaskActionParams): Promise<void> => {
    await fetcher.post(
      api.revertTask(processId, stepInstanceId, taskInstanceId),
    );
  },

  fillStepField: async (
    processId: string,
    stepInstanceId: string,
    fieldInstanceId: string,
    payload: FillWorkflowProcessFieldPayload,
  ): Promise<void> => {
    const parsedPayload = fillWorkflowProcessFieldPayloadSchema.parse(payload);
    await fetcher.put(
      api.fillStepField(processId, stepInstanceId, fieldInstanceId),
      parsedPayload,
    );
  },

  fillTaskField: async (
    processId: string,
    stepInstanceId: string,
    taskInstanceId: string,
    fieldInstanceId: string,
    payload: FillWorkflowProcessFieldPayload,
  ): Promise<void> => {
    const parsedPayload = fillWorkflowProcessFieldPayloadSchema.parse(payload);
    await fetcher.put(
      api.fillTaskField(
        processId,
        stepInstanceId,
        taskInstanceId,
        fieldInstanceId,
      ),
      parsedPayload,
    );
  },
};
