'use client';

import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  Checkbox,
  Separator,
} from '@shadcn/index';
import { Plus, Trash2, Pencil, Type, ChevronDown, X } from 'lucide-react';
import type {
  WorkflowTemplateTask,
  WorkflowTemplateField,
} from '../../server/types/template.types';
import {
  TASK_TYPE_OPTIONS,
  FIELD_TYPE_LABELS,
} from '../../constants/template.constants';
import { useUpdateTask } from '../../hooks/mutations/use-task-mutations';
import {
  useAddTaskField,
  useUpdateTaskField,
  useRemoveTaskField,
} from '../../hooks/mutations/use-field-mutations';

interface TemplateTaskSheetProps {
  task: WorkflowTemplateTask | null;
  stepId: string;
  templateId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TemplateTaskSheet({
  task,
  stepId,
  templateId,
  open,
  onOpenChange,
}: TemplateTaskSheetProps) {
  const [localTitle, setLocalTitle] = useState('');
  const [localType, setLocalType] = useState('Form');
  const [localIsOptional, setLocalIsOptional] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editingFieldLabel, setEditingFieldLabel] = useState('');
  const [addingOptionForFieldId, setAddingOptionForFieldId] = useState<
    string | null
  >(null);
  const [newOptionValue, setNewOptionValue] = useState('');
  const [fieldPopoverOpen, setFieldPopoverOpen] = useState(false);

  const updateTask = useUpdateTask();
  const addTaskField = useAddTaskField();
  const updateTaskField = useUpdateTaskField();
  const removeTaskField = useRemoveTaskField();

  useEffect(() => {
    if (task) {
      setLocalTitle(task.title);
      setLocalType(task.type);
      setLocalIsOptional(task.isOptional);
      setEditingFieldId(null);
      setAddingOptionForFieldId(null);
      setNewOptionValue('');
    }
  }, [task?.id]);

  if (!task) return null;

  const handleSaveTask = () => {
    updateTask.mutate({
      templateId,
      stepId,
      taskId: task.id,
      data: {
        title: localTitle,
        description: task.description || localTitle,
        type: localType,
        configuration: task.configuration,
        order: task.order,
        isOptional: localIsOptional,
      },
    });
    onOpenChange(false);
  };

  const handleStartEditLabel = (field: WorkflowTemplateField) => {
    setEditingFieldId(field.id);
    setEditingFieldLabel(field.label);
  };

  const handleConfirmEditLabel = (field: WorkflowTemplateField) => {
    const trimmed = editingFieldLabel.trim();
    if (trimmed && trimmed !== field.label) {
      updateTaskField.mutate({
        templateId,
        stepId,
        taskId: task.id,
        fieldId: field.id,
        data: {
          label: trimmed,
          fieldType: field.fieldType,
          options: field.options,
        },
      });
    }
    setEditingFieldId(null);
  };

  const handleRemoveField = (fieldId: string) => {
    removeTaskField.mutate({ templateId, stepId, taskId: task.id, fieldId });
  };

  const handleAddField = (type: 'Text' | 'Select') => {
    addTaskField.mutate({
      templateId,
      stepId,
      taskId: task.id,
      data:
        type === 'Text'
          ? { label: 'Novo campo de texto', fieldType: 'Text', options: null }
          : {
              label: 'Novo campo de seleção',
              fieldType: 'Select',
              options: ['Opção 1'],
            },
    });
    setFieldPopoverOpen(false);
  };

  const handleAddOption = (field: WorkflowTemplateField) => {
    if (!newOptionValue.trim()) return;
    const currentOptions = field.options ?? [];
    updateTaskField.mutate({
      templateId,
      stepId,
      taskId: task.id,
      fieldId: field.id,
      data: {
        label: field.label,
        fieldType: field.fieldType,
        options: [...currentOptions, newOptionValue.trim()],
      },
    });
    setNewOptionValue('');
    setAddingOptionForFieldId(null);
  };

