import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workflowTemplateService } from '../../server/services/template.service';
import { templateQueries } from '../queries/query-options';
import { refreshVisibleAndMarkStale } from '@societiza/lib/query-refresh';
import {
  replaceTaskInTemplate,
  restoreTemplateDetailCache,
  updateTemplateDetailCache,
} from '../../lib/template-cache';
import type {
  AddTaskParams,
  UpdateTaskParams,
  RemoveTaskParams,
  CreateEntityResponse,
  WorkflowTemplateDetail,
  WorkflowTemplateTask,
} from '../../server/types/template.types';

type DetailCacheContext = {
  previous: WorkflowTemplateDetail | undefined;
};

type AddTaskContext = DetailCacheContext & {
  tempId: string;
};

export const useAddTask = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateEntityResponse, Error, AddTaskParams, AddTaskContext>({
    mutationFn: ({ templateId, stepId, data }) =>
      workflowTemplateService.addTask(templateId, stepId, data),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: templateQueries.detail(variables.templateId).queryKey,
      });

      const tempId = variables.clientId ?? `temp-task-${crypto.randomUUID()}`;
      const { previous } = updateTemplateDetailCache(
        queryClient,
        variables.templateId,
        (template) => ({
          ...template,
          steps: template.steps.map((step) =>
            step.id !== variables.stepId
              ? step
              : {
                  ...step,
                  tasks: [
                    ...step.tasks,
                    {
                      id: tempId,
                      title: variables.data.title,
                      description: variables.data.description,
                      type: variables.data.type,
                      configuration: variables.data.configuration,
                      order: variables.data.order,
                      isOptional: variables.data.isOptional,
                      fields: [],
                    },
                  ].sort((left, right) => left.order - right.order),
                },
          ),
        }),
      );

      return { previous, tempId };
    },
    onSuccess: async (data, variables, context) => {
      if (context?.tempId) {
        updateTemplateDetailCache(queryClient, variables.templateId, (template) =>
          replaceTaskInTemplate(
            template,
            variables.stepId,
            (task) => task.id === context.tempId,
            {
              id: data.id,
              title: variables.data.title,
              description: variables.data.description,
              type: variables.data.type,
              configuration: variables.data.configuration,
              order: variables.data.order,
              isOptional: variables.data.isOptional,
              fields: [],
            },
          ),
        );
      }

      await refreshVisibleAndMarkStale(queryClient, [
        templateQueries.detail(variables.templateId).queryKey,
      ]);
      toast.success('Tarefa adicionada com sucesso!');
    },
    onError: (_error, variables, context) => {
      restoreTemplateDetailCache(queryClient, variables.templateId, context?.previous);
      toast.error('Erro ao adicionar tarefa');
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateTaskParams>({
    mutationFn: ({ templateId, stepId, taskId, data }) =>
      workflowTemplateService.updateTask(templateId, stepId, taskId, data),
    onSuccess: async (_data, variables) => {
      await refreshVisibleAndMarkStale(queryClient, [
        templateQueries.detail(variables.templateId).queryKey,
      ]);
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
    onSuccess: async (_data, variables) => {
      await refreshVisibleAndMarkStale(queryClient, [
        templateQueries.detail(variables.templateId).queryKey,
      ]);
      toast.success('Tarefa removida com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao remover tarefa');
    },
  });
};

export const useReorderTasks = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { templateId: string; stepId: string; tasks: WorkflowTemplateTask[] },
    DetailCacheContext
  >({
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: templateQueries.detail(variables.templateId).queryKey,
      });

      const { previous } = updateTemplateDetailCache(
        queryClient,
        variables.templateId,
        (template) => ({
          ...template,
          steps: template.steps.map((step) =>
            step.id !== variables.stepId
              ? step
              : {
                  ...step,
                  tasks: variables.tasks,
                },
          ),
        }),
      );

      return { previous };
    },
    mutationFn: async ({ templateId, stepId, tasks }) => {
      for (const [index, task] of tasks.entries()) {
        await workflowTemplateService.updateTask(templateId, stepId, task.id, {
          title: task.title,
          description: task.description,
          type: task.type,
          configuration: task.configuration,
          order: index + 1,
          isOptional: task.isOptional,
        });
      }
    },
    onSuccess: async (_data, variables) => {
      await refreshVisibleAndMarkStale(queryClient, [
        templateQueries.detail(variables.templateId).queryKey,
      ]);
    },
    onError: (_error, variables, context) => {
      restoreTemplateDetailCache(queryClient, variables.templateId, context?.previous);
      toast.error('Erro ao reorganizar tarefas');
    },
  });
};
