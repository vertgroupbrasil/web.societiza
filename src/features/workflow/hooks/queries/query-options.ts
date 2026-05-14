// features/corporate/hooks/queries/corporateQueries.ts
import { queryOptions } from '@tanstack/react-query';
import { corporateService } from '../../server/services/corporate.service';

export const corporateQueries = {
  // Query keys base
  all: () => ['corporate'] as const,
  processes: () => [...corporateQueries.all(), 'processes'] as const,
  stages: () => [...corporateQueries.all(), 'stages'] as const,
  processTypes: () => [...corporateQueries.all(), 'process-types'] as const,

  // Query options específicas
  processesByStages: () =>
    queryOptions({
      queryKey: [...corporateQueries.processes(), 'by-stages'],
      queryFn: corporateService.getProcesses,
      staleTime: 2 * 60 * 1000, // 2 minutos para dados dinâmicos
      refetchOnWindowFocus: true,
    }),

  processById: (id: string) =>
    queryOptions({
      queryKey: [...corporateQueries.processes(), id],
      queryFn: () => corporateService.getProcessById(id),
      staleTime: 5 * 60 * 1000, // 5 minutos para dados específicos
      enabled: !!id, // Só executa se ID existir
    }),

  listStages: () =>
    queryOptions({
      queryKey: [...corporateQueries.stages(), 'list-stages'],
      queryFn: corporateService.getStages,
      staleTime: 2 * 60 * 1000, // 2 minutos para dados dinâmicos
      refetchOnWindowFocus: true,
    }),

  stageById: (id: string) =>
    queryOptions({
      queryKey: [...corporateQueries.stages(), id],
      queryFn: () => corporateService.getStageById(id),
      staleTime: 5 * 60 * 1000, // 5 minutos para dados específicos
      enabled: !!id, // Só executa se ID existir
    }),
  listProcessTypes: () =>
    queryOptions({
      queryKey: [...corporateQueries.processTypes(), 'list-process-types'],
      queryFn: corporateService.getProcessTypes,
      staleTime: 2 * 60 * 1000, // 2 minutos para dados dinâmicos
      refetchOnWindowFocus: true,
    }),

  processTypeById: (id: string) =>
    queryOptions({
      queryKey: [...corporateQueries.processTypes(), id],
      queryFn: () => corporateService.getProcessTypeById(id), // ← CORRIGIDO
      staleTime: 5 * 60 * 1000,
      enabled: !!id,
    }),
};
