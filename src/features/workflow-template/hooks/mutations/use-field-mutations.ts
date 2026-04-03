import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workflowTemplateService } from '../../server/services/template.service';
import { templateQueries } from '../queries/query-options';
import { refreshVisibleAndMarkStale } from '@societiza/lib/query-refresh';
import {
  replaceStepFieldInTemplate,
  replaceTaskFieldInTemplate,
  restoreTemplateDetailCache,
  updateTemplateDetailCache,
} from '../../lib/template-cache';
import type {
  AddStepFieldParams,
  UpdateStepFieldParams,
  RemoveStepFieldParams,
  AddTaskFieldParams,
  UpdateTaskFieldParams,
  RemoveTaskFieldParams,
  CreateEntityResponse,
  WorkflowTemplateDetail,
  WorkflowTemplateField,
} from '../../server/types/template.types';

type DetailCacheContext = {
  previous: WorkflowTemplateDetail | undefined;
};

type AddFieldContext = DetailCacheContext & {
  tempId: string;
};

// ====== Step Field Mutations ======

export const useAddStepField = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateEntityResponse,
    Error,
    AddStepFieldParams,
    AddFieldContext
  >({
    mutationFn: ({ templateId, stepId, data }) =>
      workflowTemplateService.addStepField(templateId, stepId, data),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: templateQueries.detail(variables.templateId).queryKey,
      });

      const tempId = variables.clientId ?? `temp-step-field-${crypto.randomUUID()}`;
      const optimisticField: WorkflowTemplateField = {
        id: tempId,
        label: variables.data.label,
        fieldType: variables.data.fieldType,
        options: variables.data.options,
        order: variables.data.order,
      };

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
                  fields: [...step.fields, optimisticField].sort(
                    (left, right) => left.order - right.order,
                  ),
                },
          ),
        }),
      );

      return { previous, tempId };
    },
    onSuccess: async (data, variables, context) => {
      if (context?.tempId) {
        updateTemplateDetailCache(queryClient, variables.templateId, (template) =>
          replaceStepFieldInTemplate(
            template,
            variables.stepId,
            (field) => field.id === context.tempId,
            {
              id: data.id,
              label: variables.data.label,
              fieldType: variables.data.fieldType,
              options: variables.data.options,
              order: variables.data.order,
            },
          ),
        );
      }

      await refreshVisibleAndMarkStale(queryClient, [
        templateQueries.detail(variables.templateId).queryKey,
      ]);
      toast.success('Campo adicionado com sucesso!');
    },
    onError: (_error, variables, context) => {
      restoreTemplateDetailCache(queryClient, variables.templateId, context?.previous);
      toast.error('Erro ao adicionar campo');
    },
  });
};

export const useUpdateStepField = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateStepFieldParams, DetailCacheContext>({
    mutationFn: ({ templateId, stepId, fieldId, data }) =>
      workflowTemplateService.updateStepField(
        templateId,
        stepId,
        fieldId,
        data,
      ),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: templateQueries.detail(variables.templateId).queryKey,
      });

      const { previous } = updateTemplateDetailCache(
        queryClient,
        variables.templateId,
        (template) =>
          replaceStepFieldInTemplate(
            template,
            variables.stepId,
            (field) => field.id === variables.fieldId,
            {
              id: variables.fieldId,
              label: variables.data.label,
              fieldType: variables.data.fieldType,
              options: variables.data.options,
              order: variables.data.order,
            },
          ),
      );

      return { previous };
    },
    onSuccess: async (_data, variables) => {
      await refreshVisibleAndMarkStale(queryClient, [
        templateQueries.detail(variables.templateId).queryKey,
      ]);
    },
    onError: (_error, variables, context) => {
      restoreTemplateDetailCache(queryClient, variables.templateId, context?.previous);
      toast.error('Erro ao atualizar campo');
    },
  });
};

