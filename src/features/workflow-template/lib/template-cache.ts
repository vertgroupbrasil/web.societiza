import type { QueryClient } from '@tanstack/react-query';
import { templateQueries } from '../hooks/queries/query-options';
import type {
  WorkflowTemplateDetail,
  WorkflowTemplateField,
  WorkflowTemplateStep,
  WorkflowTemplateTask,
} from '../server/types/template.types';

export function updateTemplateDetailCache(
  queryClient: QueryClient,
  templateId: string,
  updater: (template: WorkflowTemplateDetail) => WorkflowTemplateDetail,
) {
  const queryKey = templateQueries.detail(templateId).queryKey;
  const previous = queryClient.getQueryData<WorkflowTemplateDetail>(queryKey);

  if (previous) {
    queryClient.setQueryData<WorkflowTemplateDetail>(queryKey, updater(previous));
  }

  return { queryKey, previous };
}

export function restoreTemplateDetailCache(
  queryClient: QueryClient,
  templateId: string,
  previous?: WorkflowTemplateDetail,
) {
  if (!previous) return;

  queryClient.setQueryData(templateQueries.detail(templateId).queryKey, previous);
}

export function replaceStepInTemplate(
  template: WorkflowTemplateDetail,
  matcher: (step: WorkflowTemplateStep) => boolean,
  replacement: WorkflowTemplateStep,
) {
  return {
    ...template,
    steps: template.steps.map((step) => (matcher(step) ? replacement : step)),
  };
}

export function replaceTaskInTemplate(
  template: WorkflowTemplateDetail,
  stepId: string,
  matcher: (task: WorkflowTemplateTask) => boolean,
  replacement: WorkflowTemplateTask,
) {
  return {
    ...template,
    steps: template.steps.map((step) =>
      step.id !== stepId
        ? step
        : {
            ...step,
            tasks: step.tasks.map((task) => (matcher(task) ? replacement : task)),
          },
    ),
  };
}

export function replaceStepFieldInTemplate(
  template: WorkflowTemplateDetail,
  stepId: string,
  matcher: (field: WorkflowTemplateField) => boolean,
  replacement: WorkflowTemplateField,
) {
  return {
    ...template,
    steps: template.steps.map((step) =>
      step.id !== stepId
        ? step
        : {
            ...step,
            fields: step.fields.map((field) =>
              matcher(field) ? replacement : field,
            ),
          },
    ),
  };
}

export function replaceTaskFieldInTemplate(
  template: WorkflowTemplateDetail,
  stepId: string,
  taskId: string,
  matcher: (field: WorkflowTemplateField) => boolean,
  replacement: WorkflowTemplateField,
) {
  return {
    ...template,
    steps: template.steps.map((step) =>
      step.id !== stepId
        ? step
        : {
            ...step,
            tasks: step.tasks.map((task) =>
              task.id !== taskId
                ? task
                : {
                    ...task,
                    fields: task.fields.map((field) =>
                      matcher(field) ? replacement : field,
                    ),
                  },
            ),
          },
    ),
  };
}
