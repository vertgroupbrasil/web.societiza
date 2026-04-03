import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { QueryKey } from '@tanstack/react-query';
import {
  Process,
  ProcessDTO,
  corporateService,
  corporateQueries,
  UpdateProcessDTO,
  ProcessById,
} from '@workflow/index';
import { refreshVisibleAndMarkStale } from '@societiza/lib/query-refresh';

export const useCorporateMutations = () => {
  const queryClient = useQueryClient();

  const createProcess = useMutation<Process, Error, ProcessDTO>({
    mutationFn: corporateService.create,

    onSuccess: async (newProcess) => {
      await refreshVisibleAndMarkStale(queryClient, [
        corporateQueries.processesByStages().queryKey,
        corporateQueries.listStages().queryKey,
        corporateQueries.listProcessTypes().queryKey,
      ]);

      // Pre-populate o cache individual do processo criado
      queryClient.setQueryData(
        corporateQueries.processById(newProcess.id).queryKey,
        { processo: newProcess },
      );
    },
  });

  const updateProcess = useMutation<ProcessById, Error, UpdateProcessDTO>({
    mutationFn: corporateService.update,

    onSuccess: async (_updatedProcess, variables) => {
      const queryKeys: QueryKey[] = [
        corporateQueries.processById(variables.processo_id)
          .queryKey as QueryKey,
        corporateQueries.processesByStages().queryKey as QueryKey,
      ];

      if (variables.etapa_id)
        queryKeys.push(corporateQueries.listStages().queryKey as QueryKey);

      await refreshVisibleAndMarkStale(queryClient, queryKeys);
    },
  });

  const deleteProcess = useMutation<void, Error, string>({
    mutationFn: (processo_id: string) => corporateService.delete(processo_id),

    onSuccess: async (_response, processo_id) => {
      await refreshVisibleAndMarkStale(queryClient, [
        corporateQueries.processesByStages().queryKey,
        corporateQueries.listStages().queryKey,
      ]);

      // Remover do cache individual
      queryClient.removeQueries({
        queryKey: corporateQueries.processById(processo_id).queryKey,
      });
    },

    onError: () => {},
  });

  return {
    createProcess,
    updateProcess,
    deleteProcess,
  };
};
