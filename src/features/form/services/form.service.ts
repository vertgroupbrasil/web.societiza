import { API_ENDPOINTS } from '@flowtec/routes/endpoints';
import fetcher from '@flowtec/lib/axios';
import {
  CompanyData,
  OpeningForm,
  PartnersData,
} from '@form/index';

const api = API_ENDPOINTS;

export const formService = {
  createForm: async (data: CompanyData): Promise<OpeningForm> => {
    const response = await fetcher.post(
      api.corporate.form.createOpeningForm,
      data,
    );
    return response.data;
  },

  createPartner: async (data: PartnersData): Promise<OpeningForm> => {
    const response = await fetcher.post(
      api.corporate.partner.createPartners,
      data,
    );
    return response.data;
  },

  getFormById: async (id: string): Promise<OpeningForm> => {
    const response = await fetcher.get(
      api.corporate.form.getOpeningFormById(id),
    );
    return response.data;
  },
};