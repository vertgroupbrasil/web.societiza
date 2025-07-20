'use client';

import { useForm, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  updateProcessSchemaDTO,
  Process,
  useCorporateMutations,
  useCorporateListStages,
  UpdateProcessDTO,
} from '@corporate/index';

interface UseEditProcessFormProps {
  process?: Process;
  onSuccess?: (() => void) | undefined;
}

export function useEditProcessForm(props: UseEditProcessFormProps = {}) {
  const { process, onSuccess } = props;

  const { updateProcess } = useCorporateMutations();
  const { data: allStages } = useCorporateListStages();

  const [globalError, setGlobalError] = useState<string | undefined>();
  const [saveLoading, setSaveLoading] = useState(false);
  const [tipoTributacao, setTipoTributacao] = useState<string>('');

  const form = useForm<UpdateProcessDTO>({
    resolver: zodResolver(updateProcessSchemaDTO),
    defaultValues: {
      processo_id: process?.id || '',
      tipo_processo_id: process?.tipo_processo?.id || '', // ✅ Garantir que sempre tenha o valor
      etapa_id: process?.etapa?.id || '',
      observacao: process?.observacao || '',
      tarefas:
        process?.tarefas?.map((task) => {
          const taskData: any = {
            id: task.id,
            concluida: task.concluida ? 'True' : 'False',
            nao_aplicavel: task.nao_aplicavel ? 'True' : 'False',
            tipo_tributacao: task.tipo_tributacao || 'simples',
          };

          if (task.expire_at) {
            if (task.expire_at instanceof Date) {
              taskData.expire_at = task.expire_at.toISOString().split('T')[0];
            } else if (typeof task.expire_at === 'string') {
              taskData.expire_at = task.expire_at;
            }
          }

          return taskData;
        }) || [],
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const { setValue, getValues, reset } = form;

  const normalizeDateToString = useCallback(
    (date: Date | string | null | undefined): string | null => {
      if (!date) return null;

      if (date instanceof Date) {
        if (isNaN(date.getTime())) return null;
        return date.toISOString().split('T')[0];
      }

      if (typeof date === 'string') {
        const trimmed = date.trim();
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        return dateRegex.test(trimmed) ? trimmed : null;
      }

      return null;
    },
    [],
  );

  const toUpdateProcessDTO = useCallback(
    (data: FieldValues): UpdateProcessDTO => {
      return data as UpdateProcessDTO;
    },
    [],
  );

  const validateUpdateProcessDTO = useCallback(
    (data: FieldValues): data is UpdateProcessDTO => {
      try {
        updateProcessSchemaDTO.parse(data);
        return true;
      } catch {
        return false;
      }
    },
    [],
  );

  useEffect(() => {
    const tipoTributacaoFromTasks = process?.tarefas?.find(
      (tarefa) => tarefa.tipo_tributacao,
    )?.tipo_tributacao;

    if (tipoTributacaoFromTasks) {
      setTipoTributacao(tipoTributacaoFromTasks);
    }
  }, [process]);

  useEffect(() => {
    if (process) {
      const initialTasks =
        process.tarefas?.map((task) => {
          const taskData: any = {
            id: task.id,
            concluida: task.concluida ? 'True' : 'False',
            nao_aplicavel: task.nao_aplicavel ? 'True' : 'False',
            tipo_tributacao: task.tipo_tributacao ?? 'simples',
          };

          if (task.expire_at) {
            if (task.expire_at instanceof Date) {
              taskData.expire_at = task.expire_at.toISOString().split('T')[0];
            } else if (typeof task.expire_at === 'string') {
              taskData.expire_at = task.expire_at;
            }
          }

          return taskData;
        }) || [];

      reset({
        processo_id: process.id,
        tipo_processo_id: process.tipo_processo?.id || '', // ✅ Incluir tipo_processo_id no reset
        etapa_id: process.etapa?.id || '',
        observacao: process.observacao || '',
        tarefas: initialTasks,
      });
    }
  }, [process, reset]);

  const determineCurrentStage = useCallback(
    (tarefas: any, currentStageId: string): string => {
      if (!tarefas || !process?.tarefas || !allStages?.etapas) {
        return currentStageId;
      }
      const globalStages = [...allStages.etapas].sort(
        (a, b) => a.ordem - b.ordem,
      );
      const currentIndex = globalStages.findIndex(
        (stage) => stage.id === currentStageId,
      );
      if (currentIndex === -1) {
        return currentStageId;
      }
      const currentStageTasks = process.tarefas.filter(
        (t) => t.etapa.id === currentStageId,
      );

      const completedTasks = currentStageTasks.filter((task) => {
        const formTask = tarefas.find((ft: any) => ft.id === task.id);
        return (
          formTask &&
          (formTask.concluida === 'True' || formTask.nao_aplicavel === 'True')
        );
      });
      const currentStageComplete =
        completedTasks.length === currentStageTasks.length;
      if (!currentStageComplete) {
        currentStageTasks.filter((task) => {
          const formTask = tarefas.find((ft: any) => ft.id === task.id);
          return !(
            formTask &&
            (formTask.concluida === 'True' || formTask.nao_aplicavel === 'True')
          );
        });
      }

      if (currentStageComplete) {
        const nextIndex = currentIndex + 1;
        if (nextIndex < globalStages.length) {
          const nextStage = globalStages[nextIndex];
          return nextStage.id;
        } else {
          return currentStageId;
        }
      }

      for (let i = 0; i < currentIndex; i++) {
        const stage = globalStages[i];
        const stageTasks = process.tarefas.filter(
          (t) => t.etapa.id === stage.id,
        );

        const stageCompletedTasks = stageTasks.filter((task) => {
          const formTask = tarefas.find((ft: any) => ft.id === task.id);
          return (
            formTask &&
            (formTask.concluida === 'True' || formTask.nao_aplicavel === 'True')
          );
        });

        const stageComplete = stageCompletedTasks.length === stageTasks.length;
        if (!stageComplete) {
          return stage.id;
        }
      }
      return currentStageId;
    },
    [process, allStages],
  );

  const updateTask = useCallback(
    (
      taskId: string,
      updates: Partial<{
        concluida: boolean;
        nao_aplicavel: boolean;
        expire_at: string;
        tipo_tributacao: string;
      }>,
    ) => {
      const currentTasks = getValues('tarefas') || [];

      const updatedTasks = currentTasks.map((task: any) => {
        if (task.id === taskId) {
          const updatedTask = { ...task };

          if (updates.concluida !== undefined) {
            updatedTask.concluida = updates.concluida ? 'True' : 'False';
          }
          if (updates.nao_aplicavel !== undefined) {
            updatedTask.nao_aplicavel = updates.nao_aplicavel
              ? 'True'
              : 'False';
          }
          if (updates.expire_at !== undefined) {
            if (updates.expire_at && updates.expire_at.trim() !== '') {
              updatedTask.expire_at = updates.expire_at;
            } else {
              delete updatedTask.expire_at;
            }
          }
          if (updates.tipo_tributacao !== undefined) {
            updatedTask.tipo_tributacao = updates.tipo_tributacao;
          }

          return updatedTask;
        }
        return task;
      });

      setValue('tarefas', updatedTasks, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue, getValues],
  );

  const updateTipoTributacao = useCallback(
    (tipo: string) => {
      setTipoTributacao(tipo);

      const currentTasks = getValues('tarefas') || [];
      const updatedTasks = currentTasks.map((task: any) => ({
        ...task,
        tipo_tributacao: tipo,
      }));

      setValue('tarefas', updatedTasks, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [getValues, setValue],
  );

  const updateTaskTipoTributacao = useCallback(
    (taskId: string, tipo: string) => {
      const currentTasks = getValues('tarefas') || [];
      const updatedTasks = currentTasks.map((task: any) => {
        if (task.id === taskId) {
          return { ...task, tipo_tributacao: tipo };
        }
        return task;
      });

      setValue('tarefas', updatedTasks, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [getValues, setValue],
  );

  const onSubmit = form.handleSubmit(async (formData) => {
    if (!validateUpdateProcessDTO(formData)) {
      updateProcessSchemaDTO.parse(formData);
      toast.error('Dados do formulário inválidos');
      return;
    }

    const typedFormData = toUpdateProcessDTO(formData);

    if (!process?.id) {
      toast.error('Processo não encontrado');
      return;
    }

    setGlobalError(undefined);
    setSaveLoading(true);

    try {
      const finalEtapaId = determineCurrentStage(
        typedFormData.tarefas,
        typedFormData.etapa_id,
      );

      const cleanTasks =
        typedFormData.tarefas
          ?.map((task) => {
            const originalTask = process?.tarefas?.find(
              (t) => t.id === task.id,
            );
            if (!originalTask) return null;

            const cleanTask: any = {
              id: task.id,
              concluida: task.concluida || 'False',
              tipo_tributacao: task.tipo_tributacao || 'simples',
            };

            const originalConcluida = originalTask.concluida ? 'True' : 'False';
            const originalNaoAplicavel = originalTask.nao_aplicavel
              ? 'True'
              : 'False';
            const originalExpireAt = originalTask.expire_at || '';

            let hasChanges = false;

            const normalizedDate = normalizeDateToString(task.expire_at);
            const hasValidExpireAt =
              normalizedDate && normalizedDate.trim() !== '';
            const isNaoAplicavel = task.nao_aplicavel === 'True';

            // Lógica de determinação do estado
            if (isNaoAplicavel) {
              cleanTask.nao_aplicavel = 'True';
              cleanTask.concluida = 'False';
              hasChanges = true;
            } else if (hasValidExpireAt) {
              cleanTask.expire_at = normalizedDate;
              cleanTask.concluida = 'True';
              cleanTask.nao_aplicavel = 'False';
              hasChanges = true;
            } else {
              cleanTask.concluida = task.concluida;

              if (task.concluida !== originalConcluida) {
                hasChanges = true;
              }

              if (task.nao_aplicavel !== originalNaoAplicavel) {
                cleanTask.nao_aplicavel = task.nao_aplicavel;
                hasChanges = true;
              }
            }

            // Verificações de mudanças
            const changesDetected = [
              task.tipo_tributacao && task.tipo_tributacao !== '',
              task.tipo_tributacao !==
                (originalTask.tipo_tributacao || 'simples'),
              originalExpireAt && !normalizedDate,
            ].some(Boolean);

            if (changesDetected) {
              hasChanges = true;
            }

            return hasChanges ? cleanTask : null;
          })
          ?.filter((task) => task !== null) || [];

      // ✅ Garantir que tipo_processo_id seja sempre incluído no payload
      const updateData = {
        processo_id: typedFormData.processo_id,
        // tipo_processo_id:
        //   process.tipo_processo?.id || typedFormData.tipo_processo_id, // ✅ Usar o valor atual do processo
        etapa_id: finalEtapaId,
        ...(typedFormData.observacao !== undefined && {
          observacao: typedFormData.observacao,
        }),
        ...(cleanTasks.length > 0 && {
          tarefas: cleanTasks,
        }),
      };

      await updateProcess.mutateAsync(updateData);

      const originalEtapaId = process?.etapa?.id;
      if (finalEtapaId !== originalEtapaId) {
        toast.success('Processo avançou de etapa!');
      } else {
        toast.success('Alterações salvas com sucesso!');
      }

      form.reset(formData);
      onSuccess?.();
    } catch (error) {
      setGlobalError('Erro ao salvar alterações. Tente novamente.');
      toast.error('Erro ao salvar alterações');
    } finally {
      setSaveLoading(false);
    }
  });

  return {
    form,
    onSubmit,
    updateTask,
    updateTipoTributacao,
    updateTaskTipoTributacao,
    tipoTributacao,
    globalError,
    isSubmitting:
      form.formState.isSubmitting || saveLoading || updateProcess.isPending,
    isDirty: form.formState.isDirty,
  };
}
