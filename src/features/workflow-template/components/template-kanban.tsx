'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button } from '@shadcn/index';
import { Layers, Plus } from 'lucide-react';
import type { WorkflowTemplateDetail } from '../server/types/template.types';
import { useAddStep, useReorderSteps } from '../hooks/mutations';
import { getNextIndexedLabel } from '../lib/entity-labels';
import { TemplateColumn } from './ui/template-column';
import { TemplateProcessSheet } from './ui/template-process-sheet';

interface TemplateKanbanProps {
  template: WorkflowTemplateDetail;
  templateId: string;
  readOnly?: boolean;
}

export function TemplateKanban({
  template,
  templateId,
  readOnly = false,
}: TemplateKanbanProps) {
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pendingOpenStepId, setPendingOpenStepId] = useState<string | null>(
    null,
  );
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [overStepId, setOverStepId] = useState<string | null>(null);

  const addStep = useAddStep();
  const reorderSteps = useReorderSteps();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const sortedSteps = useMemo(
    () => [...template.steps].sort((left, right) => left.order - right.order),
    [template.steps],
  );

  const selectedStep =
    sortedSteps.find((step) => step.id === selectedStepId) ?? null;
  const activeStep =
    sortedSteps.find((step) => step.id === activeStepId) ?? null;

  useEffect(() => {
    if (!pendingOpenStepId) return;

    const createdStep = sortedSteps.find((step) => step.id === pendingOpenStepId);

    if (!createdStep) return;

    setSelectedStepId(createdStep.id);
    setSheetOpen(true);
    setPendingOpenStepId(null);
  }, [pendingOpenStepId, sortedSteps]);

  const handleAddStep = async () => {
    const nextOrder = sortedSteps.length + 1;
    const nextTitle = getNextIndexedLabel(
      sortedSteps.map((step) => step.title),
      'Etapa',
    );
    const clientId = `temp-step-${crypto.randomUUID()}`;

    setSelectedStepId(clientId);
    setSheetOpen(true);

    const result = await addStep.mutateAsync({
      templateId,
      clientId,
      data: {
        title: nextTitle,
        description:
          'Defina aqui o processo, os campos e as tarefas desta etapa.',
        order: nextOrder,
      },
    });

    setSelectedStepId(result.id);
    setPendingOpenStepId(result.id);
  };

  const handleColumnDragStart = (event: DragStartEvent) => {
    setActiveStepId(String(event.active.id));
  };

  const handleColumnDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveStepId(null);
    setOverStepId(null);

    if (!over || active.id === over.id) return;

    const currentIndex = sortedSteps.findIndex((step) => step.id === active.id);
    const nextIndex = sortedSteps.findIndex((step) => step.id === over.id);

    if (currentIndex === -1 || nextIndex === -1) return;

    const reordered = arrayMove(sortedSteps, currentIndex, nextIndex).map(
      (step, index) => ({
        ...step,
        order: index + 1,
      }),
    );

    reorderSteps.mutate({
      templateId,
      steps: reordered,
    });
  };

  return (
    <>
      <div className="absolute inset-0 overflow-x-auto">
        {sortedSteps.length === 0 ? (
          <div className="flex h-full items-center justify-center px-6">
            <div className="max-w-md rounded-[32px] border border-dashed border-border/70 bg-accent/20 px-8 py-10 text-center shadow-sm">
              <Layers className="mx-auto h-10 w-10 text-muted-foreground/60" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Comece pela primeira etapa
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Cada etapa já nasce com um processo-modelo. Você clica nele e
                monta os campos e as tarefas do jeito que a equipe realmente
                trabalha.
              </p>
              {!readOnly && (
                <Button
                  className="mt-6"
                  onClick={handleAddStep}
                  disabled={addStep.isPending}
                  loading={addStep.isPending}
                >
                  <Plus className="h-4 w-4" />
                  Criar primeira etapa
                </Button>
              )}
            </div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleColumnDragStart}
            onDragOver={(event) => {
              setOverStepId(event.over ? String(event.over.id) : null);
            }}
            onDragEnd={handleColumnDragEnd}
            onDragCancel={() => {
              setActiveStepId(null);
              setOverStepId(null);
            }}
          >
            <SortableContext
              items={sortedSteps.map((step) => step.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex h-full min-w-full items-stretch gap-5 p-4">
                {sortedSteps.map((step) => (
                  <TemplateColumn
                    key={step.id}
                    step={step}
                    templateId={templateId}
                    readOnly={readOnly}
                    isOver={overStepId === step.id}
                    onOpenProcess={(stepId) => {
                      setSelectedStepId(stepId);
                      setSheetOpen(true);
                    }}
                  />
                ))}

                {!readOnly && (
                  <div className="flex w-72 min-w-[18rem] flex-shrink-0 items-stretch">
                    <button
                      type="button"
                      onClick={handleAddStep}
                      className="group flex h-full min-h-[15rem] w-full flex-col items-start justify-between rounded-[28px] border border-dashed border-border/70 bg-accent/10 p-5 text-left transition-colors hover:border-primary/40 hover:bg-accent/20"
                    >
                      <div className="space-y-2">
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border/70 bg-background text-muted-foreground transition-colors group-hover:text-foreground">
                          <Plus className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-foreground">
                            Nova etapa
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            A nova coluna já entra pronta para edição.
                          </p>
                        </div>
                      </div>

                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Reordenável
                      </p>
                    </button>
                  </div>
                )}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeStep ? (
                <TemplateColumn
                  step={activeStep}
                  templateId={templateId}
                  readOnly
                  onOpenProcess={() => {}}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      <TemplateProcessSheet
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) setSelectedStepId(null);
        }}
        step={selectedStep}
        steps={sortedSteps}
        templateId={templateId}
        readOnly={readOnly}
      />
    </>
  );
}
