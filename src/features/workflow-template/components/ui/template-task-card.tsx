'use client';

import React from 'react';
import { Card, CardHeader, CardContent, Button } from '@shadcn/index';
import { Trash2 } from 'lucide-react';
import type { WorkflowTemplateTask } from '../../server/types/template.types';
import { TASK_TYPE_OPTIONS } from '../../constants/template.constants';

interface TemplateTaskCardProps {
  task: WorkflowTemplateTask;
  onEdit: (task: WorkflowTemplateTask) => void;
  onDelete: (taskId: string) => void;
  isDeleting?: boolean;
}

const TASK_TYPE_COLORS: Record<string, string> = {
  Form: 'bg-blue-100 text-blue-800 border-blue-200',
  Checklist: 'bg-green-100 text-green-800 border-green-200',
  Document: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Approval: 'bg-purple-100 text-purple-800 border-purple-200',
};

export const TemplateTaskCard = React.memo(
  ({ task, onEdit, onDelete, isDeleting }: TemplateTaskCardProps) => {
    const typeLabel =
      TASK_TYPE_OPTIONS.find((o) => o.value === task.type)?.label ?? task.type;
    const typeColor =
      TASK_TYPE_COLORS[task.type] ?? 'bg-muted text-muted-foreground';
    const fieldCount = task.fields.length;

    return (
      <Card
        className="w-full overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group bg-card/80 border-none backdrop-blur-sm outline-dashed outline-2 outline-foreground/10 relative"
        onClick={() => onEdit(task)}
        tabIndex={0}
        role="button"
        aria-label={`Editar tarefa: ${task.title}`}
      >
        {/* Delete button — visible on hover */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive z-10"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          disabled={isDeleting}
        >
          <Trash2 className="h-3 w-3" />
        </Button>

        <CardHeader className="pb-2 pt-3 px-3 space-y-2">
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-foreground pr-6">
            {task.title}
          </h3>
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full border font-medium ${typeColor}`}
            >
              {typeLabel}
            </span>
            {task.isOptional && (
              <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full border bg-muted text-muted-foreground">
                Opcional
              </span>
            )}
          </div>
        </CardHeader>

        {fieldCount > 0 && (
          <CardContent className="pt-0 pb-3 px-3">
            <span className="text-xs text-muted-foreground">
              {fieldCount} campo{fieldCount !== 1 ? 's' : ''}
            </span>
          </CardContent>
        )}
      </Card>
    );
  },
);

TemplateTaskCard.displayName = 'TemplateTaskCard';
