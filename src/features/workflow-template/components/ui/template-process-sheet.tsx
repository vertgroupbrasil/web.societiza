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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Button,
  Input,
  ScrollArea,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Textarea,
} from '@shadcn/index';
import { ChevronDown, Plus, Type } from 'lucide-react';
import {
  useAddStepField,
  useAddTask,
  useReorderStepFields,
  useReorderTasks,
  useRemoveStepField,
  useUpdateStep,
  useUpdateStepField,
} from '../../hooks/mutations';
import { getNextIndexedLabel } from '../../lib/entity-labels';
import { getNextFieldLabel } from '../../lib/field-labels';
import { getDuplicateStepTitleError } from '../../lib/template-validation';
import type { WorkflowTemplateStep } from '../../server/types/template.types';
import { TemplateFieldEditor } from './template-field-editor';
import { TemplateTaskEditor } from './template-task-editor';
import { toast } from 'sonner';

interface TemplateProcessSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  readOnly?: boolean;
  step: WorkflowTemplateStep | null;
  steps: WorkflowTemplateStep[];
  templateId: string;
}

export function TemplateProcessSheet({
  open,
  onOpenChange,
  readOnly = false,
  step,
  steps,
  templateId,
}: TemplateProcessSheetProps) {
  const [titleDraft, setTitleDraft] = useState('');
  const [descriptionDraft, setDescriptionDraft] = useState('');
  const [activeStepFieldId, setActiveStepFieldId] = useState<string | null>(null);
  const [overStepFieldId, setOverStepFieldId] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [overTaskId, setOverTaskId] = useState<string | null>(null);

  const updateStep = useUpdateStep();
  const addTask = useAddTask();
  const reorderStepFields = useReorderStepFields();
  const reorderTasks = useReorderTasks();
  const addStepField = useAddStepField();
  const updateStepField = useUpdateStepField();
  const removeStepField = useRemoveStepField();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  useEffect(() => {
    if (!step) return;

    setTitleDraft(step.title);
    setDescriptionDraft(step.description);
  }, [step]);

  const sortedTasks = useMemo(
    () => (step ? [...step.tasks].sort((left, right) => left.order - right.order) : []),
    [step],
  );
  const sortedStepFields = useMemo(
    () => (step ? [...step.fields].sort((left, right) => left.order - right.order) : []),
    [step],
  );
  const isCreatingWorkflowItem =
    addStepField.isPending || addTask.isPending;

  if (!step) return null;

  const handleSaveStep = async () => {
    const nextTitle = titleDraft.trim();
    const nextDescription =
      descriptionDraft.trim() ||
      nextTitle ||
      step.description;

    if (!nextTitle) {
      setTitleDraft(step.title);
      setDescriptionDraft(step.description);
      return;
    }

    const changed =
      nextTitle !== step.title || nextDescription !== step.description;

    const duplicateTitleError = getDuplicateStepTitleError(
      steps,
      nextTitle,
      step.id,
    );

    if (duplicateTitleError) {
      toast.error(duplicateTitleError);
      return;
    }

    if (!changed) {
      onOpenChange(false);
      return;
    }

    await updateStep.mutateAsync({
      templateId,
      stepId: step.id,
      data: {
        title: nextTitle,
        description: nextDescription,
        order: step.order,
      },
    });

    onOpenChange(false);
  };

  const handleAddTask = async () => {
    const nextTaskTitle = getNextIndexedLabel(
      sortedTasks.map((task) => task.title),
      'Tarefa',
    );

    await addTask.mutateAsync({
      templateId,
      stepId: step.id,
      clientId: `temp-task-${crypto.randomUUID()}`,
      data: {
        title: nextTaskTitle,
        description: 'Descreva rapidamente o que precisa ser feito nesta tarefa.',
        type: 'Manual',
        configuration: '',
        order: step.tasks.length + 1,
        isOptional: false,
      },
    });
  };

  const handleStepFieldDragStart = (event: DragStartEvent) => {
    setActiveStepFieldId(String(event.active.id));
  };

  const handleStepFieldDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveStepFieldId(null);
    setOverStepFieldId(null);

    if (!over || active.id === over.id) return;

    const currentIndex = sortedStepFields.findIndex(
      (field) => field.id === active.id,
    );
    const nextIndex = sortedStepFields.findIndex((field) => field.id === over.id);

    if (currentIndex === -1 || nextIndex === -1) return;

    const reordered = arrayMove(sortedStepFields, currentIndex, nextIndex).map(
      (field, index) => ({
        ...field,
        order: index + 1,
      }),
    );

    reorderStepFields.mutate({
      templateId,
      stepId: step.id,
      fields: reordered,
    });
  };

  const handleTaskDragStart = (event: DragStartEvent) => {
    setActiveTaskId(String(event.active.id));
  };

  const handleTaskDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTaskId(null);
    setOverTaskId(null);

    if (!over || active.id === over.id) return;

    const currentIndex = sortedTasks.findIndex((task) => task.id === active.id);
    const nextIndex = sortedTasks.findIndex((task) => task.id === over.id);

    if (currentIndex === -1 || nextIndex === -1) return;

    const reordered = arrayMove(sortedTasks, currentIndex, nextIndex).map(
      (task, index) => ({
        ...task,
        order: index + 1,
      }),
    );

    reorderTasks.mutate({
      templateId,
      stepId: step.id,
      tasks: reordered,
    });
  };

  const activeTask = sortedTasks.find((task) => task.id === activeTaskId) ?? null;
  const activeStepField =
    sortedStepFields.find((field) => field.id === activeStepFieldId) ?? null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <SheetHeader className="flex-shrink-0 border-b px-6 py-5">
          <div className="space-y-4">
            <div className="space-y-1">
              <SheetTitle className="text-left text-xl">
                Processo modelo da etapa
              </SheetTitle>
              <SheetDescription className="text-left">
                O que você configurar aqui define exatamente o que a equipe vai
                ver quando esta etapa estiver em uso.
              </SheetDescription>
            </div>

            <div className="space-y-3">
              <Input
                value={titleDraft}
                onChange={(value) => setTitleDraft(value)}
                disabled={readOnly}
                placeholder="Nome da etapa"
                className="h-11 text-base font-semibold"
              />
              <Textarea
                value={descriptionDraft}
                onChange={(event) => setDescriptionDraft(event.target.value)}
                disabled={readOnly}
                rows={3}
                placeholder="Explique rapidamente o propósito desta etapa."
                className="min-h-24"
              />
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-8 px-6 py-6">
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Campos da etapa
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Informações coletadas uma vez para toda a etapa.
                  </p>
                </div>

                {!readOnly && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isCreatingWorkflowItem}
                      onClick={() =>
                        addStepField.mutate({
                          templateId,
                          stepId: step.id,
                          clientId: `temp-step-field-${crypto.randomUUID()}`,
                          data: {
                            label: getNextFieldLabel(sortedStepFields, 'Text'),
                            fieldType: 'Text',
                            options: null,
                            order: sortedStepFields.length + 1,
                          },
                        })
                      }
                    >
                      <Type className="h-3.5 w-3.5" />
                      Texto
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isCreatingWorkflowItem}
                      onClick={() =>
                        addStepField.mutate({
                          templateId,
                          stepId: step.id,
                          clientId: `temp-step-field-${crypto.randomUUID()}`,
                          data: {
                            label: getNextFieldLabel(sortedStepFields, 'Select'),
                            fieldType: 'Select',
                            options: ['Opção 1'],
                            order: sortedStepFields.length + 1,
                          },
                        })
                      }
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                      Seleção
                    </Button>
                  </div>
                )}
              </div>

              {sortedStepFields.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-border/70 bg-muted/20 px-5 py-8 text-sm text-muted-foreground">
                  Nenhum campo foi definido para esta etapa ainda.
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleStepFieldDragStart}
                  onDragOver={(event) => {
                    setOverStepFieldId(event.over ? String(event.over.id) : null);
                  }}
                  onDragEnd={handleStepFieldDragEnd}
                  onDragCancel={() => {
                    setActiveStepFieldId(null);
                    setOverStepFieldId(null);
                  }}
                >
                  <SortableContext
                    items={sortedStepFields.map((field) => field.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {sortedStepFields.map((field) => (
                        <TemplateFieldEditor
                          key={field.id}
                          field={field}
                          disabled={readOnly}
                          sortable
                          isOver={overStepFieldId === field.id}
                          onRemove={() =>
                            removeStepField.mutate({
                              templateId,
                              stepId: step.id,
                              fieldId: field.id,
                            })
                          }
                          onUpdate={(data) =>
                            updateStepField.mutate({
                              templateId,
                              stepId: step.id,
                              fieldId: field.id,
                              data,
                            })
                          }
                        />
                      ))}
                    </div>
                  </SortableContext>

                  <DragOverlay>
                    {activeStepField ? (
                      <TemplateFieldEditor
                        field={activeStepField}
                        disabled
                        onRemove={() => {}}
                        onUpdate={() => {}}
                      />
                    ) : null}
                  </DragOverlay>
                </DndContext>
              )}
            </section>

            <Separator />

            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Tarefas da etapa
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Organize a ordem em que cada entrega precisa acontecer.
                  </p>
                </div>

                {!readOnly && (
                  <Button
                    onClick={handleAddTask}
                    disabled={isCreatingWorkflowItem}
                    loading={addTask.isPending}
                  >
                    <Plus className="h-4 w-4" />
                    Nova tarefa
                  </Button>
                )}
              </div>

              {sortedTasks.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-border/70 bg-muted/20 px-5 py-8 text-sm text-muted-foreground">
                  Nenhuma tarefa foi criada ainda. Comece pela primeira tarefa
                  desta etapa.
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleTaskDragStart}
                  onDragOver={(event) => {
                    setOverTaskId(event.over ? String(event.over.id) : null);
                  }}
                  onDragEnd={handleTaskDragEnd}
                  onDragCancel={() => {
                    setActiveTaskId(null);
                    setOverTaskId(null);
                  }}
                >
                  <SortableContext
                    items={sortedTasks.map((task) => task.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {sortedTasks.map((task) => (
                        <TemplateTaskEditor
                          key={task.id}
                          task={task}
                          stepId={step.id}
                          templateId={templateId}
                          disabled={readOnly}
                          isOver={overTaskId === task.id}
                        />
                      ))}
                    </div>
                  </SortableContext>

                  <DragOverlay>
                    {activeTask ? (
                      <div className="w-[min(100%,42rem)]">
                        <TemplateTaskEditor
                          task={activeTask}
                          stepId={step.id}
                          templateId={templateId}
                          disabled
                        />
                      </div>
                    ) : null}
                  </DragOverlay>
                </DndContext>
              )}
            </section>
          </div>
        </ScrollArea>

        <SheetFooter className="flex-shrink-0 border-t px-6 py-4">
          <div className="flex w-full items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              A ordem das colunas, tarefas e campos será usada pelo workflow.
            </p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
              {!readOnly && (
                <Button
                  onClick={handleSaveStep}
                  disabled={updateStep.isPending || !titleDraft.trim()}
                  loading={updateStep.isPending}
                >
                  Salvar
                </Button>
              )}
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
