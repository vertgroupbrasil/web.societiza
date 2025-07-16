export const CORPORATE_COLORS = {
  progress: {
    safe: '#10b981', // green-500
    warning: '#f59e0b', // amber-500
    urgent: '#f97316', // orange-500
    critical: '#ef4444', // red-500
  },
  task: {
    completed: '#10b981', // green-500
    pending: '#6b7280', // gray-500
    blocked: '#9ca3af', // gray-400
    notApplicable: '#8b5cf6', // violet-500
  },
  stage: {
    documentacao: '#3b82f6', // blue-500
    junta: '#8b5cf6', // violet-500
    receita: '#10b981', // green-500
    licencas: '#f59e0b', // amber-500
    finalizacao: '#ef4444', // red-500
  },
} as const;

export const CORPORATE_QUERY_KEYS = {
  all: ['corporates'] as const,
  stages: () => [...CORPORATE_QUERY_KEYS.all, 'stages'] as const,
  stageById: (id: string) => [...CORPORATE_QUERY_KEYS.stages(), id] as const,
  processTypes: () => [...CORPORATE_QUERY_KEYS.all, 'process-types'] as const,
  processTypeById: (id: string) =>
    [...CORPORATE_QUERY_KEYS.processTypes(), id] as const,
  processes: () => [...CORPORATE_QUERY_KEYS.all, 'processes'] as const,
  processesByStages: () =>
    [...CORPORATE_QUERY_KEYS.processes(), 'by-stages'] as const,
  processById: (id: string) =>
    [...CORPORATE_QUERY_KEYS.processes(), id] as const,
} as const;

export const CORPORATE_URGENCY_THRESHOLDS = {
  critical: 0.9, // 75% do tempo expirado
  urgent: 0.75, // 50% do tempo expirado
  warning: 0.5, // 25% do tempo expirado
  safe: 0, // 0% do tempo expirado
} as const;

export const CORPORATE_FILTER_OPTIONS = {
  processTypes: [
    { value: 'abertura', label: 'Abertura' },
    { value: 'alteracao', label: 'Alteração' },
    { value: 'baixa', label: 'Baixa' },
  ],
  urgencyLevels: [
    {
      value: 'critical',
      label: 'Crítico',
      color: CORPORATE_COLORS.progress.critical,
    },
    {
      value: 'urgent',
      label: 'Urgente',
      color: CORPORATE_COLORS.progress.urgent,
    },
    {
      value: 'warning',
      label: 'Atenção',
      color: CORPORATE_COLORS.progress.warning,
    },
    { value: 'safe', label: 'Normal', color: CORPORATE_COLORS.progress.safe },
  ],
  taskStatus: [
    {
      value: 'completed',
      label: 'Concluídas',
      color: CORPORATE_COLORS.task.completed,
    },
    {
      value: 'pending',
      label: 'Pendentes',
      color: CORPORATE_COLORS.task.pending,
    },
    {
      value: 'overdue',
      label: 'Em Atraso',
      color: CORPORATE_COLORS.progress.critical,
    },
  ],
} as const;

export const CORPORATE_DEBOUNCE_MS = {
  search: 300,
  filter: 150,
  resize: 250,
} as const;

export const CORPORATE_CACHE_TIME = {
  stages: 1000 * 60 * 30, // 30 minutos
  processTypes: 1000 * 60 * 30, // 30 minutos
  processes: 1000 * 60 * 5, // 5 minutos
  processDetails: 1000 * 60 * 2, // 2 minutos
} as const;

export const CORPORATE_STALE_TIME = {
  stages: 1000 * 60 * 15, // 15 minutos
  processTypes: 1000 * 60 * 15, // 15 minutos
  processes: 1000 * 60 * 2, // 2 minutos
  processDetails: 1000 * 60 * 1, // 1 minuto
} as const;

export const DEFAULT_DEBOUNCE_TIME = 300;

export const FORM_URL = 'https://flowtec.dev/forms/';
