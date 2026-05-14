'use client';

import { Button, Form } from '@shadcn/index';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  _companyData,
  CompanyData,
  useOpeningForm,
  defaultCompanyData,
  BasicDataSection,
  AddressSection,
  AdditionalInfoSection,
  useCompanyFormValidation,
} from '@form/index';
import { useDebouncedAutoSave } from '@form/hooks/utils';

export const CompanyDataForm = () => {
  const {
    formData,
    updateStepData,
    saveCompanyData,
    isSubmittingCompany,
    goToPreviousStep,
    isFirstStep,
    processoId,
  } = useOpeningForm();

  const form = useForm<CompanyData>({
    resolver: zodResolver(_companyData),
    defaultValues: formData.companyData ?? {
      ...defaultCompanyData,
      processo_id: processoId,
    },
    mode: 'onChange',
  });

  const {
    setShowFieldErrors,
    setValidationAttempts,
    hasFieldError,
    hasArrayFieldError,
    validateForm,
    checkRequiredFields,
  } = useCompanyFormValidation({ form });

  const watchResponsabilidadeTecnica = form.watch(
    'info_adicionais.resp_tecnica',
  );
  const watchCapitalIntegralizado = form.watch('capital_integralizado');

  const handleNext = async () => {
    setValidationAttempts((prev) => prev + 1);

    try {
      const currentValues = form.getValues();

      // ✅ Preparar info_adicionais conforme regra de negócio
      const preparedInfoAdicionais = currentValues.info_adicionais?.resp_tecnica
        ? {
            resp_tecnica: true,
            nome_responsavel: currentValues.info_adicionais.nome_responsavel,
            nmr_carteira_profissional:
              currentValues.info_adicionais.nmr_carteira_profissional,
            uf: currentValues.info_adicionais.uf,
            area_resp: currentValues.info_adicionais.area_resp,
          }
        : { resp_tecnica: false };

      const preparedValues = {
        ...currentValues,
        info_adicionais: preparedInfoAdicionais,
      };

      updateStepData({ companyData: preparedValues });

      // ✅ Validação condicional da data de integralização
      if (
        !preparedValues.capital_integralizado &&
        !preparedValues.data_integralizacao
      ) {
        setShowFieldErrors(true);
        form.setError('data_integralizacao', {
          message:
            'Data de integralização é obrigatória quando o capital não está totalmente integralizado',
        });
        toast.error('Data de integralização é obrigatória');
        return;
      }

      // ✅ ADICIONAR: Validação condicional da responsabilidade técnica
      if (preparedValues.info_adicionais?.resp_tecnica) {
        const respTecnicaErrors = [];

        if (!preparedValues.info_adicionais.nome_responsavel) {
          respTecnicaErrors.push('Nome do responsável');
          form.setError('info_adicionais.nome_responsavel', {
            message:
              'Nome do responsável é obrigatório quando há responsabilidade técnica',
          });
        }

        if (!preparedValues.info_adicionais.nmr_carteira_profissional) {
          respTecnicaErrors.push('Número da carteira');
          form.setError('info_adicionais.nmr_carteira_profissional', {
            message:
              'Número da carteira é obrigatório quando há responsabilidade técnica',
          });
        }

        if (!preparedValues.info_adicionais.uf) {
          respTecnicaErrors.push('UF da carteira');
          form.setError('info_adicionais.uf', {
            message: 'UF é obrigatória quando há responsabilidade técnica',
          });
        }

        if (!preparedValues.info_adicionais.area_resp) {
          respTecnicaErrors.push('Área de responsabilidade');
          form.setError('info_adicionais.area_resp', {
            message:
              'Área de responsabilidade é obrigatória quando há responsabilidade técnica',
          });
        }

        if (respTecnicaErrors.length > 0) {
          setShowFieldErrors(true);
          toast.error(
            `Campos de responsabilidade técnica obrigatórios: ${respTecnicaErrors.join(', ')}`,
          );
          return;
        }
      }

      // ✅ Verificar campos obrigatórios básicos
      const missingFields = checkRequiredFields();
      if (missingFields.length > 0) {
        setShowFieldErrors(true);
        toast.error(`Campos obrigatórios: ${missingFields.join(', ')}`);
        return;
      }

      // ✅ Validação geral do formulário
      const validation = await validateForm();
      if (!validation.isValid) {
        setShowFieldErrors(true);
        const errorMessages = validation.errors.map(
          (e) => `${e.field}: ${e.message}`,
        );
        toast.error(`Erros encontrados:\n${errorMessages.join('\n')}`);
        return;
      }

      // ✅ Sucesso - limpar erros e salvar
      setShowFieldErrors(false);
      toast.success('Dados validados com sucesso!');
      await saveCompanyData(preparedValues);
    } catch (error) {
      console.error('Erro na validação:', error);
      toast.error('Erro inesperado. Tente novamente.');
    }
  };

  // Auto-save while typing: debounced propagation to context so FormProvider can persist
  useDebouncedAutoSave({
    form,
    saveFunction: (data: CompanyData) => {
      // prepare same way as on submit to keep persistence consistent
      const preparedInfoAdicionais = data.info_adicionais?.resp_tecnica
        ? {
            resp_tecnica: true,
            nome_responsavel: data.info_adicionais.nome_responsavel,
            nmr_carteira_profissional:
              data.info_adicionais.nmr_carteira_profissional,
            uf: data.info_adicionais.uf,
            area_resp: data.info_adicionais.area_resp,
          }
        : { resp_tecnica: false };

      const preparedValues = {
        ...data,
        info_adicionais: preparedInfoAdicionais,
      };

      updateStepData({ companyData: preparedValues });
    },
    enabled: true,
  });

  return (
    <Form {...form}>
      <div className="space-y-8">
        <BasicDataSection
          form={form}
          hasFieldError={hasFieldError}
          hasArrayFieldError={hasArrayFieldError}
        />

        <AddressSection form={form} hasFieldError={hasFieldError} />

        <AdditionalInfoSection
          form={form}
          hasFieldError={hasFieldError}
          watchCapitalIntegralizado={watchCapitalIntegralizado}
          watchResponsabilidadeTecnica={watchResponsabilidadeTecnica}
        />

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={goToPreviousStep}
            disabled={isFirstStep}
          >
            Anterior
          </Button>

          <Button
            type="button"
            onClick={handleNext}
            disabled={isSubmittingCompany}
          >
            {isSubmittingCompany ? 'Salvando...' : 'Próximo'}
          </Button>
        </div>
      </div>
    </Form>
  );
};
