import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workflowTemplateService } from '../../server/services/template.service';
import { templateQueries } from '../queries/query-options';
import { refreshVisibleAndMarkStale } from '@societiza/lib/query-refresh';
import {
  replaceStepInTemplate,
  restoreTemplateDetailCache,
  updateTemplateDetailCache,
} from '../../lib/template-cache';
import type {
  AddStepParams,
  UpdateStepParams,
  RemoveStepParams,
  CreateEntityResponse,
  WorkflowTemplateDetail,
  WorkflowTemplateStep,
} from '../../server/types/template.types';

type DetailCacheContext = {
  previous: WorkflowTemplateDetail | undefined;
};

type AddStepContext = DetailCacheContext & {
  tempId: string;
};

export const useAddStep = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateEntityResponse, Error, AddStepParams, AddStepContext>({
    mutationFn: ({ templateId, data }) =>
      workflowTemplateService.addStep(templateId, data),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: templateQueries.detail(variables.templateId).queryKey,
      });

      const tempId = variables.clientId ?? `temp-step-${crypto.randomUUID()}`;
      const { previous } = updateTemplateDetailCache(
        queryClient,
        variables.templateId,
        (template) => ({
          ...template,
          steps: [
            ...template.steps,
            {
              id: tempId,
              title: variables.data.title,
              description: variables.data.description,
              order: variables.data.order,
              fields: [],
              tasks: [],
            },
          ].sort((left, right) => left.order - right.order),
        }),
      );

      return {
        previous,
        tempId,
      };
    },
    onSuccess: async (data, variables, context) => {
      if (context?.tempId) {
        updateTemplateDetailCache(queryClient, variables.templateId, (template) =>
          replaceStepInTemplate(
            template,
            (step) => step.id === context.tempId,
            {
              id: data.id,
              title: variables.data.title,
              description: variables.data.description,
              order: variables.data.order,
              fields: [],
              tasks: [],
            },
          ),
        );
      }

      await refreshVisibleAndMarkStale(queryClient, [
        templateQueries.detail(variables.templateId).queryKey,
        templateQueries.list().queryKey,
      ]);
      toast.success('Etapa adicionada com sucesso!');
    },
    onError: (_error, variables, context) => {
      restoreTemplateDetailCache(queryClient, variables.templateId, context?.previous);
      toast.error('Erro ao adicionar etapa');
    },
  });
};

export const useUpdateStep = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateStepParams>({
    mutationFn: ({ templateId, stepId, data }) =>
      workflowTemplateService.updateStep(templateId, stepId, data),
    onSuccess: async (_data, variables) => {
      await refreshVisibleAndMarkStale(queryClient, [
        templateQueries.detail(variables.templateId).queryKey,
      ]);
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
    onSuccess: async (_data, variables) => {
      await refreshVisibleAndMarkStale(queryClient, [
        templateQueries.detail(variables.templateId).queryKey,
        templateQueries.list().queryKey,
      ]);
      toast.success('Etapa removida com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao remover etapa');
    },
  });
};

export const useReorderSteps = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { templateId: string; steps: WorkflowTemplateStep[] },
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
          steps: variables.steps,
        }),
      );

      return { previous };
    },
    mutationFn: async ({ templateId, steps }) => {
      for (const [index, step] of steps.entries()) {
        await workflowTemplateService.updateStep(templateId, step.id, {
          title: step.title,
          description: step.description,
          order: index + 1,
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
      toast.error('Erro ao reorganizar etapas');
    },
  });
};
