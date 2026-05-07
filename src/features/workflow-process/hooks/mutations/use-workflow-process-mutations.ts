import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workflowProcessService } from '../../server/services';
import type {
  CreateWorkflowProcessPayload,
  FillWorkflowProcessStepFieldParams,
  FillWorkflowProcessTaskFieldParams,
  WorkflowProcessTaskActionParams,
} from '../../server/types';
import { workflowProcessQueries } from '../queries';

const getBackendMessage = (error: unknown): string | undefined => {
  const data = (error as { response?: { data?: unknown } })?.response?.data;

  if (typeof data === 'string') return data;
  if (data && typeof data === 'object' && 'message' in data) {
    const message = (data as { message?: unknown }).message;
    return typeof message === 'string' ? message : undefined;
  }

  return undefined;
};

const invalidateProcessRuntime = async (
  queryClient: ReturnType<typeof useQueryClient>,
  processId: string,
) => {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: workflowProcessQueries.boards(),
    }),
    queryClient.invalidateQueries({
      queryKey: workflowProcessQueries.boardsBySteps(),
    }),
    queryClient.invalidateQueries({
      queryKey: workflowProcessQueries.detail(processId).queryKey,
    }),
  ]);
};

export const useCreateWorkflowProcess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWorkflowProcessPayload) =>
      workflowProcessService.create(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: workflowProcessQueries.boards(),
        }),
        queryClient.invalidateQueries({
          queryKey: workflowProcessQueries.boardsBySteps(),
        }),
      ]);
      toast.success('Processo criado com sucesso.');
    },
    onError: (error) => {
      toast.error(getBackendMessage(error) ?? 'Não foi possível criar o processo.');
    },
  });
};

export const useDeleteWorkflowProcess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (processId: string) => workflowProcessService.delete(processId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: workflowProcessQueries.boards(),
        }),
        queryClient.invalidateQueries({
          queryKey: workflowProcessQueries.boardsBySteps(),
        }),
      ]);
      toast.success('Processo excluído com sucesso.');
    },
    onError: (error) => {
      toast.error(
        getBackendMessage(error) ?? 'Não foi possível excluir o processo.',
      );
    },
  });
};

export const useCompleteWorkflowProcessTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: WorkflowProcessTaskActionParams) =>
      workflowProcessService.completeTask(params),
    onSuccess: async (_, params) => {
      await invalidateProcessRuntime(queryClient, params.processId);
      toast.success('Tarefa concluída.');
    },
    onError: (error) => {
      toast.error(
        getBackendMessage(error) ?? 'Não foi possível concluir a tarefa.',
      );
    },
  });
};

export const useSkipWorkflowProcessTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: WorkflowProcessTaskActionParams) =>
      workflowProcessService.skipTask(params),
    onSuccess: async (_, params) => {
      await invalidateProcessRuntime(queryClient, params.processId);
      toast.success('Tarefa saltada.');
    },
    onError: (error) => {
      toast.error(getBackendMessage(error) ?? 'Não foi possível saltar a tarefa.');
    },
  });
};

export const useRevertWorkflowProcessTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: WorkflowProcessTaskActionParams) =>
      workflowProcessService.revertTask(params),
    onSuccess: async (_, params) => {
      await invalidateProcessRuntime(queryClient, params.processId);
      toast.success('Tarefa revertida.');
    },
    onError: (error) => {
      toast.error(
        getBackendMessage(error) ?? 'Não foi possível reverter a tarefa.',
      );
    },
  });
};

export const useFillWorkflowProcessStepField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      processId,
      stepInstanceId,
      fieldInstanceId,
      value,
    }: FillWorkflowProcessStepFieldParams) =>
      workflowProcessService.fillStepField(
        processId,
        stepInstanceId,
        fieldInstanceId,
        { value },
      ),
    onSuccess: async (_, params) => {
      await queryClient.invalidateQueries({
        queryKey: workflowProcessQueries.detail(params.processId).queryKey,
      });
      toast.success('Campo salvo.');
    },
    onError: (error) => {
      toast.error(getBackendMessage(error) ?? 'Não foi possível salvar o campo.');
    },
  });
};

export const useFillWorkflowProcessTaskField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      processId,
      stepInstanceId,
      taskInstanceId,
      fieldInstanceId,
      value,
    }: FillWorkflowProcessTaskFieldParams) =>
      workflowProcessService.fillTaskField(
        processId,
        stepInstanceId,
        taskInstanceId,
        fieldInstanceId,
        { value },
      ),
    onSuccess: async (_, params) => {
      await queryClient.invalidateQueries({
        queryKey: workflowProcessQueries.detail(params.processId).queryKey,
      });
      toast.success('Campo salvo.');
    },
    onError: (error) => {
      toast.error(getBackendMessage(error) ?? 'Não foi possível salvar o campo.');
    },
  });
};
