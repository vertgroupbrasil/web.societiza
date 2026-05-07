export const TEMPLATE_STATUS_LABELS = {
  Draft: 'Rascunho',
  Active: 'Ativo',
  Archived: 'Arquivado',
} as const;

export const TEMPLATE_STATUS_COLORS = {
  Draft: '',
  Active: '',
  Archived: '',
} as const;

export const FIELD_TYPE_LABELS = {
  Text: 'Texto',
  Boolean: 'Sim ou não',
  Integer: 'Número inteiro',
  Select: 'Seleção',
  Date: 'Data',
} as const;

export const FIELD_TYPE_OPTIONS = [
  { value: 'Text', label: 'Texto' },
  { value: 'Boolean', label: 'Sim ou não' },
  { value: 'Integer', label: 'Número inteiro' },
  { value: 'Select', label: 'Seleção' },
  { value: 'Date', label: 'Data' },
] as const;

export const TASK_TYPE_OPTIONS = [
  { value: 'Manual', label: 'Manual' },
  { value: 'Automatic', label: 'Automática' },
  { value: 'Approval', label: 'Aprovação' },
] as const;

export const TEMPLATE_STALE_TIME = {
  list: 2 * 60 * 1000, // 2 minutos
  detail: 1 * 60 * 1000, // 1 minuto
} as const;
