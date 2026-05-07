import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workflowTemplateService } from '../../server/services/template.service';
import { templateQueries } from '../queries/query-options';
import { refreshVisibleAndMarkStale } from '@societiza/lib/query-refresh';
import { getApiErrorMessage } from '../../lib/api-error';
import type {
  CreateTemplateDTO,
  UpdateTemplateParams,
  CreateEntityResponse,
  PublishTemplateResponse,
} from '../../server/types/template.types';

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateEntityResponse, Error, CreateTemplateDTO>({
    mutationFn: (data) => workflowTemplateService.create(data),
    onSuccess: async () => {
      await refreshVisibleAndMarkStale(queryClient, [
        templateQueries.list().queryKey,
      ]);
      toast.success('Template criado com sucesso!');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Erro ao criar template'));
    },
  });
};

export const useCreateDraftFromTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateEntityResponse, Error, string>({
    mutationFn: (templateId) => workflowTemplateService.createDraft(templateId),
    onSuccess: async () => {
      await refreshVisibleAndMarkStale(queryClient, [
        templateQueries.list().queryKey,
      ]);
      toast.success('Rascunho criado com sucesso!');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Erro ao criar rascunho'));
    },
  });
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateTemplateParams>({
    mutationFn: ({ templateId, data }) =>
      workflowTemplateService.update(templateId, data),
    onSuccess: async (_data, variables) => {
      await refreshVisibleAndMarkStale(queryClient, [
        templateQueries.detail(variables.templateId).queryKey,
        templateQueries.list().queryKey,
      ]);
      toast.success('Rascunho salvo!');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Erro ao atualizar template'));
    },
  });
};

export const useActivateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (templateId) => workflowTemplateService.activate(templateId),
    onSuccess: async (_data, templateId) => {
      await refreshVisibleAndMarkStale(queryClient, [
        templateQueries.detail(templateId).queryKey,
        templateQueries.list().queryKey,
      ]);
      toast.success('Template ativado com sucesso!');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Erro ao ativar template'));
    },
  });
};

export const useArchiveTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (templateId) => workflowTemplateService.archive(templateId),
    onSuccess: async (_data, templateId) => {
      await refreshVisibleAndMarkStale(queryClient, [
        templateQueries.detail(templateId).queryKey,
        templateQueries.list().queryKey,
      ]);
      toast.success('Template arquivado com sucesso!');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Erro ao arquivar template'));
    },
  });
};

export const usePublishTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<PublishTemplateResponse, Error, string>({
    mutationFn: (templateId) => workflowTemplateService.publish(templateId),
    onSuccess: async (data, templateId) => {
      await refreshVisibleAndMarkStale(queryClient, [
        templateQueries.detail(templateId).queryKey,
        templateQueries.detail(data.id).queryKey,
        templateQueries.list().queryKey,
      ]);
      toast.success('Workflow publicado com sucesso!');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Erro ao publicar workflow'));
    },
  });
};
