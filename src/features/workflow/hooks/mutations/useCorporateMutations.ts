import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Process,
  ProcessDTO,
  corporateService,
  corporateQueries,
  UpdateProcessDTO,
  ProcessById,
} from '@workflow/index';

export const useCorporateMutations = () => {
  const queryClient = useQueryClient();

  const createProcess = useMutation<Process, Error, ProcessDTO>({
    mutationFn: corporateService.create,

    onError: () => {
      toast.error('Erro ao criar processo. Verifique os dados e tente novamente.');
    },

    onSuccess: (newProcess, variables) => {
      // Invalidate específico para a etapa onde o processo foi criado
      queryClient.invalidateQueries({
        queryKey: corporateQueries.processesByStages().queryKey,
        refetchType: 'active', // Só refetch queries ativas
      });

      // Pre-populate o cache individual do processo criado
      queryClient.setQueryData(
        corporateQueries.processById(newProcess.id).queryKey,
        { processo: newProcess },
      );

      // Invalidate outras queries relacionadas se necessário
      queryClient.invalidateQueries({
        queryKey: corporateQueries.listStages().queryKey,
        refetchType: 'none', // Só marca como stale, não refetch imediato
      });
    },
  });

  const updateProcess = useMutation<ProcessById, Error, UpdateProcessDTO>({
    mutationFn: corporateService.update,

    onSuccess: (_updatedProcess, variables) => {
      queryClient.refetchQueries({
        queryKey: corporateQueries.processById(variables.processo_id).queryKey,
      });

      queryClient.refetchQueries({
        queryKey: corporateQueries.processesByStages().queryKey,
      });

      if (variables.etapa_id) {
        queryClient.refetchQueries({
          queryKey: corporateQueries.listStages().queryKey,
        });
      }
    },
  });

  const deleteProcess = useMutation<void, Error, string>({
    mutationFn: (processo_id: string) => corporateService.delete(processo_id),

    onSuccess: (_response, processo_id) => {
      // Simplesmente invalidar as queries
      queryClient.invalidateQueries({
        queryKey: corporateQueries.processesByStages().queryKey,
      });

      // Remover do cache individual
      queryClient.removeQueries({
        queryKey: corporateQueries.processById(processo_id).queryKey,
      });
    },

    onError: (error) => {},
  });

  return {
    createProcess,
    updateProcess,
    deleteProcess,
  };
};
