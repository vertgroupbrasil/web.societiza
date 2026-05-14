import type { WorkflowTemplateStep } from '../server/types/template.types';

function normalizeTitle(value: string) {
  return value.trim().toLocaleLowerCase();
}

export function findDuplicateStepTitles(steps: WorkflowTemplateStep[]) {
  const seen = new Map<string, string>();
  const duplicates = new Set<string>();

  for (const step of steps) {
    const normalized = normalizeTitle(step.title);
    if (!normalized) continue;

    if (seen.has(normalized)) {
      duplicates.add(step.title.trim());
      duplicates.add(seen.get(normalized)!);
      continue;
    }

    seen.set(normalized, step.title.trim());
  }

  return [...duplicates];
}

export function getDuplicateStepTitleError(
  steps: WorkflowTemplateStep[],
  nextTitle?: string,
  currentStepId?: string,
) {
  const duplicates = findDuplicateStepTitles(
    steps.map((step) =>
      step.id !== currentStepId || !nextTitle
        ? step
        : {
            ...step,
            title: nextTitle,
          },
    ),
  );

  if (duplicates.length === 0) return null;

  return `Existem etapas com o mesmo nome: ${duplicates.join(', ')}. Cada etapa precisa ter um nome único para publicar o workflow.`;
}
