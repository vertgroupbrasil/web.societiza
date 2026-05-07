'use client';

import {
  Alert,
  AlertDescription,
  Badge,
  Button,
  Separator,
} from '@shadcn/index';
import { RotateCcw } from 'lucide-react';
import { WORKFLOW_PROCESS_TASK_STATUS_LABELS } from '../constants';
import {
  getTaskBlockReason,
  hasDownstreamProgress,
  sortFieldsByOrder,
} from '../lib';
import { WorkflowProcessFieldEditor } from './workflow-process-field-editor';
import type {
  FillWorkflowProcessStepFieldParams,
  FillWorkflowProcessTaskFieldParams,
  WorkflowProcessDetail,
  WorkflowProcessStepInstance,
  WorkflowProcessTaskInstance,
} from '../server/types';

type WorkflowProcessTaskListProps = {
  detail: WorkflowProcessDetail;
  step: WorkflowProcessStepInstance;
  task: WorkflowProcessTaskInstance;
  isCurrentStep: boolean;
  isActionPending: boolean;
  isSavingField: boolean;
  onComplete: () => void;
  onSkip: () => void;
  onRevert: () => void;
  onFieldChange: (
    fieldId: string,
    payload: FillWorkflowProcessStepFieldParams | FillWorkflowProcessTaskFieldParams,
  ) => void;
  pendingFieldValues: Map<string, { value?: string }>;
};

export function WorkflowProcessTaskList({
  detail,
  step,
  task,
  isCurrentStep,
  isActionPending,
  isSavingField,
  onComplete,
  onSkip,
  onRevert,
  onFieldChange,
  pendingFieldValues,
}: WorkflowProcessTaskListProps) {
  const isProcessCompleted = detail.status === 'Completed';
  const isPending = task.status === 'Pending';
  const blockReason = getTaskBlockReason(task, step.tasks);
  const canMutatePendingTask =
    !isProcessCompleted && isCurrentStep && isPending && !blockReason;
  const canRevert =
    (task.status === 'Completed' || task.status === 'Skipped') &&
    !hasDownstreamProgress(step, detail.steps);

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold">{task.title}</h4>
            <Badge variant={task.status === 'Pending' ? 'outline' : 'secondary'}>
              {WORKFLOW_PROCESS_TASK_STATUS_LABELS[task.status]}
            </Badge>
            {task.isOptional ? (
              <Badge variant="outline">Opcional</Badge>
            ) : (
              <Badge variant="outline">Obrigatória</Badge>
            )}
          </div>
          {task.description ? (
            <p className="text-sm text-muted-foreground">{task.description}</p>
          ) : null}
        </div>
      </div>

      {blockReason ? (
        <Alert className="mt-3">
          <AlertDescription>{blockReason}</AlertDescription>
        </Alert>
      ) : null}

      {task.fields.length > 0 ? (
        <>
          <Separator className="my-4" />
          <div className="space-y-3">
            {sortFieldsByOrder(task.fields).map((field) => (
              <WorkflowProcessFieldEditor
                key={field.id}
                field={field}
                value={pendingFieldValues.get(field.id)?.value ?? field.value ?? ''}
                editable={!isProcessCompleted && isCurrentStep}
                isSaving={isSavingField}
                onChange={(newValue) =>
                  onFieldChange(field.id, {
                    processId: detail.id,
                    stepInstanceId: step.id,
                    taskInstanceId: task.id,
                    fieldInstanceId: field.id,
                    value: newValue,
                  })
                }
              />
            ))}
          </div>
        </>
      ) : null}

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        {canRevert ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isActionPending}
            onClick={onRevert}
          >
            <RotateCcw data-icon className="size-4" />
            Reverter
          </Button>
        ) : null}

        {isPending && task.isOptional ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!canMutatePendingTask || isActionPending}
            onClick={onSkip}
          >
            Saltar
          </Button>
        ) : null}

        {isPending ? (
          <Button
            type="button"
            size="sm"
            disabled={!canMutatePendingTask || isActionPending}
            onClick={onComplete}
          >
            Concluir
          </Button>
        ) : null}
      </div>
    </div>
  );
}
