import { API_ENDPOINTS } from '@societiza/routes/endpoints';
import fetcher from '@societiza/lib/axios';
import type {
  Accountancy,
  CreateAccountancyInput,
} from '../../schemas/accountancy.schema';

const api = API_ENDPOINTS.accountancy;

export type CreateEntityResponse = { id: string };

export const accountancyService = {
  getAll: async (): Promise<Accountancy[]> => {
    const response = await fetcher.get(api.getAll);
    return response.data as Accountancy[];
  },

  getById: async (id: string): Promise<Accountancy> => {
    const response = await fetcher.get(api.getById(id));
    return response.data as Accountancy;
  },

  create: async (data: CreateAccountancyInput): Promise<CreateEntityResponse> => {
    const response = await fetcher.post(api.create, data);
    return response.data as CreateEntityResponse;
  },

  update: async (id: string, data: CreateAccountancyInput): Promise<void> => {
    await fetcher.put(api.update(id), data);
  },

  delete: async (id: string): Promise<void> => {
    await fetcher.delete(api.delete(id));
  },
};
