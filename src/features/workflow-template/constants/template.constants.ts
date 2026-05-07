export const TEMPLATE_STATUS_LABELS = {
  Draft: 'Rascunho',
  Active: 'Ativo',
  Archived: 'Arquivado',
} as const;

export const TEMPLATE_STATUS_COLORS = {
  Draft: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Active: 'bg-green-100 text-green-800 border-green-200',
  Archived: 'bg-gray-100 text-gray-500 border-gray-200',
} as const;

export const FIELD_TYPE_LABELS = {
  Text: 'Texto',
  Select: 'Seleção',
} as const;

export const TASK_TYPE_OPTIONS = [
  { value: 'Manual', label: 'Manual' },
  { value: 'Automatic', label: 'Automática' },
  { value: 'Approval', label: 'Aprovação' },
] as const;

export const TEMPLATE_STALE_TIME = {
  list: 2 * 60 * 1000, // 2 minutos
  detail: 1 * 60 * 1000, // 1 minuto
} as const;
