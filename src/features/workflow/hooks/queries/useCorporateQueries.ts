// features/corporate/hooks/queries/useCorporateQueries.ts
import { useQuery } from '@tanstack/react-query';
import { corporateQueries } from './query-options';

export const useCorporateProcessesByStages = () => {
  return useQuery(corporateQueries.processesByStages());
};

export const useCorporateProcessById = (id: string) => {
  return useQuery(corporateQueries.processById(id));
};

export const useCorporateListStages = () => {
  return useQuery(corporateQueries.listStages());
};

export const useCorporateStageById = (id: string) => {
  return useQuery(corporateQueries.stageById(id));
};

export const useCorporateListProcessTypes = () => {
  return useQuery(corporateQueries.listProcessTypes());
};

export const useCorporateProcessTypeById = (id: string) => {
  return useQuery(corporateQueries.processTypeById(id));
};

export const useCorporateBoard = () => {
  const processesByStages = useCorporateProcessesByStages();
  const listStages = useCorporateListStages();
  const listProcessTypes = useCorporateListProcessTypes();

  return {
    processTypes: listProcessTypes.data?.tipo_processo || [],
    stages: listStages.data?.etapas || [],
    processes: processesByStages.data?.processos_por_etapa || [],
    isLoading: processesByStages.isPending,
    error: processesByStages.error,
    refetch: processesByStages.refetch,
  };
};
