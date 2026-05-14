import { useQuery } from '@tanstack/react-query';
import type { WorkflowTemplateListParams } from '../../server/types';
import { templateQueries } from './query-options';

export const useWorkflowTemplates = (params?: WorkflowTemplateListParams) => {
  return useQuery(templateQueries.list(params));
};

export const useWorkflowTemplateById = (id: string) => {
  return useQuery(templateQueries.detail(id));
};

export const useActiveWorkflowTemplate = () => {
  const { data: page, ...rest } = useWorkflowTemplates();

  const activeTemplate = page?.items?.find(
    (template) => template.status === 'Active' && !template.sourceTemplateId,
  );

  return {
    activeTemplate,
    templates: page?.items,
    ...rest,
  };
};
