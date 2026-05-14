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

const HARDCODED_PROCESS_TYPES: ProcessTypes = {
  tipo_processo: [
    { id: 'Abertura', descricao: 'Abertura' },
    { id: 'Alteracao', descricao: 'Alteração' },
    { id: 'Baixa', descricao: 'Encerramento' },
  ],
};

const HARDCODED_STAGES: Stages = {
  etapas: [],
};

export const corporateService = {
  create: async (data: ProcessDTO & { template_id?: string }): Promise<Process> => {
    const payload = {
      accountancyId: data.contabilidade_id,
      templateId: data.template_id,
      processType: data.tipo_processo_id,
      targetClient: data.nome,
    };
    const response = await fetcher.post(api.workflowProcess.create, payload);
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
      api.workflowTemplate.getAllWorkflowTemplates(),
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
    return HARDCODED_STAGES;
  },
  getStageById: async (_id: string): Promise<Stage> => {
    throw new Error('Stage lookup not supported');
  },
  getProcessTypes: async (): Promise<ProcessTypes> => {
    return HARDCODED_PROCESS_TYPES;
  },
  getProcessTypeById: async (_id: string): Promise<ProcessType> => {
    throw new Error('Process type lookup not supported');
  },
};
