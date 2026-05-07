import { useQuery } from '@tanstack/react-query';
import { templateQueries } from './query-options';

export const useWorkflowTemplates = () => {
  return useQuery(templateQueries.list());
};

export const useWorkflowTemplateById = (id: string) => {
  return useQuery(templateQueries.detail(id));
};

/**
 * Hook que retorna o template ativo para uso no Kanban.
 * Busca a lista de templates e filtra pelo primeiro com status "Active".
 */
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

export const useTemplateDraftBySource = (sourceTemplateId?: string) => {
  const { data: templates, ...rest } = useWorkflowTemplates();

  const draft = templates
    ?.filter(
      (template) =>
        template.sourceTemplateId === sourceTemplateId &&
        template.status === 'Draft',
    )
    .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())[0];

  return {
    draft,
    templates,
    ...rest,
  };
};
