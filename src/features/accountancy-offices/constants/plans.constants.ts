import type { OfficePlan } from '../schemas/office.schema';

export type PlanLimits = {
  maxProcesses: number;
  maxMembers: number;
  maxOwnedOffices: number;
  maxTotalOffices: number;
  canInviteMembers: boolean;
  canUseInviteLink: boolean;
  canHaveMultipleActiveTemplates: boolean;
  canUseAutomations: boolean;
};

export const PLAN_LIMITS: Record<OfficePlan, PlanLimits> = {
  Free: {
    maxProcesses: 5,
    maxMembers: 1,
    maxOwnedOffices: 1,
    maxTotalOffices: 2,
    canInviteMembers: false,
    canUseInviteLink: false,
    canHaveMultipleActiveTemplates: false,
    canUseAutomations: false,
  },
  Escrivaninha: {
    maxProcesses: 50,
    maxMembers: 3,
    maxOwnedOffices: 1,
    maxTotalOffices: 3,
    canInviteMembers: true,
    canUseInviteLink: true,
    canHaveMultipleActiveTemplates: true,
    canUseAutomations: true,
  },
  Executivo: {
    maxProcesses: 200,
    maxMembers: 8,
    maxOwnedOffices: 3,
    maxTotalOffices: 5,
    canInviteMembers: true,
    canUseInviteLink: true,
    canHaveMultipleActiveTemplates: true,
    canUseAutomations: true,
  },
};

export const PLAN_LABELS: Record<OfficePlan, string> = {
  Free: 'Grátis',
  Escrivaninha: 'Escrivaninha',
  Executivo: 'Executivo',
};

export const PLAN_COLORS: Record<
  OfficePlan,
  { bg: string; text: string; border: string }
> = {
  Free: {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
  },
  Escrivaninha: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  Executivo: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
};
