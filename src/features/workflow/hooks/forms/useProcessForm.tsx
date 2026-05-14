'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { handleFormError } from '@societiza/handlers/error';
import { toast } from 'sonner';
import {
  emptyProcess,
  ProcessDTO,
  processSchemaDTO,
  ProcessTypes,
  Stages,
  useCorporateMutations,
  workflowProcessTypeEnum,
} from '@workflow/index';
import type { Accountancy } from '@accountancy/schemas/accountancy.schema';

interface UseProcessFormProps {
  accounties: Accountancy[];
  processTypes?: ProcessTypes;
  stages?: Stages;
  templateId?: string | undefined;
  onSuccess?: (() => void) | undefined;
}

// ✅ CORREÇÃO: Remover valor padrão pois accounties é obrigatório
export function useProcessForm(props: UseProcessFormProps) {
  const { processTypes = [], stages = [], templateId, onSuccess } = props;

  const processTypesArray = useMemo(
    () => (Array.isArray(processTypes) ? processTypes : (processTypes as any)?.tipo_processo || []),
    [processTypes],
  );

  const stagesArray = useMemo(
    () => (Array.isArray(stages) ? stages : (stages as any)?.etapas || []),
    [stages],
  );

  const [activeTab, setActiveTab] = useState<string>(() =>
    processTypesArray.length > 0 ? processTypesArray[0].id : '',
  );

  const form = useForm<ProcessDTO>({
    resolver: zodResolver(processSchemaDTO),
    defaultValues: {
      ...emptyProcess,
      tipo_processo_id:
        processTypesArray.length > 0 ? processTypesArray[0].id : '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const { createProcess } = useCorporateMutations();
  const [globalError, setGlobalError] = useState<string | undefined>();

  const { setValue, watch } = form;
  const [accountingId, processTypeId] = watch([
    'contabilidade_id',
    'tipo_processo_id',
  ]);

  // Função para computar etapa_id
  const computeEtapaId = useCallback((): string => {
    const defaultStage = stagesArray.find(
      (stage: any) => stage.nome.toLowerCase() === 'proposta/formulário',
    );

    return defaultStage?.id ?? '';
  }, [stagesArray]); // ✅ CORREÇÃO: Usar stagesArray ao invés de processTypesArray

  useEffect(() => {
    if (processTypesArray.length > 0 && !activeTab) {
      const firstType = processTypesArray[0].id;
      setActiveTab(firstType);
      setValue('tipo_processo_id', firstType, { shouldValidate: false });
    }
  }, [processTypesArray, activeTab, setValue]);

  useEffect(() => {
    const parsed = workflowProcessTypeEnum.safeParse(activeTab);
    if (parsed.success && activeTab !== processTypeId) {
      setValue('tipo_processo_id', parsed.data, { shouldValidate: true });
    }
  }, [activeTab, processTypeId, setValue]);

  useEffect(() => {
    if (processTypeId && stagesArray.length > 0) {
      const etapaComputada = computeEtapaId();
      setValue('etapa_id', etapaComputada, { shouldValidate: true });
    }
  }, [processTypeId, accountingId, setValue, computeEtapaId, stagesArray]);

  const onSubmit = form.handleSubmit(async (data) => {
    setGlobalError(undefined);

    try {
      // ✅ Verificar se dados essenciais estão presentes
      if (!data.nome?.trim()) {
        throw new Error('Nome da empresa é obrigatório');
      }

      if (!data.contabilidade_id) {
        throw new Error('Contabilidade é obrigatória');
      }

      if (!activeTab) {
        throw new Error('Tipo de processo deve ser selecionado');
      }

      const processType = workflowProcessTypeEnum.parse(activeTab);
      const processData = {
        nome: data.nome,
        contabilidade_id: data.contabilidade_id,
        tipo_processo_id: processType,
        template_id: templateId ?? '',
        etapa_id: computeEtapaId() || undefined,
      } satisfies ProcessDTO & { template_id: string };

      await Promise.race([
        createProcess.mutateAsync(processData as unknown as ProcessDTO),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 30000),
        ),
      ]);

      toast.success('Processo criado com sucesso!', {
        description: `${data.nome} foi adicionado ao sistema.`,
      });

      // Reset form
      form.reset();
      if (processTypesArray.length > 0) {
        setActiveTab(processTypesArray[0].id);
      }

      onSuccess?.();
    } catch (err) {
      const parsed = handleFormError<ProcessDTO>(
        err,
        form.setError,
        setGlobalError,
      );

      toast.error('Erro ao criar processo!', {
        description:
          parsed.globalError ?? 'Verifique os dados e tente novamente.',
      });
    }
  });

  return {
    form,
    onSubmit,
    formError: form.setError,
    globalError,
    isSubmitting: form.formState.isSubmitting || createProcess.isPending,
    activeTab,
    setActiveTab,
  };
}
