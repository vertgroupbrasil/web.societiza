'use client';
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { CompanyData } from '@form/index';
import { getCep } from '../queries/useFormQueries';

interface UseCepLookupProps {
  form: UseFormReturn<CompanyData>;
  onAddressUpdate?: (() => void) | undefined; // ✅ Adicionar explicitamente undefined
}

export const useCepLookup = ({ form, onAddressUpdate }: UseCepLookupProps) => {
  const [cepValue, setCepValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const cepQuery = getCep(cepValue);
  const watchedCep = form.watch('endereco.cep');

  useEffect(() => {
    const cleanCep = watchedCep?.replace(/\D/g, '') || '';

    if (cleanCep.length === 8 && cleanCep !== cepValue) {
      setCepValue(cleanCep);
      setIsSearching(true);
    }
  }, [watchedCep, cepValue]);

  useEffect(() => {
    if (cepQuery.data && !cepQuery.isLoading && !cepQuery.isError) {
      const addressData = cepQuery.data;

      if (addressData.logradouro) {
        form.setValue('endereco.rua', addressData.logradouro, {
          shouldTouch: true,
        });
      }
      if (addressData.bairro) {
        form.setValue('endereco.bairro', addressData.bairro, {
          shouldTouch: true,
        });
      }
      if (addressData.localidade) {
        form.setValue('endereco.municipio', addressData.localidade, {
          shouldTouch: true,
        });
      }
      if (addressData.uf) {
        form.setValue('endereco.uf', addressData.uf, { shouldTouch: true });
      }

      setIsSearching(false);
      onAddressUpdate?.(); // ✅ Safe optional chaining
    }

    if (cepQuery.isError) {
      setIsSearching(false);
    }
  }, [
    cepQuery.data,
    cepQuery.isLoading,
    cepQuery.isError,
    form,
    onAddressUpdate,
  ]);

  return {
    isSearching: isSearching && cepQuery.isLoading,
    isError: cepQuery.isError,
    errorMessage: cepQuery.error?.message,
    isCepValid: cepValue.length === 8,
  };
};