  const handleRemoveOption = (field: WorkflowTemplateField, option: string) => {
    const newOptions = (field.options ?? []).filter((o) => o !== option);
    updateTaskField.mutate({
      templateId,
      stepId,
      taskId: task.id,
      fieldId: field.id,
      data: {
        label: field.label,
        fieldType: field.fieldType,
        options: newOptions.length > 0 ? newOptions : null,
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="sm:max-w-lg w-full flex flex-col p-0 gap-0"
        side="right"
      >
        <SheetHeader className="px-6 py-4 border-b shrink-0">
          <SheetTitle className="sr-only">Editar tarefa</SheetTitle>
          <div className="space-y-3">
            {/* Título editável */}
            <Input
              value={localTitle}
              onChange={(value) => setLocalTitle(value)}
              className="text-base font-semibold border-0 border-b border-dashed rounded-none px-0 h-auto focus-visible:ring-0 shadow-none"
              placeholder="Título da tarefa..."
            />
            <div className="flex items-center gap-3 flex-wrap">
              {/* Tipo */}
              <Select value={localType} onValueChange={setLocalType}>
                <SelectTrigger className="w-40 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_TYPE_OPTIONS.map((o) => (
                    <SelectItem
                      key={o.value}
                      value={o.value}
                      className="text-xs"
                    >
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Opcional */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="optional-check"
                  checked={localIsOptional}
                  onCheckedChange={(checked) =>
                    setLocalIsOptional(checked === true)
                  }
                />
                <label
                  htmlFor="optional-check"
                  className="text-xs text-muted-foreground cursor-pointer select-none"
                >
                  Opcional
                </label>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Body — campos WYSIWYG */}
        <ScrollArea className="flex-1">
          <div className="px-6 py-4 space-y-4">
            {task.fields.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <Type className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Nenhum campo nesta tarefa.</p>
                <p className="text-xs mt-1">
                  Adicione campos usando o botão abaixo.
                </p>
              </div>
            ) : (
              task.fields.map((field) => (
                <div
                  key={field.id}
                  className="group relative rounded-lg border border-dashed border-border/60 p-3 hover:border-border transition-colors"
                >
                  {/* Ações do campo (visíveis no hover) */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-muted"
                      onClick={() => handleStartEditLabel(field)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleRemoveField(field.id)}
                      disabled={removeTaskField.isPending}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Label do campo */}
                  <div className="mb-2 pr-16">
                    {editingFieldId === field.id ? (
                      <Input
                        autoFocus
                        value={editingFieldLabel}
                        onChange={(value) => setEditingFieldLabel(value)}
                        onBlur={() => handleConfirmEditLabel(field)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleConfirmEditLabel(field);
                          if (e.key === 'Escape') setEditingFieldId(null);
                        }}
                        className="h-7 text-sm font-medium"
                      />
                    ) : (
                      <Label
                        className="text-sm font-medium cursor-text"
                        onDoubleClick={() => handleStartEditLabel(field)}
                        title="Duplo clique para editar"
                      >
                        {field.label}
                      </Label>
                    )}
                  </div>

                  {/* Campo renderizado como UI real */}
                  {field.fieldType === 'Text' ? (
                    <Input
                      placeholder={`${field.label}...`}
                      disabled
                      className="opacity-50 cursor-not-allowed pointer-events-none"
                    />
                  ) : (
                    <div className="space-y-2">
                      <Select disabled>
                        <SelectTrigger className="opacity-50 pointer-events-none">
                          <SelectValue placeholder="Selecionar opção..." />
                        </SelectTrigger>
                        <SelectContent>
                          {(field.options ?? []).map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Gerenciar opções inline */}
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {(field.options ?? []).map((opt) => (
                          <span
                            key={opt}
                            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
                          >
                            {opt}
                            <button
                              onClick={() => handleRemoveOption(field, opt)}
                              className="hover:text-destructive transition-colors"
                            >
                              <X className="h-2.5 w-2.5" />
                            </button>
                          </span>
                        ))}

                        {addingOptionForFieldId === field.id ? (
                          <Input
                            autoFocus
                            value={newOptionValue}
                            onChange={(v) => setNewOptionValue(v)}
                            onBlur={() => {
                              if (newOptionValue.trim()) handleAddOption(field);
                              else setAddingOptionForFieldId(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddOption(field);
                              if (e.key === 'Escape') {
                                setNewOptionValue('');
                                setAddingOptionForFieldId(null);
                              }
                            }}
                            className="h-6 w-28 text-xs"
                            placeholder="Nova opção..."
                          />
                        ) : (
                          <button
                            onClick={() => setAddingOptionForFieldId(field.id)}
                            className="inline-flex items-center gap-0.5 text-xs px-2 py-1 rounded-full border border-dashed border-muted-foreground/40 text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-colors"
                          >
                            <Plus className="h-2.5 w-2.5" />
                            Opção
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Badge de tipo */}
                  <span className="inline-flex mt-2 text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    {FIELD_TYPE_LABELS[field.fieldType]}
                  </span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <Separator />

        <SheetFooter className="px-6 py-4 shrink-0 flex flex-row items-center justify-between gap-2">
          <Popover open={fieldPopoverOpen} onOpenChange={setFieldPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Adicionar campo
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-44 p-2" align="start" side="top">
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm"
                  onClick={() => handleAddField('Text')}
                  disabled={addTaskField.isPending}
                >
                  <Type className="h-3.5 w-3.5 mr-2" />
                  Texto
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm"
                  onClick={() => handleAddField('Select')}
                  disabled={addTaskField.isPending}
                >
                  <ChevronDown className="h-3.5 w-3.5 mr-2" />
                  Seleção
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            onClick={handleSaveTask}
            disabled={updateTask.isPending || !localTitle.trim()}
            loading={updateTask.isPending}
          >
            Salvar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
