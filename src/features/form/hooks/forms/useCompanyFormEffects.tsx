'use client';
import { useEffect, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CompanyData } from '@form/index';

interface UseCompanyFormEffectsProps {
  form: UseFormReturn<CompanyData>;
  formData: any;
  updateStepData: (data: any) => void;
  isDataLoaded: boolean;
}

export const useCompanyFormEffects = ({
  form,
  formData,
  updateStepData,
  isDataLoaded,
}: UseCompanyFormEffectsProps) => {
  const [hasInitialized, setHasInitialized] = useState(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const watchCapitalIntegralizado = form.watch('capital_integralizado');
  const watchResponsabilidadeTecnica = form.watch(
    'info_adicionais.resp_tecnica',
  );

  useEffect(() => {
    if (!isDataLoaded || hasInitialized) return;

    if (formData.companyData && Object.keys(formData.companyData).length > 2) {
      form.reset(formData.companyData);
      setHasInitialized(true);
    }
  }, [isDataLoaded, formData.companyData, hasInitialized, form]);

  useEffect(() => {
    if (!hasInitialized) return;

    const subscription = form.watch((value) => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      autoSaveTimeoutRef.current = setTimeout(() => {
        updateStepData({ companyData: value as CompanyData });
      }, 1000);
    });

    return () => {
      subscription.unsubscribe();
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [form, updateStepData, hasInitialized]);

  useEffect(() => {
    if (watchCapitalIntegralizado) {
      form.setValue('data_integralizacao', undefined, {
        shouldValidate: false,
      });
      form.clearErrors('data_integralizacao');
    } else {
      form.trigger('data_integralizacao');
    }
  }, [watchCapitalIntegralizado, form]);

  useEffect(() => {
    if (!watchResponsabilidadeTecnica) {
      form.setValue('info_adicionais.nome_responsavel', undefined, {
        shouldValidate: false,
      });
      form.setValue('info_adicionais.nmr_carteira_profissional', undefined, {
        shouldValidate: false,
      });
      form.setValue('info_adicionais.uf', undefined, { shouldValidate: false });
      form.setValue('info_adicionais.area_resp', undefined, {
        shouldValidate: false,
      });

      form.clearErrors('info_adicionais.nome_responsavel');
      form.clearErrors('info_adicionais.nmr_carteira_profissional');
      form.clearErrors('info_adicionais.uf');
      form.clearErrors('info_adicionais.area_resp');
    } else {
      form.trigger([
        'info_adicionais.nome_responsavel',
        'info_adicionais.nmr_carteira_profissional',
        'info_adicionais.uf',
        'info_adicionais.area_resp',
      ]);
    }
  }, [watchResponsabilidadeTecnica, form]);

  return {
    hasInitialized,
    setHasInitialized,
  };
};