import { API_ENDPOINTS } from '@flowtec/routes/endpoints';
import fetcher from '@flowtec/lib/axios';
import { ViaCep } from '@form/index';

const api = API_ENDPOINTS;

export const viaCepService = {
  get: async (cep: string): Promise<ViaCep> => {
    const response = await fetcher.get(api.external.viacep.get(cep));
    return response.data;
  },
};