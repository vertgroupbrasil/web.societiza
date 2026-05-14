import type {
  TemplateStatus,
  WorkflowTemplateDetail,
} from '../server/types/template.types';

type UserRole = 'SystemAdmin' | 'AccountancyAdmin' | 'AccountancyEmployee';

export const canManageTemplates = (role: UserRole | undefined): boolean =>
  role === 'SystemAdmin';

export const isTemplateEditable = (
  status: TemplateStatus | undefined,
): boolean => status === 'Draft';

export const canArchiveTemplate = (
  status: TemplateStatus | undefined,
  role: UserRole | undefined,
): boolean => canManageTemplates(role) && status === 'Active';

export const canUpdateTemplateMetadata = (
  status: TemplateStatus | undefined,
  role: UserRole | undefined,
): boolean => canManageTemplates(role) && status !== 'Archived';

export const getTemplateActivationBlockReason = (
  template: WorkflowTemplateDetail,
): string | null => {
  if (template.status !== 'Draft') return 'Apenas rascunhos podem ser ativados.';
  if (template.steps.length === 0) {
    return 'Adicione ao menos uma etapa antes de ativar.';
  }
  if (template.steps.some((step) => step.tasks.length === 0)) {
    return 'Cada etapa precisa ter ao menos uma tarefa antes de ativar.';
  }
  return null;
};

export const canActivateTemplate = (
  template: WorkflowTemplateDetail,
  role: UserRole | undefined,
): boolean =>
  canManageTemplates(role) && getTemplateActivationBlockReason(template) === null;
