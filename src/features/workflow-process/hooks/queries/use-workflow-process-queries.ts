import { useQuery } from '@tanstack/react-query';
import type { WorkflowProcessType } from '../../server/types';
import { workflowProcessQueries } from './query-options';

export const useWorkflowProcessBoard = (
  accountancyId: string | undefined,
  processType?: WorkflowProcessType,
) => {
  return useQuery({
    ...workflowProcessQueries.board(accountancyId ?? '', processType),
    enabled: Boolean(accountancyId),
  });
};

export const useWorkflowProcessBoardBySteps = (
  accountancyId: string | undefined,
  templateId?: string,
) => {
  return useQuery({
    ...workflowProcessQueries.boardBySteps(accountancyId ?? '', templateId),
    enabled: Boolean(accountancyId),
  });
};

export const useWorkflowProcessDetail = (
  processId: string | undefined,
  enabled = true,
) => {
  return useQuery({
    ...workflowProcessQueries.detail(processId ?? ''),
    enabled: Boolean(processId) && enabled,
  });
};
