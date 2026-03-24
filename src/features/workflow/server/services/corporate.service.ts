import { API_ENDPOINTS } from '@societiza/routes/endpoints';
import fetcher from '@societiza/lib/axios';
import {
  Process,
  ProcessByStages,
  ProcessDTO,
  ProcessTypes,
  ProcessType,
  Stage,
  Stages,
  UpdateProcessDTO,
  ProcessById,
} from '../types/corporate.types';

const api = API_ENDPOINTS;

export const corporateService = {
  create: async (data: ProcessDTO): Promise<Process> => {
    const response = await fetcher.post(
      api.workflowTemplate.createWorkflowTemplate,
      data,
    );
    return response.data;
  },
  update: async (data: UpdateProcessDTO): Promise<ProcessById> => {
    const workflowTemplateId = data.processo_id;
    const response = await fetcher.put(
      api.workflowTemplate.updateWorkflowTemplate(workflowTemplateId),
      data,
    );
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    const response = await fetcher.patch(
      api.workflowTemplate.archiveWorkflowTemplate(id),
    );
    return response.data;
  },
  getProcesses: async (): Promise<ProcessByStages> => {
    const response = await fetcher.get(
      api.workflowTemplate.getAllWorkflowTemplates,
    );
    return response.data;
  },
  getProcessById: async (id: string): Promise<ProcessById> => {
    const response = await fetcher.get(
      api.workflowTemplate.getWorkflowTemplateById(id),
    );
    return response.data;
  },
  getStages: async (): Promise<Stages> => {
    const response = await fetcher.get(api.workflowTemplate.getAllWorkflowTemplates);
    return response.data;
  },
  getStageById: async (id: string): Promise<Stage> => {
    const response = await fetcher.get(api.workflowTemplate.getWorkflowTemplateById(id));
    return response.data;
  },
  getProcessTypes: async (): Promise<ProcessTypes> => {
    const response = await fetcher.get(
      api.workflowTemplate.getAllWorkflowTemplates,
    );
    return response.data;
  },
  getProcessTypeById: async (id: string): Promise<ProcessType> => {
    const response = await fetcher.get(
      api.workflowTemplate.getWorkflowTemplateById(id),
    );
    return response.data;
  },
};
