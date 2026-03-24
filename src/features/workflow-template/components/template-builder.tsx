'use client';

import React, { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Separator, TooltipProvider } from '@shadcn/index';
import { ArrowLeft, CheckCircle, Archive, Layers } from 'lucide-react';
import { useWorkflowTemplateById } from '../hooks/queries/use-workflow-template-queries';
import {
  useActivateTemplate,
  useArchiveTemplate,
} from '../hooks/mutations/use-template-mutations';
import {
  useAddStep,
  useUpdateStep,
  useRemoveStep,
} from '../hooks/mutations/use-step-mutations';
import {
  useAddTask,
  useUpdateTask,
  useRemoveTask,
} from '../hooks/mutations/use-task-mutations';
import {
  useAddStepField,
  useUpdateStepField,
  useRemoveStepField,
  useAddTaskField,
  useUpdateTaskField,
  useRemoveTaskField,
} from '../hooks/mutations/use-field-mutations';
import { TemplateStatusBadge } from './ui/status-badge';
import { StepEditorDialog } from './ui/step-editor-dialog';
import { StepCard } from './ui/step-card';
import type {
  CreateStepDTO,
  CreateTaskDTO,
  CreateFieldDTO,
} from '../server/types/template.types';

interface TemplateBuilderProps {
  templateId: string;
}

