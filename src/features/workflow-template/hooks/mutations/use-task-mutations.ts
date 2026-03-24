import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workflowTemplateService } from '../../server/services/template.service';
import { templateQueries } from '../queries/query-options';
import type {
  AddTaskParams,
  UpdateTaskParams,
  RemoveTaskParams,
  CreateEntityResponse,
} from '../../server/types/template.types';

export const useAddTask = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateEntityResponse, Error, AddTaskParams>({
    mutationFn: ({ templateId, stepId, data }) =>
      workflowTemplateService.addTask(templateId, stepId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: templateQueries.detail(variables.templateId).queryKey,
      });
      toast.success('Tarefa adicionada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao adicionar tarefa');
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateTaskParams>({
    mutationFn: ({ templateId, stepId, taskId, data }) =>
      workflowTemplateService.updateTask(templateId, stepId, taskId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: templateQueries.detail(variables.templateId).queryKey,
      });
      toast.success('Tarefa atualizada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar tarefa');
    },
  });
};

export const useRemoveTask = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, RemoveTaskParams>({
    mutationFn: ({ templateId, stepId, taskId }) =>
      workflowTemplateService.removeTask(templateId, stepId, taskId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: templateQueries.detail(variables.templateId).queryKey,
      });
      toast.success('Tarefa removida com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao remover tarefa');
    },
  });
};
