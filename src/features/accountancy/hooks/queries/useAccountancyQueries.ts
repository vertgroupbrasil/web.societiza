import { useQuery } from '@tanstack/react-query';
import { accountancyService } from '../../server/services/accountancy.service';
import { API_ENDPOINTS } from '@societiza/routes/endpoints';

const QUERY_KEY = [API_ENDPOINTS.accountancy.getAll];

export const useAccountancies = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => accountancyService.getAll(),
  });
};

export const useAccountancyById = (id: string) => {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => accountancyService.getById(id),
    enabled: !!id,
  });
};
