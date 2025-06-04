import { API_ENDPOINTS } from '@flowtec/routes/endpoints';
import fetcher from '@flowtec/lib/axios';
import {
  Process,
  ProcessByStages,
  ProcessDTO,
  UpdateProcessDTO,
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
  update: async (data: UpdateProcessDTO): Promise<void> => {
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
  get: async (): Promise<ProcessByStages> => {
    const response = await fetcher.get(
      api.corporate.process.listProcessessByStages,
    );
    return response.data;
  },
  getById: async (id: string): Promise<Process> => {
    const response = await fetcher.get(
      api.corporate.process.getProcessById(id),
    );
    return response.data;
  },
};
