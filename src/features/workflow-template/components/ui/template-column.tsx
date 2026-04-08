'use client';

import React, { useState, useCallback } from 'react';
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ScrollArea,
} from '@shadcn/index';
import {
  ChevronRight,
  Trash2,
  Plus,
  Pencil,
  Type,
  ChevronDown,
  X,
} from 'lucide-react';
import type {
  WorkflowTemplateStep,
  WorkflowTemplateTask,
  WorkflowTemplateField,
} from '../../server/types/template.types';
import { FIELD_TYPE_LABELS } from '../../constants/template.constants';
import {
  useUpdateStep,
  useRemoveStep,
  useAddTask,
  useRemoveTask,
  useAddStepField,
  useUpdateStepField,
  useRemoveStepField,
} from '../../hooks/mutations';
import { TemplateTaskCard } from './template-task-card';

interface TemplateColumnProps {
  step: WorkflowTemplateStep;
  templateId: string;
  onTaskEdit: (task: WorkflowTemplateTask, stepId: string) => void;
}

export const TemplateColumn = React.memo(
  ({ step, templateId, onTaskEdit }: TemplateColumnProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editingTitle, setEditingTitle] = useState(step.title);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    // Step field editing states
    const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
    const [editingFieldLabel, setEditingFieldLabel] = useState('');
    const [addingOptionForFieldId, setAddingOptionForFieldId] = useState<
      string | null
    >(null);
    const [newOptionValue, setNewOptionValue] = useState('');
    const [stepFieldsExpanded, setStepFieldsExpanded] = useState(false);

    const updateStep = useUpdateStep();
    const removeStep = useRemoveStep();
    const addTask = useAddTask();
    const removeTask = useRemoveTask();
    const addStepField = useAddStepField();
    const updateStepField = useUpdateStepField();
    const removeStepField = useRemoveStepField();

    const sortedTasks = React.useMemo(
      () => [...step.tasks].sort((a, b) => a.order - b.order),
      [step.tasks],
    );

    const handleConfirmTitle = useCallback(() => {
      const trimmed = editingTitle.trim();
      if (trimmed && trimmed !== step.title) {
        updateStep.mutate({
          templateId,
          stepId: step.id,
          data: {
            title: trimmed,
            description: step.description,
            order: step.order,
          },
        });
      }
      setIsEditingTitle(false);
    }, [editingTitle, step, templateId, updateStep]);

    const handleAddTask = useCallback(() => {
      const trimmed = newTaskTitle.trim();
      if (!trimmed) return;
      addTask.mutate({
        templateId,
        stepId: step.id,
        data: {
          title: trimmed,
          description: trimmed,
          type: 'Form',
          configuration: '',
          order: step.tasks.length + 1,
          isOptional: false,
        },
      });
      setNewTaskTitle('');
      setIsAddingTask(false);
    }, [newTaskTitle, step, templateId, addTask]);

    const handleConfirmEditFieldLabel = useCallback(
      (field: WorkflowTemplateField) => {
        const trimmed = editingFieldLabel.trim();
        if (trimmed && trimmed !== field.label) {
          updateStepField.mutate({
            templateId,
            stepId: step.id,
            fieldId: field.id,
            data: {
              label: trimmed,
              fieldType: field.fieldType,
              options: field.options,
            },
          });
        }
        setEditingFieldId(null);
      },
      [editingFieldLabel, step.id, templateId, updateStepField],
    );

    const handleAddOption = useCallback(
      (field: WorkflowTemplateField) => {
        if (!newOptionValue.trim()) return;
        const current = field.options ?? [];
        updateStepField.mutate({
          templateId,
          stepId: step.id,
          fieldId: field.id,
          data: {
            label: field.label,
            fieldType: field.fieldType,
            options: [...current, newOptionValue.trim()],
          },
        });
        setNewOptionValue('');
        setAddingOptionForFieldId(null);
      },
      [newOptionValue, step.id, templateId, updateStepField],
    );

    const handleRemoveOption = useCallback(
      (field: WorkflowTemplateField, option: string) => {
        const newOptions = (field.options ?? []).filter((o) => o !== option);
        updateStepField.mutate({
          templateId,
          stepId: step.id,
          fieldId: field.id,
          data: {
            label: field.label,
            fieldType: field.fieldType,
            options: newOptions.length > 0 ? newOptions : null,
          },
        });
      },
      [step.id, templateId, updateStepField],
    );

    return (
      <div className="flex-shrink-0 w-80 min-w-[320px] max-w-[400px]">
        <div className="bg-accent/30 rounded-lg border transition-all duration-300 ease-in-out h-full shadow-sm flex flex-col">
          {/* HEADER */}
          <div className="p-4 border-b flex-shrink-0 group/header">
            <div className="flex items-center justify-between min-w-0">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCollapsed((v) => !v)}
                  className="h-6 w-6 p-0 hover:bg-muted flex-shrink-0"
                >
                  <div
                    className={`transition-transform duration-300 ${isCollapsed ? 'rotate-0' : 'rotate-90'}`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </Button>

                {/* Badge de ordem */}
                <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded flex-shrink-0">
                  {step.order}
                </span>

                {/* Título inline editável */}
                {isEditingTitle ? (
                  <Input
                    autoFocus
                    value={editingTitle}
                    onChange={(value) => setEditingTitle(value)}
                    onBlur={handleConfirmTitle}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleConfirmTitle();
                      if (e.key === 'Escape') {
                        setEditingTitle(step.title);
                        setIsEditingTitle(false);
                      }
                    }}
                    className="h-7 text-sm font-semibold min-w-0"
                  />
                ) : (
                  <h3
                    className="font-semibold text-sm lg:text-base truncate min-w-0 cursor-text"
                    onDoubleClick={() => {
                      setEditingTitle(step.title);
                      setIsEditingTitle(true);
                    }}
                    title="Duplo clique para editar"
                  >
                    {step.title}
                  </h3>
                )}
              </div>

              <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                  {step.tasks.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover/header:opacity-100 transition-opacity hover:bg-muted"
                  onClick={() => {
                    setEditingTitle(step.title);
                    setIsEditingTitle(true);
                  }}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover/header:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                  onClick={() =>
                    removeStep.mutate({ templateId, stepId: step.id })
                  }
                  disabled={removeStep.isPending}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* CONTEÚDO (colapsável) */}
          <div
            className={`transition-all duration-300 ease-in-out flex flex-col flex-1 ${
              isCollapsed ? 'h-0 opacity-0 overflow-hidden' : 'opacity-100'
            }`}
          >
            {/* CAMPOS DO STEP (colapsável) */}
            <div className="border-b px-4 py-2">
              <button
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground w-full transition-colors"
                onClick={() => setStepFieldsExpanded((v) => !v)}
              >
                <ChevronRight
                  className={`h-3 w-3 transition-transform ${stepFieldsExpanded ? 'rotate-90' : ''}`}
                />
                Campos da etapa ({step.fields.length})
              </button>

              {stepFieldsExpanded && (
                <div className="mt-2 space-y-2">
                  {step.fields.map((field) => (
                    <div
                      key={field.id}
                      className="group/field relative rounded border border-dashed border-border/60 p-2 hover:border-border transition-colors"
                    >
                      <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 opacity-0 group-hover/field:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0"
                          onClick={() => {
                            setEditingFieldId(field.id);
                            setEditingFieldLabel(field.label);
                          }}
                        >
                          <Pencil className="h-2.5 w-2.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 hover:text-destructive"
                          onClick={() =>
                            removeStepField.mutate({
                              templateId,
                              stepId: step.id,
                              fieldId: field.id,
                            })
                          }
                        >
                          <Trash2 className="h-2.5 w-2.5" />
                        </Button>
                      </div>

                      <div className="mb-1.5 pr-12">
                        {editingFieldId === field.id ? (
                          <Input
                            autoFocus
                            value={editingFieldLabel}
                            onChange={(v) => setEditingFieldLabel(v)}
                            onBlur={() => handleConfirmEditFieldLabel(field)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter')
                                handleConfirmEditFieldLabel(field);
                              if (e.key === 'Escape') setEditingFieldId(null);
                            }}
                            className="h-6 text-xs font-medium"
                          />
                        ) : (
                          <Label
                            className="text-xs font-medium cursor-text"
                            onDoubleClick={() => {
                              setEditingFieldId(field.id);
                              setEditingFieldLabel(field.label);
                            }}
                          >
                            {field.label}
                          </Label>
                        )}
                      </div>

                      {field.fieldType === 'Text' ? (
                        <Input
                          placeholder={`${field.label}...`}
                          disabled
                          className="h-7 text-xs opacity-50 pointer-events-none"
                        />
                      ) : (
                        <div className="space-y-1.5">
                          <Select disabled>
                            <SelectTrigger className="h-7 text-xs opacity-50 pointer-events-none">
                              <SelectValue placeholder="Selecionar..." />
                            </SelectTrigger>
                            <SelectContent>
                              {(field.options ?? []).map((opt) => (
                                <SelectItem
                                  key={opt}
                                  value={opt}
                                  className="text-xs"
                                >
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex flex-wrap gap-1">
                            {(field.options ?? []).map((opt) => (
                              <span
                                key={opt}
                                className="inline-flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                              >
                                {opt}
                                <button
                                  onClick={() => handleRemoveOption(field, opt)}
                                  className="hover:text-destructive"
                                >
                                  <X className="h-2 w-2" />
                                </button>
                              </span>
                            ))}
                            {addingOptionForFieldId === field.id ? (
                              <Input
                                autoFocus
                                value={newOptionValue}
                                onChange={(v) => setNewOptionValue(v)}
                                onBlur={() => {
                                  if (newOptionValue.trim())
                                    handleAddOption(field);
                                  else setAddingOptionForFieldId(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleAddOption(field);
                                  if (e.key === 'Escape') {
                                    setNewOptionValue('');
                                    setAddingOptionForFieldId(null);
                                  }
                                }}
                                className="h-5 w-20 text-xs px-1"
                                placeholder="Opção..."
                              />
                            ) : (
                              <button
                                onClick={() =>
                                  setAddingOptionForFieldId(field.id)
                                }
                                className="inline-flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full border border-dashed border-muted-foreground/40 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <Plus className="h-2 w-2" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      <span className="inline-flex mt-1 text-xs px-1 py-0.5 rounded bg-muted text-muted-foreground">
                        {FIELD_TYPE_LABELS[field.fieldType]}
                      </span>
                    </div>
                  ))}

                  {/* Adicionar campo da etapa */}
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground"
                      onClick={() =>
                        addStepField.mutate({
                          templateId,
                          stepId: step.id,
                          data: {
                            label: 'Novo campo de texto',
                            fieldType: 'Text',
                            options: null,
                          },
                        })
                      }
                      disabled={addStepField.isPending}
                    >
                      <Type className="h-3 w-3 mr-1" />
                      Texto
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground"
                      onClick={() =>
                        addStepField.mutate({
                          templateId,
                          stepId: step.id,
                          data: {
                            label: 'Novo campo de seleção',
                            fieldType: 'Select',
                            options: ['Opção 1'],
                          },
                        })
                      }
                      disabled={addStepField.isPending}
                    >
                      <ChevronDown className="h-3 w-3 mr-1" />
                      Seleção
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* CARDS DAS TASKS */}
            <div
              className="flex-1"
              style={{ height: 'calc(100vh - 320px)', minHeight: '300px' }}
            >
              <ScrollArea className="h-full">
                <div className="p-4 space-y-3">
                  {sortedTasks.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                      <p className="text-sm">Nenhuma tarefa nesta etapa</p>
                    </div>
                  ) : (
                    sortedTasks.map((task) => (
                      <TemplateTaskCard
                        key={task.id}
                        task={task}
                        onEdit={(t) => onTaskEdit(t, step.id)}
                        onDelete={(taskId) =>
                          removeTask.mutate({
                            templateId,
                            stepId: step.id,
                            taskId,
                          })
                        }
                        isDeleting={removeTask.isPending}
                      />
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* FOOTER — adicionar tarefa */}
            <div className="p-3 border-t shrink-0">
              {isAddingTask ? (
                <div className="flex gap-2">
                  <Input
                    autoFocus
                    value={newTaskTitle}
                    onChange={(value) => setNewTaskTitle(value)}
                    onBlur={() => {
                      if (newTaskTitle.trim()) handleAddTask();
                      else setIsAddingTask(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddTask();
                      if (e.key === 'Escape') {
                        setNewTaskTitle('');
                        setIsAddingTask(false);
                      }
                    }}
                    placeholder="Nome da tarefa..."
                    className="h-8 text-sm flex-1"
                  />
                  <Button
                    size="sm"
                    className="h-8"
                    onClick={handleAddTask}
                    disabled={addTask.isPending || !newTaskTitle.trim()}
                  >
                    OK
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-muted-foreground hover:text-foreground text-xs"
                  onClick={() => setIsAddingTask(true)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Adicionar tarefa
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

TemplateColumn.displayName = 'TemplateColumn';
