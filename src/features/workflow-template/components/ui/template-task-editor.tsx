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
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Button,
  Checkbox,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@shadcn/index';
import {
  ChevronDown,
  GripVertical,
  Plus,
  Trash2,
  Type,
} from 'lucide-react';
import { TASK_TYPE_OPTIONS } from '../../constants/template.constants';
import {
  useAddTaskField,
  useReorderTaskFields,
  useRemoveTask,
  useRemoveTaskField,
  useUpdateTask,
  useUpdateTaskField,
} from '../../hooks/mutations';
import type { TaskType, WorkflowTemplateTask } from '../../server/types/template.types';
import { getNextFieldLabel } from '../../lib/field-labels';
import { TemplateFieldEditor } from './template-field-editor';

interface TemplateTaskEditorProps {
  task: WorkflowTemplateTask;
  stepId: string;
  templateId: string;
  disabled?: boolean;
  isOver?: boolean;
}

export function TemplateTaskEditor({
  task,
  stepId,
  templateId,
  disabled = false,
  isOver = false,
}: TemplateTaskEditorProps) {
  const [open, setOpen] = useState(true);
  const [titleDraft, setTitleDraft] = useState(task.title);
  const [descriptionDraft, setDescriptionDraft] = useState(task.description);
  const [typeDraft, setTypeDraft] = useState(task.type);
  const [isOptionalDraft, setIsOptionalDraft] = useState(task.isOptional);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [overFieldId, setOverFieldId] = useState<string | null>(null);

  const updateTask = useUpdateTask();
  const removeTask = useRemoveTask();
  const addTaskField = useAddTaskField();
  const reorderTaskFields = useReorderTaskFields();
  const updateTaskField = useUpdateTaskField();
  const removeTaskField = useRemoveTaskField();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const sortable = useSortable({
    id: task.id,
    disabled,
    data: {
      type: 'task',
      taskId: task.id,
    },
  });

  useEffect(() => {
    setTitleDraft(task.title);
    setDescriptionDraft(task.description);
    setTypeDraft(task.type);
    setIsOptionalDraft(task.isOptional);
  }, [task.description, task.id, task.isOptional, task.title, task.type]);

  const style = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
  };

  const saveTask = (overrides?: Partial<WorkflowTemplateTask>) => {
    const nextTitle = (overrides?.title ?? titleDraft).trim();
    const nextDescription =
      (overrides?.description ?? descriptionDraft).trim() ||
      nextTitle ||
      task.description;

    if (!nextTitle) {
      setTitleDraft(task.title);
      setDescriptionDraft(task.description);
      return;
    }

    const payload = {
      title: nextTitle,
      description: nextDescription,
      type: overrides?.type ?? typeDraft,
      configuration: overrides?.configuration ?? task.configuration,
      order: overrides?.order ?? task.order,
      isOptional: overrides?.isOptional ?? isOptionalDraft,
    };

    const changed =
      payload.title !== task.title ||
      payload.description !== task.description ||
      payload.type !== task.type ||
      payload.configuration !== task.configuration ||
      payload.order !== task.order ||
      payload.isOptional !== task.isOptional;

    if (!changed) return;

    updateTask.mutate({
      templateId,
      stepId,
      taskId: task.id,
      data: payload,
    });
  };

  const taskTypeLabel = useMemo(
    () =>
      TASK_TYPE_OPTIONS.find((option) => option.value === typeDraft)?.label ??
      typeDraft,
    [typeDraft],
  );
  const sortedFields = useMemo(
    () => [...task.fields].sort((left, right) => left.order - right.order),
    [task.fields],
  );
  const isCreatingTaskField = addTaskField.isPending;
  const activeField =
    sortedFields.find((field) => field.id === activeFieldId) ?? null;

  const handleTaskFieldDragStart = (event: DragStartEvent) => {
    setActiveFieldId(String(event.active.id));
  };

  const handleTaskFieldDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveFieldId(null);
    setOverFieldId(null);

    if (!over || active.id === over.id) return;

    const currentIndex = sortedFields.findIndex((field) => field.id === active.id);
    const nextIndex = sortedFields.findIndex((field) => field.id === over.id);

    if (currentIndex === -1 || nextIndex === -1) return;

    const reordered = arrayMove(sortedFields, currentIndex, nextIndex).map(
      (field, index) => ({
        ...field,
        order: index + 1,
      }),
    );

    reorderTaskFields.mutate({
      templateId,
      stepId,
      taskId: task.id,
      fields: reordered,
    });
  };

  return (
    <div
      ref={sortable.setNodeRef}
      style={style}
      className={[
        'rounded-2xl border bg-card/80 shadow-sm transition-all',
        sortable.isDragging && 'z-20 rotate-[1deg] border-primary/50 shadow-xl',
        isOver && !sortable.isDragging && 'border-primary/60 ring-2 ring-primary/20',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex items-center gap-2 border-b px-4 py-3">
          {!disabled && (
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              {...sortable.attributes}
              {...sortable.listeners}
            >
              <GripVertical className="h-4 w-4" />
            </button>
          )}

          <div className="min-w-0 flex-1">
            <Input
              value={titleDraft}
              onChange={(value) => setTitleDraft(value)}
              onBlur={() => saveTask()}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  saveTask();
                }
                if (event.key === 'Escape') setTitleDraft(task.title);
              }}
              disabled={disabled}
              className="h-8 border-0 bg-transparent px-0 text-sm font-medium shadow-none focus-visible:ring-0"
            />
            <p className="text-xs text-muted-foreground">{taskTypeLabel}</p>
          </div>

          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronDown
                className={[
                  'h-4 w-4 transition-transform',
                  open && 'rotate-180',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
            </Button>
          </CollapsibleTrigger>

          {!disabled && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              onClick={() =>
                removeTask.mutate({
                  templateId,
                  stepId,
                  taskId: task.id,
                })
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <CollapsibleContent>
          <div className="space-y-5 px-4 py-4">
            <Textarea
              value={descriptionDraft}
              onChange={(event) => setDescriptionDraft(event.target.value)}
              onBlur={() => saveTask()}
              disabled={disabled}
              rows={3}
              placeholder="Contexto breve da tarefa..."
              className="min-h-24"
            />

            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
              <Select
                value={typeDraft}
                onValueChange={(value) => {
                  setTypeDraft(value as TaskType);
                  saveTask({
                    title: titleDraft,
                    description: descriptionDraft,
                    type: value as TaskType,
                  });
                }}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo da tarefa" />
                </SelectTrigger>
                <SelectContent>
                  {TASK_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <label className="flex items-center gap-2 rounded-xl border border-border/70 px-3 py-2 text-sm text-muted-foreground">
                <Checkbox
                  checked={isOptionalDraft}
                  onCheckedChange={(checked) => {
                    const nextChecked = checked === true;
                    setIsOptionalDraft(nextChecked);
                    saveTask({
                      title: titleDraft,
                      description: descriptionDraft,
                      isOptional: nextChecked,
                    });
                  }}
                  disabled={disabled}
                />
                Opcional
              </label>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-medium">Campos da tarefa</h4>
                  <p className="text-xs text-muted-foreground">
                    O que a equipe precisa preencher ao concluir esta tarefa.
                  </p>
                </div>

                {!disabled && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isCreatingTaskField}
                      onClick={() =>
                        addTaskField.mutate({
                          templateId,
                          stepId,
                          taskId: task.id,
                          clientId: `temp-task-field-${crypto.randomUUID()}`,
                          data: {
                            label: getNextFieldLabel(sortedFields, 'Text'),
                            fieldType: 'Text',
                            options: null,
                            order: sortedFields.length + 1,
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
                      disabled={isCreatingTaskField}
                      onClick={() =>
                        addTaskField.mutate({
                          templateId,
                          stepId,
                          taskId: task.id,
                          clientId: `temp-task-field-${crypto.randomUUID()}`,
                          data: {
                            label: getNextFieldLabel(sortedFields, 'Select'),
                            fieldType: 'Select',
                            options: ['Opção 1'],
                            order: sortedFields.length + 1,
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

              {sortedFields.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
                  Essa tarefa ainda não tem campos configurados.
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleTaskFieldDragStart}
                  onDragOver={(event) => {
                    setOverFieldId(event.over ? String(event.over.id) : null);
                  }}
                  onDragEnd={handleTaskFieldDragEnd}
                  onDragCancel={() => {
                    setActiveFieldId(null);
                    setOverFieldId(null);
                  }}
                >
                  <SortableContext
                    items={sortedFields.map((field) => field.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {sortedFields.map((field) => (
                        <TemplateFieldEditor
                          key={field.id}
                          field={field}
                          disabled={disabled}
                          sortable
                          isOver={overFieldId === field.id}
                          onRemove={() =>
                            removeTaskField.mutate({
                              templateId,
                              stepId,
                              taskId: task.id,
                              fieldId: field.id,
                            })
                          }
                          onUpdate={(data) =>
                            updateTaskField.mutate({
                              templateId,
                              stepId,
                              taskId: task.id,
                              fieldId: field.id,
                              data,
                            })
                          }
                        />
                      ))}
                    </div>
                  </SortableContext>

                  <DragOverlay>
                    {activeField ? (
                      <TemplateFieldEditor
                        field={activeField}
                        disabled
                        onRemove={() => {}}
                        onUpdate={() => {}}
                      />
                    ) : null}
                  </DragOverlay>
                </DndContext>
              )}

              {!disabled && sortedFields.length === 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() =>
                    addTaskField.mutate({
                      templateId,
                      stepId,
                      taskId: task.id,
                      clientId: `temp-task-field-${crypto.randomUUID()}`,
                      data: {
                        label: getNextFieldLabel(sortedFields, 'Text'),
                        fieldType: 'Text',
                        options: null,
                        order: sortedFields.length + 1,
                      },
                    })
                  }
                >
                  <Plus className="h-3.5 w-3.5" />
                  Adicionar primeiro campo
                </Button>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
