import { API_ENDPOINTS } from '@societiza/routes/endpoints';
import fetcher from '@societiza/lib/axios';
import {
  accountancyDetailSchema,
  pagedAccountanciesSchema,
  type AccountancyDetail,
  type AccountancyPayload,
  type PagedAccountancies,
} from '../../schemas/accountancy.schema';

const api = API_ENDPOINTS.accountancy;

export type CreateAccountancyResponse = { id: string };

export const accountancyService = {
  list: async (
    pageNumber = 1,
    pageSize = 10,
  ): Promise<PagedAccountancies> => {
    const response = await fetcher.get(api.list(pageNumber, pageSize));
    return pagedAccountanciesSchema.parse(response.data);
  },

  getById: async (id: string): Promise<AccountancyDetail> => {
    const response = await fetcher.get(api.getById(id));
    return accountancyDetailSchema.parse(response.data);
  },

  getMe: async (): Promise<AccountancyDetail> => {
    const response = await fetcher.get(api.getMe);
    return accountancyDetailSchema.parse(response.data);
  },

  create: async (
    payload: AccountancyPayload,
  ): Promise<CreateAccountancyResponse> => {
    const response = await fetcher.post(api.create, payload);
    return response.data as CreateAccountancyResponse;
  },

  update: async (id: string, payload: AccountancyPayload): Promise<void> => {
    await fetcher.put(api.update(id), payload);
  },
};
