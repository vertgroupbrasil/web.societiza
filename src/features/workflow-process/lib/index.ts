import type { WorkflowProcessBoardItem } from '../server/types';
import type {
  WorkflowProcessDetail,
  WorkflowProcessStepField,
  WorkflowProcessStepInstance,
  WorkflowProcessStepStatus,
  WorkflowProcessTaskInstance,
} from '../server/types';

export type WorkflowProcessColumn = {
  title: string;
  items: WorkflowProcessBoardItem[];
};

export function getProgressPercentage(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function parseFieldOptions(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export function getCurrentStep(
  detail: WorkflowProcessDetail,
): WorkflowProcessStepInstance | undefined {
  return (
    detail.steps.find((s: WorkflowProcessStepInstance) => s.status === 'InProgress') ??
    detail.steps.find((s: WorkflowProcessStepInstance) => s.status === 'NotStarted') ??
    detail.steps[detail.steps.length - 1]
  );
}

export function sortStepsByOrder(
  steps: WorkflowProcessStepInstance[],
): WorkflowProcessStepInstance[] {
  return [...steps].sort((a: WorkflowProcessStepInstance, b: WorkflowProcessStepInstance) => a.order - b.order);
}

export function sortTasksByOrder(
  tasks: WorkflowProcessTaskInstance[],
): WorkflowProcessTaskInstance[] {
  return [...tasks].sort((a: WorkflowProcessTaskInstance, b: WorkflowProcessTaskInstance) => a.order - b.order);
}

export function sortFieldsByOrder(
  fields: WorkflowProcessStepField[],
): WorkflowProcessStepField[] {
  return [...fields].sort((a: WorkflowProcessStepField, b: WorkflowProcessStepField) => a.order - b.order);
}

export function getTaskBlockReason(
  task: WorkflowProcessTaskInstance,
  allTasks: WorkflowProcessTaskInstance[],
): string | null {
  const sortedTasks = sortTasksByOrder(allTasks);
  const taskIndex = sortedTasks.findIndex((t) => t.id === task.id);
  for (let i = 0; i < taskIndex; i++) {
    const prior = sortedTasks[i];
    if (!prior.isOptional && prior.status === 'Pending') {
      return `Conclua "${prior.title}" primeiro.`;
    }
  }
  return null;
}

export function hasDownstreamProgress(
  step: WorkflowProcessStepInstance,
  allSteps: WorkflowProcessStepInstance[],
): boolean {
  const sortedSteps = sortStepsByOrder(allSteps);
  const stepIndex = sortedSteps.findIndex((s) => s.id === step.id);
  const progressStatuses: WorkflowProcessStepStatus[] = ['InProgress', 'Completed'];
  return sortedSteps
    .slice(stepIndex + 1)
    .some((s) => progressStatuses.includes(s.status));
}
