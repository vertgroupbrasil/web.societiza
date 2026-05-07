'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Checkbox,
  Drawer,
  DrawerContent,
  DialogTitle,
  Progress,
  ScrollArea,
  Separator,
  Skeleton,
} from '@shadcn/index';
import {
  AlertCircle,
  Building,
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
} from 'lucide-react';
import {
  WORKFLOW_PROCESS_STATUS_LABELS,
  WORKFLOW_PROCESS_TYPE_LABELS,
} from '../constants';
import {
  getCurrentStep,
  sortFieldsByOrder,
  sortStepsByOrder,
  sortTasksByOrder,
} from '../lib';
import {
  useCompleteWorkflowProcessTask,
  useFillWorkflowProcessStepField,
  useFillWorkflowProcessTaskField,
  useRevertWorkflowProcessTask,
  useSkipWorkflowProcessTask,
} from '../hooks/mutations';
import { useWorkflowProcessDetail } from '../hooks/queries';
import { WorkflowProcessFieldEditor } from './workflow-process-field-editor';
import type {
  FillWorkflowProcessStepFieldParams,
  FillWorkflowProcessTaskFieldParams,
  WorkflowProcessDetail,
  WorkflowProcessStepInstance,
  WorkflowProcessTaskInstance,
} from '../server/types';

