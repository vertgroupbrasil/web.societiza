import { queryOptions } from '@tanstack/react-query';
import { workflowTemplateService } from '../../server/services/template.service';
import { TEMPLATE_STALE_TIME } from '../../constants/template.constants';

export const templateQueries = {
  all: () => ['workflow-templates'] as const,

  list: () =>
    queryOptions({
      queryKey: [...templateQueries.all(), 'list'],
      queryFn: workflowTemplateService.list,
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
