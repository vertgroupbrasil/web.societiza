import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workflowTemplateService } from '../../server/services/template.service';
import { templateQueries } from '../queries/query-options';
import { getApiErrorMessage } from '../../lib/api-error';
import type {
  CreateTemplateDTO,
  UpdateTemplateParams,
  CreateEntityResponse,
} from '../../server/types/template.types';

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateEntityResponse, Error, CreateTemplateDTO>({
    mutationFn: (data) => workflowTemplateService.create(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: templateQueries.list().queryKey,
      });
      toast.success('Template criado com sucesso!');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Erro ao criar template'));
    },
  });
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateTemplateParams>({
    mutationFn: ({ templateId, data }) =>
      workflowTemplateService.update(templateId, data),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: templateQueries.detail(variables.templateId).queryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: templateQueries.list().queryKey,
      });
      toast.success('Template atualizado!');
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
      await queryClient.invalidateQueries({
        queryKey: templateQueries.detail(templateId).queryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: templateQueries.list().queryKey,
      });
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
      await queryClient.invalidateQueries({
        queryKey: templateQueries.detail(templateId).queryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: templateQueries.list().queryKey,
      });
      toast.success('Template arquivado com sucesso!');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Erro ao arquivar template'));
    },
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (templateId) => workflowTemplateService.delete(templateId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: templateQueries.list().queryKey,
      });
      toast.success('Template deletado com sucesso!');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Erro ao deletar template'));
    },
  });
};
