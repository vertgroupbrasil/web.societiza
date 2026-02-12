'use client';

import { useEffect, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PartnersData, Socio } from '@form/index';

interface UsePartnersFormEffectsProps {
  form: UseFormReturn<PartnersData>;
  formData: any;
  updateStepData: (data: any) => void;
  isDataLoaded: boolean;
}

export const usePartnersFormEffects = ({
  form,
  formData,
  updateStepData,
  isDataLoaded,
}: UsePartnersFormEffectsProps) => {
  const [hasInitialized, setHasInitialized] = useState(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (!isDataLoaded || hasInitialized) return;

    if (formData.partnersData && formData.partnersData.socios?.length > 0) {
      form.reset(formData.partnersData);
      setHasInitialized(true);
    } else {
      // Inicializa com pelo menos um sócio
      const initialData: PartnersData = {
        empresa_id: formData.companyData?.processo_id || '',
        socios: [createEmptyPartner()],
      };
      form.reset(initialData);
      setHasInitialized(true);
    }
  }, [isDataLoaded, formData, hasInitialized, form]);

  useEffect(() => {
    if (!hasInitialized) return;

    const subscription = form.watch((value) => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      autoSaveTimeoutRef.current = setTimeout(() => {
        updateStepData({ partnersData: value as PartnersData });
      }, 1000);
    });

    return () => {
      subscription.unsubscribe();
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [form, updateStepData, hasInitialized]);

  return {
    hasInitialized,
    setHasInitialized,
  };
};

const createEmptyPartner = (): Socio => ({
  nome: '',
  nacionalidade: '',
  data_nascimento: '',
  estado_civil: 'solteiro',
  profissao: '',
  cpf: '',
  rg: '',
  orgao_expedidor: '',
  uf: '',
  administrador: false,
  qtd_cotas: 0,
  endereco: {
    cep: '',
    rua: '',
    numero: 0,
    bairro: '',
    complemento: '',
    municipio: '',
    uf: '',
  },
});