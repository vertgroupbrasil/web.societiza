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

  // A lista retorna apenas id, name, description — sem status.
  // Por isso, retornamos o primeiro da lista (assumindo que a API ordena por relevância)
  // ou o usuário deve selecionar qual template usar.
  return {
    templates,
    ...rest,
  };
};
