import { queryOptions } from '@tanstack/react-query';
import { workflowTemplateService } from '../../server/services/template.service';
import { TEMPLATE_STALE_TIME } from '../../constants/template.constants';
import type { WorkflowTemplateListParams } from '../../server/types';

export const templateQueries = {
  all: () => ['workflow-templates'] as const,
  lists: () => [...templateQueries.all(), 'list'] as const,

  list: (params: WorkflowTemplateListParams = {}) =>
    queryOptions({
      queryKey: [...templateQueries.lists(), params] as const,
      queryFn: () => workflowTemplateService.list(params),
      staleTime: TEMPLATE_STALE_TIME.list,
      refetchOnWindowFocus: true,
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: [...templateQueries.all(), 'detail', id],
      queryFn: () => workflowTemplateService.getById(id),
      staleTime: TEMPLATE_STALE_TIME.detail,
      enabled: !!id,
    }),
};
