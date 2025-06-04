// features/corporate/hooks/queries/useCorporateQueries.ts
import { useQuery } from '@tanstack/react-query';
import { corporateQueries } from './queryOptions';

export const useCorporateProcessesByStages = () => {
  return useQuery(corporateQueries.processesByStages());
};

export const useCorporateProcessById = (id: string) => {
  return useQuery(corporateQueries.processById(id));
};

export const useCorporateBoard = () => {
  const processesByStages = useCorporateProcessesByStages();

  return {
    processes: processesByStages.data,
    isLoading: processesByStages.isPending,
    error: processesByStages.error,
    refetch: processesByStages.refetch,
  };
};
