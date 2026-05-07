import { queryOptions } from '@tanstack/react-query';
import { workflowProcessService } from '../../server/services';
import type { WorkflowProcessType } from '../../server/types';

export const workflowProcessQueries = {
  all: () => ['workflow-process'] as const,
  boards: () => [...workflowProcessQueries.all(), 'board'] as const,
  board: (accountancyId: string, processType?: WorkflowProcessType) =>
    queryOptions({
      queryKey: [
        ...workflowProcessQueries.boards(),
        { accountancyId, processType },
      ] as const,
      queryFn: () => workflowProcessService.listBoard(accountancyId, processType),
      enabled: Boolean(accountancyId),
    }),
  boardsBySteps: () => [...workflowProcessQueries.all(), 'board-by-steps'] as const,
  boardBySteps: (accountancyId: string) =>
    queryOptions({
      queryKey: [
        ...workflowProcessQueries.boardsBySteps(),
        { accountancyId },
      ] as const,
      queryFn: () => workflowProcessService.listBoardBySteps(accountancyId),
      enabled: Boolean(accountancyId),
    }),
  details: () => [...workflowProcessQueries.all(), 'detail'] as const,
  detail: (processId: string) =>
    queryOptions({
      queryKey: [...workflowProcessQueries.details(), processId] as const,
      queryFn: () => workflowProcessService.getById(processId),
      enabled: Boolean(processId),
    }),
};
