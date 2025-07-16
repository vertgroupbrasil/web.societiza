import { API_ENDPOINTS } from '@flowtec/routes/endpoints';
import fetcher from '@flowtec/lib/axios';
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
      api.corporate.process.createProcess,
      data,
    );
    return response.data;
  },
  update: async (data: UpdateProcessDTO): Promise<ProcessById> => {
    const response = await fetcher.put(
      api.corporate.process.updateProcess,
      data,
    );
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    const response = await fetcher.delete(
      api.corporate.process.deleteProcess(id),
    );
    return response.data;
  },
  getProcesses: async (): Promise<ProcessByStages> => {
    const response = await fetcher.get(
      api.corporate.process.listProcessessByStages,
    );
    return response.data;
  },
  getProcessById: async (id: string): Promise<ProcessById> => {
    const response = await fetcher.get(
      api.corporate.process.getProcessById(id),
    );
    return response.data;
  },
  getStages: async (): Promise<Stages> => {
    const response = await fetcher.get(api.corporate.stage.listStages);
    return response.data;
  },
  getStageById: async (id: string): Promise<Stage> => {
    const response = await fetcher.get(api.corporate.stage.getStageById(id));
    return response.data;
  },
  getProcessTypes: async (): Promise<ProcessTypes> => {
    const response = await fetcher.get(
      api.corporate.process.type.listProcessTypes,
    );
    return response.data;
  },
  getProcessTypeById: async (id: string): Promise<ProcessType> => {
    const response = await fetcher.get(
      api.corporate.process.type.getProcessTypeById(id),
    );
    return response.data;
  },
};
