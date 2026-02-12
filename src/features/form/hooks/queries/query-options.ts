import { queryOptions } from '@tanstack/react-query';
import { formService, viaCepService } from '@form/index';

export const formQueries = {
  getById: (processoId: string) =>
    queryOptions({
      queryKey: ['form', processoId],
      queryFn: () => formService.getFormById(processoId),
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
    }),

  getStatus: (processoId: string) =>
    queryOptions({
      queryKey: ['form-status', processoId],
      queryFn: () => formService.getFormById(processoId),
      select: (data) => {
        const formulario = data?.formulario;
        return {
          isCompleted:
            !!formulario &&
            !!formulario.opcoes_nome_empresa &&
            formulario.socios.length > 0,
          hasCompanyData: !!formulario && !!formulario.opcoes_nome_empresa,
          hasPartnersData: !!formulario && formulario.socios.length > 0,
        };
      },
      staleTime: 1000 * 60 * 2, // 2 minutes
    }),
  getCep: (cep: string) =>
    queryOptions({
      queryKey: ['cep', cep],
      queryFn: () => viaCepService.get(cep),
      enabled: cep.length === 8, // Só busca CEPs com 8 dígitos
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    }),
};
