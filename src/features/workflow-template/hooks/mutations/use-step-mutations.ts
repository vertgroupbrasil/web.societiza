import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workflowTemplateService } from '../../server/services/template.service';
import { templateQueries } from '../queries/query-options';
import type {
  AddStepParams,
  UpdateStepParams,
  RemoveStepParams,
  CreateEntityResponse,
} from '../../server/types/template.types';

export const useAddStep = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateEntityResponse, Error, AddStepParams>({
    mutationFn: ({ templateId, data }) =>
      workflowTemplateService.addStep(templateId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: templateQueries.detail(variables.templateId).queryKey,
      });
      toast.success('Etapa adicionada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao adicionar etapa');
    },
  });
};

export const useUpdateStep = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateStepParams>({
    mutationFn: ({ templateId, stepId, data }) =>
      workflowTemplateService.updateStep(templateId, stepId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: templateQueries.detail(variables.templateId).queryKey,
      });
      toast.success('Etapa atualizada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar etapa');
    },
  });
};

export const useRemoveStep = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, RemoveStepParams>({
    mutationFn: ({ templateId, stepId }) =>
      workflowTemplateService.removeStep(templateId, stepId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: templateQueries.detail(variables.templateId).queryKey,
      });
      toast.success('Etapa removida com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao remover etapa');
    },
  });
};
