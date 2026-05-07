import type { WorkflowProcessFieldType, WorkflowProcessStatus, WorkflowProcessTaskStatus, WorkflowProcessType } from '../server/types';

export const WORKFLOW_PROCESS_TYPE_LABELS: Record<WorkflowProcessType, string> = {
  Abertura: 'Abertura',
  Alteracao: 'Alteração',
  Baixa: 'Baixa',
};

export const WORKFLOW_PROCESS_TYPE_OPTIONS: { value: WorkflowProcessType; label: string }[] = [
  { value: 'Abertura', label: 'Abertura' },
  { value: 'Alteracao', label: 'Alteração' },
  { value: 'Baixa', label: 'Baixa' },
];

export const WORKFLOW_PROCESS_STATUS_LABELS: Record<WorkflowProcessStatus, string> = {
  InProgress: 'Em andamento',
  Completed: 'Concluído',
};

export const WORKFLOW_PROCESS_TASK_STATUS_LABELS: Record<WorkflowProcessTaskStatus, string> = {
  Pending: 'Pendente',
  Completed: 'Concluída',
  Skipped: 'Ignorada',
};

export const WORKFLOW_PROCESS_FIELD_TYPE_LABELS: Record<WorkflowProcessFieldType, string> = {
  Text: 'Texto',
  Boolean: 'Sim/Não',
  Integer: 'Número',
  Select: 'Seleção',
  Date: 'Data',
};
