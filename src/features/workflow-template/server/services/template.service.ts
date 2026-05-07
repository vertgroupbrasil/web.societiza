import { API_ENDPOINTS } from '@societiza/routes/endpoints';
import fetcher from '@societiza/lib/axios';
import type {
  WorkflowTemplateListItem,
  WorkflowTemplateDetail,
  CreateTemplateDTO,
  UpdateTemplateDTO,
  CreateStepDTO,
  UpdateStepDTO,
  CreateTaskDTO,
  UpdateTaskDTO,
  CreateFieldDTO,
  UpdateFieldDTO,
  CreateEntityResponse,
} from '../types/template.types';

const api = API_ENDPOINTS.workflowTemplate;

// ====== Response Transformers ======
// The backend stores options as a raw string (e.g. '["opt1","opt2"]').
// We parse it back to an array on the frontend and serialize on the way out.

function parseOptions(raw: string | null): string[] | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : null;
  } catch {
    return null;
  }
}

function serializeOptions(options: string[] | null): string | null {
  if (!options || options.length === 0) return null;
  return JSON.stringify(options);
}

// Transform the raw API detail response into the strongly-typed shape the UI expects.
function transformDetail(raw: WorkflowTemplateDetail): WorkflowTemplateDetail {
  return {
    ...raw,
    steps: raw.steps.map((step) => ({
      ...step,
      fields: [...step.fields]
        .sort((left, right) => left.order - right.order)
        .map((field) => ({
          ...field,
          options: parseOptions(field.options as unknown as string | null),
        })),
      tasks: step.tasks.map((task) => ({
        ...task,
        fields: [...task.fields]
          .sort((left, right) => left.order - right.order)
          .map((field) => ({
            ...field,
            options: parseOptions(field.options as unknown as string | null),
          })),
      })),
    })),
  };
}

export const workflowTemplateService = {
  // ====== Template CRUD ======
  list: async (): Promise<WorkflowTemplateListItem[]> => {
    const response = await fetcher.get(api.getAllWorkflowTemplates);
    return response.data as WorkflowTemplateListItem[];
  },

  getById: async (id: string): Promise<WorkflowTemplateDetail> => {
    const response = await fetcher.get(api.getWorkflowTemplateById(id));
    return transformDetail(response.data as WorkflowTemplateDetail);
  },

  create: async (data: CreateTemplateDTO): Promise<CreateEntityResponse> => {
    const response = await fetcher.post(api.createWorkflowTemplate, data);
    return response.data as CreateEntityResponse;
  },

  createDraft: async (id: string): Promise<CreateEntityResponse> => {
    const response = await fetcher.post(api.draftWorkflowTemplate(id));
    return response.data as CreateEntityResponse;
  },

  update: async (id: string, data: UpdateTemplateDTO): Promise<void> => {
    await fetcher.put(api.updateWorkflowTemplate(id), data);
  },

  activate: async (id: string): Promise<void> => {
    await fetcher.patch(api.activateWorkflowTemplate(id));
  },

  archive: async (id: string): Promise<void> => {
    await fetcher.patch(api.archiveWorkflowTemplate(id));
  },

  publish: async (id: string): Promise<CreateEntityResponse> => {
    const response = await fetcher.post(api.publishWorkflowTemplate(id));
    return response.data as CreateEntityResponse;
  },

  // ====== Step CRUD ======
  addStep: async (
    templateId: string,
    data: CreateStepDTO,
  ): Promise<CreateEntityResponse> => {
    const response = await fetcher.post(
      api.addWorkflowTemplateStep(templateId),
      data,
    );
    return response.data as CreateEntityResponse;
  },

  updateStep: async (
    templateId: string,
    stepId: string,
    data: UpdateStepDTO,
  ): Promise<void> => {
    await fetcher.put(api.updateWorkflowTemplateStep(templateId, stepId), data);
  },

  removeStep: async (templateId: string, stepId: string): Promise<void> => {
    await fetcher.delete(api.removeWorkflowTemplateStep(templateId, stepId));
  },

  // ====== Task CRUD ======
  // configuration is stored as a plain string on the backend.
  addTask: async (
    templateId: string,
    stepId: string,
    data: CreateTaskDTO,
  ): Promise<CreateEntityResponse> => {
    const response = await fetcher.post(
      api.addWorkflowTemplateStepTask(templateId, stepId),
      data,
    );
    return response.data as CreateEntityResponse;
  },

  updateTask: async (
    templateId: string,
    stepId: string,
    taskId: string,
    data: UpdateTaskDTO,
  ): Promise<void> => {
    await fetcher.put(
      api.updateWorkflowTemplateStepTask(templateId, stepId, taskId),
      data,
    );
  },

  removeTask: async (
    templateId: string,
    stepId: string,
    taskId: string,
  ): Promise<void> => {
    await fetcher.delete(
      api.removeWorkflowTemplateStepTask(templateId, stepId, taskId),
    );
  },

  // ====== Step Field CRUD ======
  // options must be serialised to a JSON string before sending to the backend.
  addStepField: async (
    templateId: string,
    stepId: string,
    data: CreateFieldDTO,
  ): Promise<CreateEntityResponse> => {
    const response = await fetcher.post(
      api.addTemplateStepField(templateId, stepId),
      { ...data, options: serializeOptions(data.options) },
    );
    return response.data as CreateEntityResponse;
  },

  updateStepField: async (
    templateId: string,
    stepId: string,
    fieldId: string,
    data: UpdateFieldDTO,
  ): Promise<void> => {
    await fetcher.put(
      api.updateTemplateStepField(templateId, stepId, fieldId),
      { ...data, options: serializeOptions(data.options) },
    );
  },

  removeStepField: async (
    templateId: string,
    stepId: string,
    fieldId: string,
  ): Promise<void> => {
    await fetcher.delete(
      api.removeTemplateStepField(templateId, stepId, fieldId),
    );
  },

  // ====== Task Field CRUD ======
  addTaskField: async (
    templateId: string,
    stepId: string,
    taskId: string,
    data: CreateFieldDTO,
  ): Promise<CreateEntityResponse> => {
    const response = await fetcher.post(
      api.addTemplateStepTaskField(templateId, stepId, taskId),
      { ...data, options: serializeOptions(data.options) },
    );
    return response.data as CreateEntityResponse;
  },

  updateTaskField: async (
    templateId: string,
    stepId: string,
    taskId: string,
    fieldId: string,
    data: UpdateFieldDTO,
  ): Promise<void> => {
    await fetcher.put(
      api.updateTemplateStepTaskField(templateId, stepId, taskId, fieldId),
      { ...data, options: serializeOptions(data.options) },
    );
  },

  removeTaskField: async (
    templateId: string,
    stepId: string,
    taskId: string,
    fieldId: string,
  ): Promise<void> => {
    await fetcher.delete(
      api.removeTemplateStepTaskField(templateId, stepId, taskId, fieldId),
    );
  },
};
