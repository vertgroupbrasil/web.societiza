import { useQuery } from '@tanstack/react-query';
import { formQueries } from '@form/index';

export const getFormStatus = (processoId: string) => {
  return useQuery(formQueries.getStatus(processoId));
};

export const getFormById = (processoId: string) => {
  return useQuery(formQueries.getById(processoId));
};

export const getCep = (cep: string) => {
  return useQuery(formQueries.getCep(cep));
};

export const useFormQueries = (processoId: string) => {
  const formStatus = getFormStatus(processoId);
  const form = getFormById(processoId);

  return {
    isLoading: formStatus.isFetching,
    error: formStatus.isError,
    isCompleted: formStatus.data?.isCompleted,
    hasCompanyData: formStatus.data?.hasCompanyData,
    hasPartersData: formStatus.data?.hasPartnersData,
    formData: form.data?.formulario,
  };
};
