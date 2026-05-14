import type {
  WorkflowProcessDetail,
  WorkflowProcessStepField,
  WorkflowProcessStepGroupItem,
  WorkflowProcessStepInstance,
  WorkflowProcessTaskField,
  WorkflowProcessTaskInstance,
} from '../server/types';

export type WorkflowProcessColumn = {
  title: string;
  order: number;
  items: WorkflowProcessStepGroupItem[];
};

export const getProgressPercentage = (
  completedSteps: number,
  totalSteps: number,
): number => {
  if (totalSteps <= 0) return 0;
  return Math.round((completedSteps / totalSteps) * 100);
};

export const getCurrentStep = (
  detail: WorkflowProcessDetail,
): WorkflowProcessStepInstance | undefined => {
  return (
    detail.steps.find((step) => step.status === 'InProgress') ??
    detail.steps.find((step) => step.status !== 'Completed') ??
    detail.steps.at(-1)
  );
};

export const sortStepsByOrder = (
  steps: WorkflowProcessStepInstance[],
): WorkflowProcessStepInstance[] => {
  return [...steps].sort((a, b) => a.order - b.order);
};

export const sortTasksByOrder = (
  tasks: WorkflowProcessTaskInstance[],
): WorkflowProcessTaskInstance[] => {
  return [...tasks].sort((a, b) => a.order - b.order);
};

export const sortFieldsByOrder = <
  T extends WorkflowProcessStepField | WorkflowProcessTaskField,
>(
  fields: T[],
): T[] => {
  return [...fields].sort((a, b) => a.order - b.order);
};

export const parseFieldOptions = (options: string | null): string[] => {
  if (!options) return [];

  try {
    const parsed: unknown = JSON.parse(options);
    return Array.isArray(parsed)
      ? parsed.filter((option): option is string => typeof option === 'string')
      : [];
  } catch {
    return options
      .split(',')
      .map((option) => option.trim())
      .filter(Boolean);
  }
};

export const hasDownstreamProgress = (
  step: WorkflowProcessStepInstance,
  allSteps: WorkflowProcessStepInstance[],
): boolean => {
  return allSteps.some(
    (candidate) =>
      candidate.order > step.order && candidate.status !== 'NotStarted',
  );
};

export const getTaskBlockReason = (
  task: WorkflowProcessTaskInstance,
  tasks: WorkflowProcessTaskInstance[],
): string | null => {
  const previousRequiredTask = tasks.find(
    (candidate) => candidate.order === task.order - 1 && !candidate.isOptional,
  );

  if (
    previousRequiredTask &&
    previousRequiredTask.status !== 'Completed' &&
    previousRequiredTask.status !== 'Skipped'
  ) {
    return `Conclua ou salte a tarefa obrigatória anterior: ${previousRequiredTask.title}.`;
  }

  return null;
};
