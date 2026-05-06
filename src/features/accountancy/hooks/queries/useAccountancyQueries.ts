import { useQuery } from '@tanstack/react-query';
import { accountancyService } from '../../server/services/accountancy.service';

export const accountancyQueryKeys = {
  all: ['accountancy'] as const,
  lists: () => [...accountancyQueryKeys.all, 'list'] as const,
  list: (pageNumber: number, pageSize: number) =>
    [...accountancyQueryKeys.lists(), { pageNumber, pageSize }] as const,
  details: () => [...accountancyQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...accountancyQueryKeys.details(), id] as const,
  me: () => [...accountancyQueryKeys.all, 'me'] as const,
};

export const useAccountancies = (pageNumber = 1, pageSize = 10) => {
  return useQuery({
    queryKey: accountancyQueryKeys.list(pageNumber, pageSize),
    queryFn: () => accountancyService.list(pageNumber, pageSize),
    placeholderData: (prev) => prev,
  });
};

export const useAccountancyById = (id: string | undefined) => {
  return useQuery({
    queryKey: id ? accountancyQueryKeys.detail(id) : accountancyQueryKeys.details(),
    queryFn: () => accountancyService.getById(id as string),
    enabled: !!id,
  });
};

export const useMyAccountancy = (enabled = true) => {
  return useQuery({
    queryKey: accountancyQueryKeys.me(),
    queryFn: () => accountancyService.getMe(),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      // 403 AccountancyClaimMissing → não retry
      const status =
        (error as { response?: { status?: number } })?.response?.status;
      if (status === 401 || status === 403 || status === 404) return false;
      return failureCount < 2;
    },
  });
};
