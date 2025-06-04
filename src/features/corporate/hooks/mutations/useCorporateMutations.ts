// hooks/mutations/useCorporateMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 } from 'uuid';
import {
  MutationContext,
  Process,
  ProcessByStages,
  ProcessDTO,
} from '../../server/types/corporate.types';
import { corporateService } from '../../server/services/corporate.service';
import { corporateQueries } from '../queries/queryOptions';

export const useCorporateMutations = () => {
  const queryClient = useQueryClient();

  const createProcess = useMutation<
    Process,
    Error,
    ProcessDTO,
    MutationContext
  >({
    mutationFn: corporateService.create,

    onMutate: (newProcessData) => {
      const queryKey = corporateQueries.processesByStages().queryKey;

      queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<ProcessByStages>(queryKey);

      queryClient.setQueryData<ProcessByStages>(queryKey, (oldData) => {
        if (!oldData) return oldData;

        const optimisticProcess: Process = {
          id: v4(),
          nome: newProcessData.nome,
          contabilidade: {
            id: newProcessData.contabilidade_id,
          },
          tipo_processo: {
            id: newProcessData.tipo_processo_id,
            descricao: 'Carregando...',
          },
          observacao: null,
          created_at: new Date(),
          expire_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          tarefas: [],
          isOptimistic: true,
        };

        const newData: ProcessByStages = JSON.parse(JSON.stringify(oldData));

        const stageTarget = newData.processos_por_etapa.find(
          (stage) => stage.id === newProcessData.etapa_id,
        );

        if (stageTarget) {
          stageTarget.processos.push(optimisticProcess);
        }

        return newData;
      });

      return { previousData } satisfies MutationContext;
    },

    onSuccess: (serverProcess, variables, _context) => {
      const queryKey = corporateQueries.processesByStages().queryKey;

      queryClient.setQueryData<ProcessByStages>(queryKey, (oldData) => {
        if (!oldData) return oldData;

        const newData: ProcessByStages = JSON.parse(JSON.stringify(oldData));
        const stage = newData.processos_por_etapa.find(
          (e) => e.id === variables.etapa_id,
        );

        if (stage) {
          const optimisticIndex = stage.processos.findIndex(
            (p) => p.isOptimistic && p.nome === variables.nome,
          );

          if (optimisticIndex !== -1) {
            // Substitui processo otimista pelo real
            stage.processos[optimisticIndex] = {
              ...serverProcess,
              isOptimistic: false,
            };
          }
        }

        return newData;
      });
    },

    onError: (_error, _variables, context) => {
      const queryKey = corporateQueries.processesByStages().queryKey;

      // ✅ Verifica se previousData existe antes de usar
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },

    // Sempre: invalida para sincronização
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: corporateQueries.processesByStages().queryKey,
      });
    },
  });

  return { createProcess };
};
