'use client';

import React, { useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Card, CardContent } from '@shadcn/index';
import {
  ArrowUpRight,
  GripVertical,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useRemoveStep } from '../../hooks/mutations';
import type { WorkflowTemplateStep } from '../../server/types/template.types';

interface TemplateColumnProps {
  step: WorkflowTemplateStep;
  templateId: string;
  readOnly?: boolean;
  isOver?: boolean;
  onOpenProcess: (stepId: string) => void;
}

export function TemplateColumn({
  step,
  templateId,
  readOnly = false,
  isOver = false,
  onOpenProcess,
}: TemplateColumnProps) {
  const removeStep = useRemoveStep();

  const sortable = useSortable({
    id: step.id,
    disabled: readOnly,
    data: {
      type: 'step',
      stepId: step.id,
    },
  });

  const totalTaskFields = useMemo(
    () => step.tasks.reduce((acc, task) => acc + task.fields.length, 0),
    [step.tasks],
  );

  const style = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
  };

  return (
    <div
      ref={sortable.setNodeRef}
      style={style}
      className={[
        'flex w-80 min-w-[20rem] flex-shrink-0 flex-col gap-3 rounded-[28px] border border-border/70 bg-accent/20 p-3 shadow-sm transition-all',
        sortable.isDragging && 'z-20 rotate-[1deg] border-primary/50 shadow-xl',
        isOver && !sortable.isDragging && 'border-primary/70 ring-2 ring-primary/20',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-start justify-between gap-3 px-1 pt-1">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-background px-2 text-xs font-medium text-muted-foreground tabular-nums">
              {step.order}
            </span>
            <h3 className="truncate text-sm font-semibold text-foreground">
              {step.title}
            </h3>
          </div>

          {step.description && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {step.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1">
          {!readOnly && (
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
              {...sortable.attributes}
              {...sortable.listeners}
            >
              <GripVertical className="h-4 w-4" />
            </button>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onOpenProcess(step.id)}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          {!readOnly && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              onClick={() =>
                removeStep.mutate({
                  templateId,
                  stepId: step.id,
                })
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div
        role={readOnly ? undefined : 'button'}
        tabIndex={readOnly ? -1 : 0}
        onClick={readOnly ? undefined : () => onOpenProcess(step.id)}
        onKeyDown={
          readOnly
            ? undefined
            : (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onOpenProcess(step.id);
                }
              }
        }
        className={[
          'group h-full min-h-[14rem] rounded-[24px] text-left outline-none',
          !readOnly &&
            'cursor-pointer transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary/30',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <Card className="h-full rounded-[24px] border border-border/80 bg-background/90 shadow-sm transition-all group-hover:border-primary/40 group-hover:shadow-md">
          <CardContent className="flex h-full flex-col justify-between gap-8 p-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  Processo modelo
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-semibold leading-tight text-foreground">
                  Como esta etapa vai funcionar
                </h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {readOnly
                    ? 'Entre no modo de edição para alterar os campos e a sequência de tarefas desta etapa.'
                    : 'Clique para definir os campos e a sequência de tarefas que a equipe deve seguir nessa etapa.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-2xl border border-border/70 bg-accent/20 p-3">
                <p className="text-xs text-muted-foreground">Tarefas</p>
                <p className="mt-1 text-2xl font-semibold text-foreground tabular-nums">
                  {step.tasks.length}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-accent/20 p-3">
                <p className="text-xs text-muted-foreground">Campos</p>
                <p className="mt-1 text-2xl font-semibold text-foreground tabular-nums">
                  {step.fields.length + totalTaskFields}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