type WorkflowProcessDrawerProps = {
  processId: string | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type TaskRowProps = {
  detail: WorkflowProcessDetail;
  step: WorkflowProcessStepInstance;
  task: WorkflowProcessTaskInstance;
  isCurrentStep: boolean;
  isActionPending: boolean;
  isSavingField: boolean;
  onComplete: () => void;
  onSkip: () => void;
  onRevert: () => void;
  onSaveTaskField: (
    payload:
      | FillWorkflowProcessStepFieldParams
      | FillWorkflowProcessTaskFieldParams,
  ) => void;
};

function TaskRow({
  detail,
  step,
  task,
  isCurrentStep,
  isActionPending,
  isSavingField,
  onComplete,
  onSkip,
  onRevert,
  onSaveTaskField,
}: TaskRowProps) {
  const isProcessCompleted = detail.status === 'Completed';
  const isDone =
    task.status === 'Completed' || task.status === 'Skipped';
  const isPending = task.status === 'Pending';
  const canAct = !isProcessCompleted && isCurrentStep && !isActionPending;

  const handleCheckboxChange = () => {
    if (!canAct) return;
    if (isDone) {
      onRevert();
    } else {
      onComplete();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 py-2 px-1">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Checkbox
            checked={isDone}
            onCheckedChange={handleCheckboxChange}
            disabled={!canAct && !isDone}
            className="flex-shrink-0"
          />
          <span
            className={`text-sm leading-snug ${
              isDone ? 'line-through text-muted-foreground' : 'text-foreground'
            }`}
          >
            {task.title}
          </span>
        </div>
        {isPending && task.isOptional && canAct && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-shrink-0 h-7 text-xs"
            disabled={isActionPending}
            onClick={onSkip}
          >
            Saltar
          </Button>
        )}
      </div>

      {/* Task fields */}
      {task.fields.length > 0 && !isDone && isCurrentStep && (
        <div className="ml-7 space-y-2">
          {sortFieldsByOrder(task.fields).map((field) => (
            <WorkflowProcessFieldEditor
              key={field.id}
              field={field}
              editable={canAct}
              isSaving={isSavingField}
              onSave={onSaveTaskField}
              payloadBase={{
                processId: detail.id,
                stepInstanceId: step.id,
                taskInstanceId: task.id,
                fieldInstanceId: field.id,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function WorkflowProcessDrawer({
  processId,
  open,
  onOpenChange,
}: WorkflowProcessDrawerProps) {
  const {
    data: detail,
    isLoading,
    isError,
    refetch,
  } = useWorkflowProcessDetail(processId, open);

  const completeTask = useCompleteWorkflowProcessTask();
  const skipTask = useSkipWorkflowProcessTask();
  const revertTask = useRevertWorkflowProcessTask();
  const fillStepField = useFillWorkflowProcessStepField();
  const fillTaskField = useFillWorkflowProcessTaskField();

  const [collapsedSteps, setCollapsedSteps] = useState<Set<string>>(new Set());

  const currentStep = detail ? getCurrentStep(detail) : undefined;
  const isTaskActionPending =
    completeTask.isPending || skipTask.isPending || revertTask.isPending;
  const isSavingField = fillStepField.isPending || fillTaskField.isPending;

  const processStats = useMemo(() => {
    if (!detail) return { totalTasks: 0, completedTasks: 0, progress: 0 };
    const allTasks = detail.steps.flatMap((s) => s.tasks);
    const completedTasks = allTasks.filter(
      (t) => t.status === 'Completed' || t.status === 'Skipped',
    ).length;
    const totalTasks = allTasks.length;
    const progress =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    return { totalTasks, completedTasks, progress };
  }, [detail]);

  const toggleStep = useCallback((stepId: string) => {
    setCollapsedSteps((prev) => {
      const next = new Set(prev);
      next.has(stepId) ? next.delete(stepId) : next.add(stepId);
      return next;
    });
  }, []);

  const handleSaveStepField = (
    payload:
      | FillWorkflowProcessStepFieldParams
      | FillWorkflowProcessTaskFieldParams,
  ) => fillStepField.mutate(payload);

  const handleSaveTaskField = (
    payload:
      | FillWorkflowProcessStepFieldParams
      | FillWorkflowProcessTaskFieldParams,
  ) => {
    if ('taskInstanceId' in payload && payload.taskInstanceId) {
      fillTaskField.mutate(payload);
    }
  };

  const daysElapsed = detail
    ? Math.ceil(
        (Date.now() - new Date(detail.createdAt).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : 0;

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DialogTitle className="sr-only">
        {detail?.targetClient ?? 'Processo societário'}
      </DialogTitle>

      <DrawerContent className="sm:max-w-lg w-full h-full flex flex-col">
        {isLoading ? (
          <div className="p-6 space-y-4 flex-1">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : isError ? (
          <div className="p-6 flex flex-col items-center gap-4 flex-1">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-muted-foreground text-center">
              Não foi possível carregar o processo.
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </div>
        ) : detail ? (
          <>
            {/* Scrollable content */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {/* Header */}
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      <Building className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-lg font-bold text-foreground leading-tight">
                      {detail.targetClient}
                    </h1>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-xs">
                        {WORKFLOW_PROCESS_TYPE_LABELS[detail.processType]}
                      </Badge>
                      <Badge
                        variant={
                          detail.status === 'Completed' ? 'secondary' : 'default'
                        }
                        className="text-xs"
                      >
                        {WORKFLOW_PROCESS_STATUS_LABELS[detail.status]}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/20">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs font-medium">Dias corridos</span>
                    </div>
                    <p className="text-lg font-bold">{daysElapsed}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span className="text-xs font-medium">Tipo de processo</span>
                    </div>
                    <p className="text-sm font-semibold">
                      {WORKFLOW_PROCESS_TYPE_LABELS[detail.processType]}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs font-medium">Data de início</span>
                    </div>
                    <p className="text-sm font-semibold">
                      {new Date(detail.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs font-medium">
                        {detail.status === 'Completed'
                          ? 'Data de conclusão'
                          : 'Status'}
                      </span>
                    </div>
                    <p className="text-sm font-semibold">
                      {detail.status === 'Completed' && detail.completedAt
                        ? new Date(detail.completedAt).toLocaleDateString('pt-BR')
                        : 'Em andamento'}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Progresso</span>
                    <span className="text-xs font-medium">
                      {processStats.progress}%
                    </span>
                  </div>
                  <Progress value={processStats.progress} className="h-2" />
                </div>

                <Separator />

                {/* Tasks section header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold">Tarefas</h2>
                  <Badge variant="outline" className="text-xs">
                    {processStats.completedTasks} de {processStats.totalTasks}
                  </Badge>
                </div>

                {/* Step accordions */}
                <div className="space-y-3">
                  {sortStepsByOrder(detail.steps).map((step, idx) => {
                    const isCollapsed = collapsedSteps.has(step.id);
                    const isCurrent = step.id === currentStep?.id;
                    const isEditableStep =
                      detail.status !== 'Completed' && isCurrent;
                    const stepDone = step.tasks.filter(
                      (t) =>
                        t.status === 'Completed' || t.status === 'Skipped',
                    ).length;
                    const stepTotal = step.tasks.length;

                    return (
                      <div key={step.id} className="border rounded-xl overflow-hidden">
                        {/* Accordion header */}
                        <button
                          type="button"
                          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/40 transition-colors"
                          onClick={() => toggleStep(step.id)}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className="text-muted-foreground flex-shrink-0">
                              {isCollapsed ? (
                                <ChevronRight className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </span>
                            <span className="text-sm font-medium truncate">
                              {idx + 1}. {step.title}
                            </span>
                            {isCurrent && (
                              <Badge className="flex-shrink-0 text-xs">
                                Atual
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
                            {stepDone}/{stepTotal}
                          </span>
                        </button>

                        {/* Accordion content */}
                        {!isCollapsed && (
                          <div className="border-t px-4 py-2 space-y-1">
                            {/* Step fields */}
                            {step.fields.length > 0 && (
                              <div className="py-2 space-y-2">
                                {sortFieldsByOrder(step.fields).map((field) => (
                                  <WorkflowProcessFieldEditor
                                    key={field.id}
                                    field={field}
                                    editable={isEditableStep}
                                    isSaving={isSavingField}
                                    onSave={handleSaveStepField}
                                    payloadBase={{
                                      processId: detail.id,
                                      stepInstanceId: step.id,
                                      fieldInstanceId: field.id,
                                    }}
                                  />
                                ))}
                                {step.tasks.length > 0 && (
                                  <Separator className="mt-2" />
                                )}
                              </div>
                            )}

                            {/* Task rows */}
                            {sortTasksByOrder(step.tasks).map((task) => (
                              <TaskRow
                                key={task.id}
                                detail={detail}
                                step={step}
                                task={task}
                                isCurrentStep={isCurrent}
                                isActionPending={isTaskActionPending}
                                isSavingField={isSavingField}
                                onComplete={() =>
                                  completeTask.mutate({
                                    processId: detail.id,
                                    stepInstanceId: step.id,
                                    taskInstanceId: task.id,
                                  })
                                }
                                onSkip={() =>
                                  skipTask.mutate({
                                    processId: detail.id,
                                    stepInstanceId: step.id,
                                    taskInstanceId: task.id,
                                  })
                                }
                                onRevert={() =>
                                  revertTask.mutate({
                                    processId: detail.id,
                                    stepInstanceId: step.id,
                                    taskInstanceId: task.id,
                                  })
                                }
                                onSaveTaskField={handleSaveTaskField}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>

            {/* Fixed footer */}
            <div className="border-t bg-background/95 backdrop-blur-sm p-4 flex-shrink-0">
              <Button
                variant="default"
                effect="shineHover"
                className="w-full"
                onClick={() => onOpenChange(false)}
              >
                Salvar alterações
              </Button>
            </div>
          </>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}
