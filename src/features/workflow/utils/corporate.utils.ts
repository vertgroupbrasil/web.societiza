// src/features/corporate/utils/processCalculations.ts

import { Process } from '@workflow/index'; // ajuste o import conforme sua estrutura

export interface ProgressData {
  urgency: 'normal' | 'warning' | 'urgent' | 'critical';
  daysRemaining: number;
  isExpired: boolean;
  progressPercentage: number;
  completedTasks: number;
  totalTasks: number;
  requiredTasks: number;
  completedRequiredTasks: number;
}

export const calculateProgressData = (process: Process): ProgressData => {
  const now = new Date();
  const expireDate = new Date(process.expire_at);
  const diffTime = expireDate?.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let urgency: 'normal' | 'warning' | 'urgent' | 'critical' = 'normal';
  if (daysRemaining < 9) urgency = 'critical';
  else if (daysRemaining <= 23) urgency = 'urgent';
  else if (daysRemaining <= 45) urgency = 'warning';

  const totalTasks = process.tarefas?.length || 0;
  const completedTasks =
    process.tarefas?.filter((t) => t.concluida || t.nao_aplicavel)?.length || 0;
  const requiredTasks =
    process.tarefas?.filter((t) => t.tarefa.obrigatoria)?.length || 0;
  const completedRequiredTasks =
    process.tarefas?.filter(
      (t) => t.tarefa.obrigatoria && (t.concluida || t.nao_aplicavel),
    )?.length || 0;

  return {
    urgency,
    daysRemaining,
    isExpired: daysRemaining < 0,
    progressPercentage:
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    completedTasks,
    totalTasks,
    requiredTasks,
    completedRequiredTasks,
  };
};

export interface TaskStatus {
  total: number;
  completed: number;
  required: number;
  completedRequired: number;
}

export const calculateTaskStatus = (process: Process): TaskStatus => {
  const tarefas = process.tarefas || [];

  return {
    total: tarefas.length,
    completed: tarefas.filter((t) => t.concluida || t.nao_aplicavel).length,
    required: tarefas.filter((t) => t.tarefa.obrigatoria).length,
    completedRequired: tarefas.filter(
      (t) => t.tarefa.obrigatoria && (t.concluida || t.nao_aplicavel),
    ).length,
  };
};

export const formatProcessType = (processTypeDescription: string): string => {
  switch (processTypeDescription) {
    case 'Abertura de empresa': {
      return 'Abertura';
    }
    case 'Alteração contratual com regin': {
      return 'Alteração c/ Regin';
    }
    case 'Alteração contratual sem regin/baixa': {
      return 'Alteração s/ Regin/Baixa';
    }
    default: {
      return processTypeDescription;
    }
  }
};

export const ensureDate = (
  value: Date | string | null | undefined,
): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
};

export const isValidDate = (date: unknown): date is Date => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const isValidUrl = (string: string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const calculateUrgency = (expireDate: Date | string): string => {
  const now = new Date();
  const expire = new Date(expireDate);
  const diffTime = expire.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 9) return 'critical';
  if (diffDays <= 23) return 'urgent';
  if (diffDays <= 45) return 'warning';
  return 'normal';
};
