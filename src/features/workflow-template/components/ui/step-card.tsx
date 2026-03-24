'use client';

import React, { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@shadcn/index';
import {
  ChevronRight,
  Pencil,
  Trash2,
  ListChecks,
  FormInput,
  GripVertical,
} from 'lucide-react';
import { cn } from '@societiza/lib/utils';
import { motion } from 'framer-motion';
import { FIELD_TYPE_LABELS } from '../../constants/template.constants';
import { StepEditorDialog } from './step-editor-dialog';
import { TaskEditorDialog } from './task-editor-dialog';
import { FieldEditorDialog } from './field-editor-dialog';
import type {
  WorkflowTemplateStep,
  WorkflowTemplateTask,
  WorkflowTemplateField,
  CreateStepDTO,
  CreateTaskDTO,
  CreateFieldDTO,
} from '../../server/types/template.types';

interface StepCardProps {
  step: WorkflowTemplateStep;
  templateId: string;
  onUpdateStep: (data: CreateStepDTO) => void;
  onRemoveStep: () => void;
  onAddTask: (data: CreateTaskDTO) => void;
  onUpdateTask: (taskId: string, data: CreateTaskDTO) => void;
  onRemoveTask: (taskId: string) => void;
  onAddStepField: (data: CreateFieldDTO) => void;
  onUpdateStepField: (fieldId: string, data: CreateFieldDTO) => void;
  onRemoveStepField: (fieldId: string) => void;
  onAddTaskField: (taskId: string, data: CreateFieldDTO) => void;
  onUpdateTaskField: (
    taskId: string,
    fieldId: string,
    data: CreateFieldDTO,
  ) => void;
  onRemoveTaskField: (taskId: string, fieldId: string) => void;
  isLoading?: boolean;
}

function FieldItem({
  field,
  onEdit,
  onRemove,
}: {
  field: WorkflowTemplateField;
  onEdit: (data: CreateFieldDTO) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-2 rounded-md bg-muted/50 group">
      <div className="flex items-center gap-2 min-w-0">
        <FormInput className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        <span className="text-sm truncate">{field.label}</span>
        <Badge variant="outline" className="text-xs flex-shrink-0">
          {FIELD_TYPE_LABELS[field.fieldType]}
        </Badge>
        {field.options && field.options.length > 0 && (
          <span className="text-xs text-muted-foreground">
            ({field.options.length} opções)
          </span>
        )}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <FieldEditorDialog
          field={field}
          onSubmit={onEdit}
          trigger={
            <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Pencil className="h-3 w-3" />
            </Button>
          }
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

function TaskItem({
  task,
  onEdit,
  onRemove,
  onAddField,
  onEditField,
  onRemoveField,
}: {
  task: WorkflowTemplateTask;
  onEdit: (data: CreateTaskDTO) => void;
  onRemove: () => void;
  onAddField: (data: CreateFieldDTO) => void;
  onEditField: (fieldId: string, data: CreateFieldDTO) => void;
  onRemoveField: (fieldId: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-md p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex-shrink-0"
          >
            <ChevronRight
              className={cn(
                'h-4 w-4 transition-transform',
                isOpen && 'rotate-90',
              )}
            />
          </button>
          <span className="text-sm font-medium truncate">{task.title}</span>
          <Badge variant="outline" className="text-xs flex-shrink-0">
            #{task.order}
          </Badge>
          {task.isOptional && (
            <Badge variant="secondary" className="text-xs flex-shrink-0">
              Opcional
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <TaskEditorDialog
            task={task}
            onSubmit={onEdit}
            trigger={
              <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            }
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-muted-foreground ml-6">{task.description}</p>
      )}

      {isOpen && (
        <div className="ml-6 space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Campos da tarefa ({task.fields.length})
            </span>
            <FieldEditorDialog onSubmit={onAddField} />
          </div>
          {task.fields.length > 0 ? (
            <div className="space-y-1">
              {task.fields.map((field) => (
                <FieldItem
                  key={field.id}
                  field={field}
                  onEdit={(data) => onEditField(field.id, data)}
                  onRemove={() => onRemoveField(field.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              Nenhum campo nesta tarefa
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function StepCard({
  step,
  onUpdateStep,
  onRemoveStep,
  onAddTask,
  onUpdateTask,
  onRemoveTask,
  onAddStepField,
  onUpdateStepField,
  onRemoveStepField,
  onAddTaskField,
  onUpdateTaskField,
  onRemoveTaskField,
}: StepCardProps) {
  const sortedTasks = [...step.tasks].sort((a, b) => a.order - b.order);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border shadow-sm">
        <Collapsible defaultOpen>
          <CardHeader className="pb-3">
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <Badge variant="outline" className="flex-shrink-0">
                    #{step.order}
                  </Badge>
                  <div className="text-left min-w-0">
                    <h3 className="text-sm font-semibold truncate">
                      {step.title}
                    </h3>
                    {step.description && (
                      <p className="text-xs text-muted-foreground truncate">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ListChecks className="h-3.5 w-3.5" />
                    <span>{step.tasks.length}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <FormInput className="h-3.5 w-3.5" />
                    <span>{step.fields.length}</span>
                  </div>
                </div>
              </div>
            </CollapsibleTrigger>

            <div className="flex items-center gap-1 mt-2">
              <StepEditorDialog
                step={step}
                onSubmit={onUpdateStep}
                trigger={
                  <Button type="button" variant="ghost" size="sm">
                    <Pencil className="h-3.5 w-3.5 mr-1" />
                    Editar
                  </Button>
                }
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={onRemoveStep}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Remover
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Remove a etapa e todo seu conteúdo
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>

          <CollapsibleContent>
            <CardContent className="space-y-4 pt-0">
              {/* Step Fields */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Campos da etapa ({step.fields.length})
                  </span>
                  <FieldEditorDialog onSubmit={onAddStepField} />
                </div>
                {step.fields.length > 0 ? (
                  <div className="space-y-1">
                    {step.fields.map((field) => (
                      <FieldItem
                        key={field.id}
                        field={field}
                        onEdit={(data) => onUpdateStepField(field.id, data)}
                        onRemove={() => onRemoveStepField(field.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    Nenhum campo nesta etapa
                  </p>
                )}
              </div>

              {/* Step Tasks */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Tarefas ({step.tasks.length})
                  </span>
                  <TaskEditorDialog
                    defaultOrder={step.tasks.length + 1}
                    onSubmit={onAddTask}
                  />
                </div>
                {sortedTasks.length > 0 ? (
                  <div className="space-y-2">
                    {sortedTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onEdit={(data) => onUpdateTask(task.id, data)}
                        onRemove={() => onRemoveTask(task.id)}
                        onAddField={(data) => onAddTaskField(task.id, data)}
                        onEditField={(fieldId, data) =>
                          onUpdateTaskField(task.id, fieldId, data)
                        }
                        onRemoveField={(fieldId) =>
                          onRemoveTaskField(task.id, fieldId)
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    Nenhuma tarefa nesta etapa
                  </p>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </motion.div>
  );
}
