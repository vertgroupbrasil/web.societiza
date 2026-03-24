import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workflowTemplateService } from '../../server/services/template.service';
import { templateQueries } from '../queries/query-options';
import type {
  AddStepFieldParams,
  UpdateStepFieldParams,
  RemoveStepFieldParams,
  AddTaskFieldParams,
  UpdateTaskFieldParams,
  RemoveTaskFieldParams,
  CreateEntityResponse,
} from '../../server/types/template.types';

// ====== Step Field Mutations ======

export const useAddStepField = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateEntityResponse, Error, AddStepFieldParams>({
    mutationFn: ({ templateId, stepId, data }) =>
      workflowTemplateService.addStepField(templateId, stepId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: templateQueries.detail(variables.templateId).queryKey,
      });
      toast.success('Campo adicionado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao adicionar campo');
    },
  });
};

export const useUpdateStepField = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateStepFieldParams>({
    mutationFn: ({ templateId, stepId, fieldId, data }) =>
      workflowTemplateService.updateStepField(
        templateId,
        stepId,
        fieldId,
        data,
      ),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: templateQueries.detail(variables.templateId).queryKey,
      });
      toast.success('Campo atualizado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar campo');
    },
  });
};

export const useRemoveStepField = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, RemoveStepFieldParams>({
    mutationFn: ({ templateId, stepId, fieldId }) =>
      workflowTemplateService.removeStepField(templateId, stepId, fieldId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: templateQueries.detail(variables.templateId).queryKey,
      });
      toast.success('Campo removido com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao remover campo');
    },
  });
};

// ====== Task Field Mutations ======

export const useAddTaskField = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateEntityResponse, Error, AddTaskFieldParams>({
    mutationFn: ({ templateId, stepId, taskId, data }) =>
      workflowTemplateService.addTaskField(templateId, stepId, taskId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: templateQueries.detail(variables.templateId).queryKey,
      });
      toast.success('Campo da tarefa adicionado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao adicionar campo à tarefa');
    },
  });
};

export const useUpdateTaskField = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateTaskFieldParams>({
    mutationFn: ({ templateId, stepId, taskId, fieldId, data }) =>
      workflowTemplateService.updateTaskField(
        templateId,
        stepId,
        taskId,
        fieldId,
        data,
      ),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: templateQueries.detail(variables.templateId).queryKey,
      });
      toast.success('Campo da tarefa atualizado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar campo da tarefa');
    },
  });
};

export const useRemoveTaskField = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, RemoveTaskFieldParams>({
    mutationFn: ({ templateId, stepId, taskId, fieldId }) =>
      workflowTemplateService.removeTaskField(
        templateId,
        stepId,
        taskId,
        fieldId,
      ),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: templateQueries.detail(variables.templateId).queryKey,
      });
      toast.success('Campo da tarefa removido com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao remover campo da tarefa');
    },
  });
};
