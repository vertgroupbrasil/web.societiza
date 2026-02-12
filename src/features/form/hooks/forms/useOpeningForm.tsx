// hooks/useOpeningForm.ts
'use client';

import { useCallback } from 'react';
import {
  CompanyData,
  PartnersData,
  useFormMutations,
  useFormNavigation,
  useFormContext,
} from '@form/index';
import { toast } from 'sonner';

export const useOpeningForm = () => {
  const context = useFormContext();
  const navigation = useFormNavigation();
  const mutations = useFormMutations();

  const saveCompanyDataAndProceed = useCallback(
    async (data: CompanyData) => {
      try {
        context.updateStepData({ companyData: data });
        navigation.goToNextStep();
      } catch (error) {
        toast.error('Erro ao salvar dados da empresa');
      }
    },
    [context, navigation],
  );

  const savePartnersDataAndProceed = useCallback(
    async (data: Omit<PartnersData, 'empresa_id'>) => {
      try {
        const partnersWithId: PartnersData = {
          ...data,
          empresa_id: context.createdFormId || context.processoId,
        };

        context.updateStepData({ partnersData: partnersWithId });
        navigation.goToNextStep();
      } catch (error) {
        toast.error('Erro ao salvar dados dos sócios');
      }
    },
    [context, navigation],
  );

  // ✅ ENVIO FINAL - agora com o fluxo correto
  const submitFinalForm = useCallback(async () => {
    const { companyData, partnersData } = context.formData;

    if (!companyData || !partnersData) {
      toast.error('Dados incompletos. Volte e preencha todas as etapas.');
      return;
    }

    try {
      context.setIsSubmitting(true);

      // ✅ 1. Enviar dados da empresa e capturar o form ID retornado
      const createdForm = await mutations.createForm.mutateAsync(companyData);

      // ✅ 2. Armazenar o form ID no contexto
      context.setCreatedFormId(createdForm.formulario.id);

      // ✅ 3. Atualizar os dados dos sócios com o form ID correto
      const updatedPartnersData: PartnersData = {
        ...partnersData,
        empresa_id: createdForm.formulario.id, // Usar o ID retornado, não o processoId
      };

      // ✅ 4. Enviar dados dos sócios com o empresa_id correto
      await mutations.createPartners.mutateAsync(updatedPartnersData);

      toast.success('Formulário enviado com sucesso!');
      window.location.href = `/forms/${context.processoId}/finished`;
    } catch (error) {
      toast.error('Erro ao enviar formulário. Tente novamente.');
    } finally {
      context.setIsSubmitting(false);
    }
  }, [context, mutations]);

  const goToPreviousStepWithData = useCallback(() => {
    navigation.goToPreviousStep();
  }, [navigation]);

  return {
    // --- Dados do Estado ---
    formData: context.formData,
    isSubmitting: context.isSubmitting,
    isCompleted: context.isCompleted,
    isDataLoaded: context.isDataLoaded,
    processoId: context.processoId,
    createdFormId: context.createdFormId, // ✅ Expor o form ID criado
    updateStepData: context.updateStepData,

    // --- Navegação ---
    ...navigation,
    goToPreviousStep: goToPreviousStepWithData,

    // --- Estados de Loading ---
    isSubmittingCompany: false,
    isSubmittingPartners: false,
    isSubmittingFinalForm:
      mutations.createForm.isPending || mutations.createPartners.isPending,

    // --- Ações de Salvamento Local ---
    saveCompanyData: saveCompanyDataAndProceed,
    savePartnersData: savePartnersDataAndProceed,

    // --- Ação de Envio Final ---
    submitFinalForm,

    // --- Estados Computados ---
    isFormComplete: !!(
      context.formData.companyData && context.formData.partnersData
    ),
    canSubmit:
      navigation.isLastStep &&
      !!(context.formData.companyData && context.formData.partnersData),

    // --- Helpers ---
    hasCompanyData: !!context.formData.companyData,
    hasPartnersData: !!context.formData.partnersData,
  };
};