export const useRemoveStepField = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, RemoveStepFieldParams>({
    mutationFn: ({ templateId, stepId, fieldId }) =>
      workflowTemplateService.removeStepField(templateId, stepId, fieldId),
    onSuccess: async (_data, variables) => {
      await refreshVisibleAndMarkStale(queryClient, [
        templateQueries.detail(variables.templateId).queryKey,
      ]);
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

  return useMutation<
    CreateEntityResponse,
    Error,
    AddTaskFieldParams,
    AddFieldContext
  >({
    mutationFn: ({ templateId, stepId, taskId, data }) =>
      workflowTemplateService.addTaskField(templateId, stepId, taskId, data),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: templateQueries.detail(variables.templateId).queryKey,
      });

      const tempId = variables.clientId ?? `temp-task-field-${crypto.randomUUID()}`;
      const optimisticField: WorkflowTemplateField = {
        id: tempId,
        label: variables.data.label,
        fieldType: variables.data.fieldType,
        options: variables.data.options,
        order: variables.data.order,
      };

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
                  tasks: step.tasks.map((task) =>
                    task.id !== variables.taskId
                      ? task
                      : {
                          ...task,
                          fields: [...task.fields, optimisticField].sort(
                            (left, right) => left.order - right.order,
                          ),
                        },
                  ),
                },
          ),
        }),
      );

      return { previous, tempId };
    },
    onSuccess: async (data, variables, context) => {
      if (context?.tempId) {
        updateTemplateDetailCache(queryClient, variables.templateId, (template) =>
          replaceTaskFieldInTemplate(
            template,
            variables.stepId,
            variables.taskId,
            (field) => field.id === context.tempId,
            {
              id: data.id,
              label: variables.data.label,
              fieldType: variables.data.fieldType,
              options: variables.data.options,
              order: variables.data.order,
            },
          ),
        );
      }

      await refreshVisibleAndMarkStale(queryClient, [
        templateQueries.detail(variables.templateId).queryKey,
      ]);
      toast.success('Campo da tarefa adicionado com sucesso!');
    },
    onError: (_error, variables, context) => {
      restoreTemplateDetailCache(queryClient, variables.templateId, context?.previous);
      toast.error('Erro ao adicionar campo à tarefa');
    },
  });
};

export const useUpdateTaskField = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateTaskFieldParams, DetailCacheContext>({
    mutationFn: ({ templateId, stepId, taskId, fieldId, data }) =>
      workflowTemplateService.updateTaskField(
        templateId,
        stepId,
        taskId,
        fieldId,
        data,
      ),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: templateQueries.detail(variables.templateId).queryKey,
      });

      const { previous } = updateTemplateDetailCache(
        queryClient,
        variables.templateId,
        (template) =>
          replaceTaskFieldInTemplate(
            template,
            variables.stepId,
            variables.taskId,
            (field) => field.id === variables.fieldId,
            {
              id: variables.fieldId,
              label: variables.data.label,
              fieldType: variables.data.fieldType,
              options: variables.data.options,
              order: variables.data.order,
            },
          ),
      );

      return { previous };
    },
    onSuccess: async (_data, variables) => {
      await refreshVisibleAndMarkStale(queryClient, [
        templateQueries.detail(variables.templateId).queryKey,
      ]);
    },
    onError: (_error, variables, context) => {
      restoreTemplateDetailCache(queryClient, variables.templateId, context?.previous);
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
    onSuccess: async (_data, variables) => {
      await refreshVisibleAndMarkStale(queryClient, [
        templateQueries.detail(variables.templateId).queryKey,
      ]);
      toast.success('Campo da tarefa removido com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao remover campo da tarefa');
    },
  });
};

export const useReorderStepFields = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { templateId: string; stepId: string; fields: WorkflowTemplateField[] },
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
                  fields: variables.fields,
                },
          ),
        }),
      );

      return { previous };
    },
    mutationFn: async ({ templateId, stepId, fields }) => {
      for (const [index, field] of fields.entries()) {
        await workflowTemplateService.updateStepField(
          templateId,
          stepId,
          field.id,
          {
            label: field.label,
            fieldType: field.fieldType,
            options: field.options,
            order: index + 1,
          },
        );
      }
    },
    onSuccess: async (_data, variables) => {
      await refreshVisibleAndMarkStale(queryClient, [
        templateQueries.detail(variables.templateId).queryKey,
      ]);
    },
    onError: (_error, variables, context) => {
      restoreTemplateDetailCache(queryClient, variables.templateId, context?.previous);
      toast.error('Erro ao reorganizar campos da etapa');
    },
  });
};

export const useReorderTaskFields = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    {
      templateId: string;
      stepId: string;
      taskId: string;
      fields: WorkflowTemplateField[];
    },
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
                  tasks: step.tasks.map((task) =>
                    task.id !== variables.taskId
                      ? task
                      : {
                          ...task,
                          fields: variables.fields,
                        },
                  ),
                },
          ),
        }),
      );

      return { previous };
    },
    mutationFn: async ({ templateId, stepId, taskId, fields }) => {
      for (const [index, field] of fields.entries()) {
        await workflowTemplateService.updateTaskField(
          templateId,
          stepId,
          taskId,
          field.id,
          {
            label: field.label,
            fieldType: field.fieldType,
            options: field.options,
            order: index + 1,
          },
        );
      }
    },
    onSuccess: async (_data, variables) => {
      await refreshVisibleAndMarkStale(queryClient, [
        templateQueries.detail(variables.templateId).queryKey,
      ]);
    },
    onError: (_error, variables, context) => {
      restoreTemplateDetailCache(queryClient, variables.templateId, context?.previous);
      toast.error('Erro ao reorganizar campos da tarefa');
    },
  });
};
