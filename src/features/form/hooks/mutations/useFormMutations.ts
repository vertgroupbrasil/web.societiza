'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useFormContext,
  CompanyData,
  PartnersData,
  OpeningForm,
  formService,
} from '@form/index';
import { toast } from 'sonner';

export const useFormMutations = () => {
  const queryClient = useQueryClient();
  const { processoId, updateFromApiResponse } = useFormContext();

  const createForm = useMutation({
    mutationFn: (data: CompanyData) => formService.createForm(data),
    onSuccess: (response: OpeningForm) => {
      updateFromApiResponse(response);
      queryClient.setQueryData(['form', processoId], response);
      toast.success('Dados da empresa salvos com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating form:', error);
      toast.error('Erro ao salvar dados da empresa');
    },
  });

  const createPartners = useMutation({
    mutationFn: (data: PartnersData) => formService.createPartner(data),
    onSuccess: (response: OpeningForm) => {
      updateFromApiResponse(response);
      queryClient.setQueryData(['form', processoId], response);
      toast.success('Dados dos sócios salvos com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating partners:', error);
      toast.error('Erro ao salvar dados dos sócios');
    },
  });

  return {
    createForm,
    createPartners,
  };
};