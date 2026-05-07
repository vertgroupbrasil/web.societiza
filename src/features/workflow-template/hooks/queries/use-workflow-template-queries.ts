import { useQuery } from '@tanstack/react-query';
import { templateQueries } from './query-options';

export const useWorkflowTemplates = () => {
  return useQuery(templateQueries.list());
};

export const useWorkflowTemplateById = (id: string) => {
  return useQuery(templateQueries.detail(id));
};

export const useActiveWorkflowTemplate = () => {
  const { data: templates, ...rest } = useWorkflowTemplates();

  const activeTemplate = templates?.find(
    (template) => template.status === 'Active' && !template.sourceTemplateId,
  );

  return {
    activeTemplate,
    templates,
    ...rest,
  };
};
