'use client';

import React, { useEffect, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Checkbox, Input } from '@shadcn/index';
import { GripVertical, Trash2 } from 'lucide-react';
import { useRemoveTask, useUpdateTask } from '../../hooks/mutations';
import type { WorkflowTemplateTask } from '../../server/types/template.types';

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
  const [titleDraft, setTitleDraft] = useState(task.title);
  const [isOptionalDraft, setIsOptionalDraft] = useState(task.isOptional);

  const updateTask = useUpdateTask();
  const removeTask = useRemoveTask();

  const sortable = useSortable({
    id: task.id,
    disabled,
    data: { type: 'task', taskId: task.id },
  });

  useEffect(() => {
    setTitleDraft(task.title);
    setIsOptionalDraft(task.isOptional);
  }, [task.id, task.title, task.isOptional]);

  const style = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
  };

  const saveTask = (overrides?: { isOptional?: boolean; title?: string }) => {
    const nextTitle = (overrides?.title ?? titleDraft).trim();
    if (!nextTitle) {
      setTitleDraft(task.title);
      return;
    }
    const nextOptional = overrides?.isOptional ?? isOptionalDraft;
    const changed = nextTitle !== task.title || nextOptional !== task.isOptional;
    if (!changed) return;

    updateTask.mutate({
      templateId,
      stepId,
      taskId: task.id,
      data: {
        title: nextTitle,
        description: task.description,
        type: task.type,
        configuration: task.configuration,
        order: task.order,
        isOptional: nextOptional,
      },
    });
  };

  return (
    <div
      ref={sortable.setNodeRef}
      style={style}
      className={[
        'flex items-center gap-2 rounded-xl border bg-card/80 px-3 py-2.5 shadow-sm transition-all',
        sortable.isDragging && 'z-20 rotate-[1deg] border-primary/50 shadow-xl opacity-50',
        isOver && !sortable.isDragging && 'border-primary/60 ring-2 ring-primary/20',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {!disabled && (
        <button
          type="button"
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-grab active:cursor-grabbing"
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
            if (event.key === 'Enter') { event.preventDefault(); saveTask(); }
            if (event.key === 'Escape') setTitleDraft(task.title);
          }}
          disabled={disabled}
          placeholder="Nome da tarefa"
          className="h-8 border-0 bg-transparent px-0 text-sm font-medium shadow-none focus-visible:ring-0"
        />
      </div>

      <label className="flex flex-shrink-0 items-center gap-1.5 text-xs text-muted-foreground select-none cursor-pointer">
        <Checkbox
          checked={isOptionalDraft}
          onCheckedChange={(checked) => {
            const next = checked === true;
            setIsOptionalDraft(next);
            saveTask({ isOptional: next });
          }}
          disabled={disabled}
        />
        Opcional
      </label>

      {!disabled && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 flex-shrink-0 p-0 hover:bg-destructive/10 hover:text-destructive"
          onClick={() => removeTask.mutate({ templateId, stepId, taskId: task.id })}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
