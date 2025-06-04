// features/corporate/hooks/queries/corporateQueries.ts
import { queryOptions } from '@tanstack/react-query';
import { corporateService } from '../../server/services/corporate.service';

export const corporateQueries = {
  // Query keys base
  all: () => ['corporate'] as const,
  processes: () => [...corporateQueries.all(), 'processes'] as const,

  // Query options específicas
  processesByStages: () =>
    queryOptions({
      queryKey: [...corporateQueries.processes(), 'by-stages'],
      queryFn: corporateService.get,
      staleTime: 2 * 60 * 1000, // 2 minutos para dados dinâmicos
      refetchOnWindowFocus: true,
    }),

  processById: (id: string) =>
    queryOptions({
      queryKey: [...corporateQueries.processes(), id],
      queryFn: () => corporateService.getById(id),
      staleTime: 5 * 60 * 1000, // 5 minutos para dados específicos
      enabled: !!id, // Só executa se ID existir
    }),
};