export function TemplateBuilder({ templateId }: TemplateBuilderProps) {
  const router = useRouter();
  const { data: template, isLoading } = useWorkflowTemplateById(templateId);

  // Template mutations
  const activateTemplate = useActivateTemplate();
  const archiveTemplate = useArchiveTemplate();

  // Step mutations
  const addStep = useAddStep();
  const updateStep = useUpdateStep();
  const removeStep = useRemoveStep();

  // Task mutations
  const addTask = useAddTask();
  const updateTask = useUpdateTask();
  const removeTask = useRemoveTask();

  // Field mutations
  const addStepField = useAddStepField();
  const updateStepField = useUpdateStepField();
  const removeStepField = useRemoveStepField();
  const addTaskField = useAddTaskField();
  const updateTaskField = useUpdateTaskField();
  const removeTaskField = useRemoveTaskField();

  const sortedSteps = useMemo(() => {
    if (!template?.steps) return [];
    return [...template.steps].sort((a, b) => a.order - b.order);
  }, [template?.steps]);

  // Step handlers
  const handleAddStep = useCallback(
    (data: CreateStepDTO) => {
      addStep.mutate({ templateId, data });
    },
    [addStep, templateId],
  );

  const handleUpdateStep = useCallback(
    (stepId: string, data: CreateStepDTO) => {
      updateStep.mutate({ templateId, stepId, data });
    },
    [updateStep, templateId],
  );

  const handleRemoveStep = useCallback(
    (stepId: string) => {
      removeStep.mutate({ templateId, stepId });
    },
    [removeStep, templateId],
  );

  // Task handlers
  const handleAddTask = useCallback(
    (stepId: string, data: CreateTaskDTO) => {
      addTask.mutate({ templateId, stepId, data });
    },
    [addTask, templateId],
  );

  const handleUpdateTask = useCallback(
    (stepId: string, taskId: string, data: CreateTaskDTO) => {
      updateTask.mutate({ templateId, stepId, taskId, data });
    },
    [updateTask, templateId],
  );

  const handleRemoveTask = useCallback(
    (stepId: string, taskId: string) => {
      removeTask.mutate({ templateId, stepId, taskId });
    },
    [removeTask, templateId],
  );

  // Step Field handlers
  const handleAddStepField = useCallback(
    (stepId: string, data: CreateFieldDTO) => {
      addStepField.mutate({ templateId, stepId, data });
    },
    [addStepField, templateId],
  );

  const handleUpdateStepField = useCallback(
    (stepId: string, fieldId: string, data: CreateFieldDTO) => {
      updateStepField.mutate({ templateId, stepId, fieldId, data });
    },
    [updateStepField, templateId],
  );

  const handleRemoveStepField = useCallback(
    (stepId: string, fieldId: string) => {
      removeStepField.mutate({ templateId, stepId, fieldId });
    },
    [removeStepField, templateId],
  );

  // Task Field handlers
  const handleAddTaskField = useCallback(
    (stepId: string, taskId: string, data: CreateFieldDTO) => {
      addTaskField.mutate({ templateId, stepId, taskId, data });
    },
    [addTaskField, templateId],
  );

  const handleUpdateTaskField = useCallback(
    (stepId: string, taskId: string, fieldId: string, data: CreateFieldDTO) => {
      updateTaskField.mutate({ templateId, stepId, taskId, fieldId, data });
    },
    [updateTaskField, templateId],
  );

  const handleRemoveTaskField = useCallback(
    (stepId: string, taskId: string, fieldId: string) => {
      removeTaskField.mutate({ templateId, stepId, taskId, fieldId });
    },
    [removeTaskField, templateId],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">
            Carregando template...
          </p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Template não encontrado.
          </p>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/gerenciamento/templates')}
          >
            Voltar à lista
          </Button>
        </div>
      </div>
    );
  }

  const totalTasks = template.steps.reduce(
    (acc, step) => acc + step.tasks.length,
    0,
  );
  const totalFields = template.steps.reduce(
    (acc, step) =>
      acc +
      step.fields.length +
      step.tasks.reduce((taskAcc, task) => taskAcc + task.fields.length, 0),
    0,
  );

  return (
    <TooltipProvider>
      <div className="h-full w-full flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 border-b bg-background/95 backdrop-blur">
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  router.push('/dashboard/gerenciamento/templates')
                }
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar
              </Button>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold truncate">
                    {template.name}
                  </h1>
                  <TemplateStatusBadge status={template.status} />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {template.description}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>Versão {template.version}</span>
                  <span>•</span>
                  <span>{template.steps.length} etapas</span>
                  <span>•</span>
                  <span>{totalTasks} tarefas</span>
                  <span>•</span>
                  <span>{totalFields} campos</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {template.status === 'Draft' && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => activateTemplate.mutate(templateId)}
                    disabled={activateTemplate.isPending}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Ativar
                  </Button>
                )}
                {template.status === 'Active' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => archiveTemplate.mutate(templateId)}
                    disabled={archiveTemplate.isPending}
                  >
                    <Archive className="h-4 w-4 mr-1" />
                    Arquivar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
            {sortedSteps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Layers className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-1">
                  Nenhuma etapa criada
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Comece adicionando a primeira etapa do seu workflow.
                </p>
                <StepEditorDialog
                  defaultOrder={1}
                  onSubmit={handleAddStep}
                  isLoading={addStep.isPending}
                />
              </div>
            ) : (
              <>
                {sortedSteps.map((step) => (
                  <StepCard
                    key={step.id}
                    step={step}
                    templateId={templateId}
                    onUpdateStep={(data) => handleUpdateStep(step.id, data)}
                    onRemoveStep={() => handleRemoveStep(step.id)}
                    onAddTask={(data) => handleAddTask(step.id, data)}
                    onUpdateTask={(taskId, data) =>
                      handleUpdateTask(step.id, taskId, data)
                    }
                    onRemoveTask={(taskId) => handleRemoveTask(step.id, taskId)}
                    onAddStepField={(data) => handleAddStepField(step.id, data)}
                    onUpdateStepField={(fieldId, data) =>
                      handleUpdateStepField(step.id, fieldId, data)
                    }
                    onRemoveStepField={(fieldId) =>
                      handleRemoveStepField(step.id, fieldId)
                    }
                    onAddTaskField={(taskId, data) =>
                      handleAddTaskField(step.id, taskId, data)
                    }
                    onUpdateTaskField={(taskId, fieldId, data) =>
                      handleUpdateTaskField(step.id, taskId, fieldId, data)
                    }
                    onRemoveTaskField={(taskId, fieldId) =>
                      handleRemoveTaskField(step.id, taskId, fieldId)
                    }
                  />
                ))}

                <Separator />

                <div className="flex justify-center">
                  <StepEditorDialog
                    defaultOrder={sortedSteps.length + 1}
                    onSubmit={handleAddStep}
                    isLoading={addStep.isPending}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
