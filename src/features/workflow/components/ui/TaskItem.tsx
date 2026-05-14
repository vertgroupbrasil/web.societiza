'use client';

import { cn } from '@societiza/lib/utils';

import {
  Button,
  Checkbox,
  DatePicker,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@shadcn/index';

import React from 'react';

import type { TaskLogic, Tasks } from '@workflow/index';

interface TaskItemProps {
  task: Tasks;
  taskLogic: TaskLogic;
  onToggle: (taskId: string, task: Tasks) => void;
  onMarkNA: (taskId: string, task: Tasks) => void;
  getStatusComponent: (task: Tasks) => React.ReactNode;
  onDateChange?: (taskId: string, date: string | null) => void;
  variant: 'full' | 'compact' | 'minimal';
  hideNAButton?: boolean; // ✅ NOVA PROP
}

export const TaskItem = React.memo<TaskItemProps>(
  ({
    task,
    taskLogic,
    onToggle,
    onMarkNA,
    variant,
    onDateChange,
    hideNAButton = false, // ✅ NOVA PROP
  }) => {
    const isBlocked = taskLogic.isTaskBlocked(task.id);
    const canComplete = taskLogic.canCompleteTask(task.id);
    const canMarkNA = taskLogic.canMarkNotApplicable(task.id);
    const blockingTasks = taskLogic.getBlockingTasks(task.id);
    const isAlavara = task.etapa.nome.includes('Alvarás');

    const shouldShowDatePicker = !task.nao_aplicavel && task.concluida;
    const showDatePicker = isAlavara && shouldShowDatePicker;

    const handleDateChange = (date: Date | null) => {
      if (!date) {
        onDateChange?.(task.id, null);
        return;
      }

      if (!(date instanceof Date) || isNaN(date.getTime())) {
        return;
      }

      // ✅ CORREÇÃO: Usar toISOString().split() para evitar timezone
      const formattedDate = date.toISOString().split('T')[0];

      onDateChange?.(task.id, formattedDate);
    };

    return (
      <div className="ml-4 rounded-lg hover:bg-muted/30 transition-all transition-colors duration-200">
        <div className="p-2">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Checkbox
                    checked={task.concluida}
                    disabled={
                      (!canComplete && !task.concluida) || task.nao_aplicavel
                    }
                    onCheckedChange={() => onToggle(task.id, task)}
                    className="h-4 w-4"
                  />
                </TooltipTrigger>
                {isBlocked && !task.concluida && (
                  <TooltipContent>
                    <p>
                      Aguardando conclusão de {blockingTasks.length} tarefa(s)
                      anterior(es)
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            </div>

            <div className="flex-1 min-w-0 items-center">
              <div className="flex items-center gap-3 mb-1">
                {variant !== 'minimal' && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted/70 text-muted-foreground text-xs font-mono font-medium">
                    #{task.sequencia}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'text-sm font-medium leading-relaxed',
                      (task.concluida || task.nao_aplicavel) &&
                        'line-through text-muted-foreground',
                    )}
                  >
                    {task.tarefa.descricao}
                  </p>
                </div>
              </div>

              {showDatePicker && (
                <div className="mt-4 pt-3 border-t border-border/50">
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-muted-foreground">
                      Data de expiração do alvará
                    </label>
                    <div className="max-w-xs">
                      <DatePicker
                        value={task.expire_at || undefined} // ✅ Se já é Date, usar diretamente
                        onChange={handleDateChange}
                        placeholder="Selecione a data de expiração"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-shrink-0">
              {/* ✅ CONDICIONALMENTE ocultar botão N/A */}
              {!task.tarefa.obrigatoria && !hideNAButton && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={!canMarkNA && !task.nao_aplicavel}
                      onClick={() => onMarkNA(task.id, task)}
                      className={cn(
                        'h-8 px-3 text-xs font-medium transition-all duration-200',
                        task.nao_aplicavel &&
                          'bg-primary text-primary-foreground',
                      )}
                    >
                      N/A
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {task.nao_aplicavel
                        ? 'Remover marcação de não aplicável'
                        : 'Marcar como não aplicável'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

TaskItem.displayName = 'TaskItem';
