'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Button, Input } from '@shadcn/index';
import { Plus } from 'lucide-react';
import type {
  WorkflowTemplateDetail,
  WorkflowTemplateTask,
} from '../server/types/template.types';
import { useAddStep } from '../hooks/mutations';
import { TemplateColumn } from './ui/template-column';
import { TemplateTaskSheet } from './ui/template-task-sheet';

interface TemplateKanbanProps {
  template: WorkflowTemplateDetail;
  templateId: string;
}

interface SelectedTask {
  task: WorkflowTemplateTask;
  stepId: string;
}

export function TemplateKanban({ template, templateId }: TemplateKanbanProps) {
  const [selectedTask, setSelectedTask] = useState<SelectedTask | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [newStepTitle, setNewStepTitle] = useState('');

  const addStep = useAddStep();

  const sortedSteps = useMemo(
    () => [...template.steps].sort((a, b) => a.order - b.order),
    [template.steps],
  );

  const handleTaskEdit = useCallback(
    (task: WorkflowTemplateTask, stepId: string) => {
      setSelectedTask({ task, stepId });
      setSheetOpen(true);
    },
    [],
  );

  const handleSheetOpenChange = useCallback((open: boolean) => {
    setSheetOpen(open);
    if (!open) setSelectedTask(null);
  }, []);

  const handleAddStep = useCallback(() => {
    const trimmed = newStepTitle.trim();
    if (!trimmed) return;
    addStep.mutate({
      templateId,
      data: {
        title: trimmed,
        description: trimmed,
        order: template.steps.length + 1,
      },
    });
    setNewStepTitle('');
    setIsAddingStep(false);
  }, [newStepTitle, template.steps.length, templateId, addStep]);

  return (
    <>
      <div className="absolute inset-0 overflow-x-auto">
        <div className="flex gap-6 h-full w-max min-w-full p-4">
          {/* Colunas de steps */}
          {sortedSteps.map((step) => (
            <TemplateColumn
              key={step.id}
              step={step}
              templateId={templateId}
              onTaskEdit={handleTaskEdit}
            />
          ))}

          {/* Coluna para adicionar nova etapa */}
          <div className="flex-shrink-0 w-80 min-w-[320px]">
            <div className="bg-accent/10 rounded-lg border border-dashed border-border/60 h-auto p-4 flex flex-col items-center justify-start gap-3">
              {isAddingStep ? (
                <div className="w-full space-y-2">
                  <Input
                    autoFocus
                    value={newStepTitle}
                    onChange={(value) => setNewStepTitle(value)}
                    onBlur={() => {
                      if (newStepTitle.trim()) handleAddStep();
                      else setIsAddingStep(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddStep();
                      if (e.key === 'Escape') {
                        setNewStepTitle('');
                        setIsAddingStep(false);
                      }
                    }}
                    placeholder="Nome da etapa..."
                    className="h-9 text-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={handleAddStep}
                      disabled={addStep.isPending || !newStepTitle.trim()}
                      loading={addStep.isPending}
                    >
                      Criar etapa
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setNewStepTitle('');
                        setIsAddingStep(false);
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground hover:text-foreground"
                  onClick={() => setIsAddingStep(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nova etapa
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sheet de edição de task — fora do loop de colunas */}
      <TemplateTaskSheet
        task={selectedTask?.task ?? null}
        stepId={selectedTask?.stepId ?? ''}
        templateId={templateId}
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
      />
    </>
  );
}
