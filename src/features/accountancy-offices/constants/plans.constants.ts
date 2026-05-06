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
    bg: '#f6ede3',
    text: '#7d6657',
    border: '#e8d7c6',
  },
  Escrivaninha: {
    bg: '#fff1df',
    text: '#c85b13',
    border: '#f0c59c',
  },
  Executivo: {
    bg: '#ffe6cf',
    text: '#aa4e12',
    border: '#e9bc93',
  },
};
