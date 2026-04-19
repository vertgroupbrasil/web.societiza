'use client';

import { Button, Separator } from '@shadcn/index';
import { Check, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { PlanBadge } from './ui/PlanBadge';
import { PlanUsageBar } from './ui/PlanUsageBar';
import { PLAN_LIMITS, PLAN_LABELS } from '../constants/plans.constants';
import { useOfficeById } from '../hooks/queries/useOfficeQueries';
import type { OfficePlan } from '../schemas/office.schema';

interface OfficePlanScreenProps {
  officeId: string;
}

const PLAN_FEATURES: Record<OfficePlan, string[]> = {
  Free: [
    '5 processos criados',
    '1 membro (só o owner)',
    '1 escritório próprio',
    'Templates ilimitados (1 ativo por vez)',
    'Rastreamento de processo incluso',
    'Identidade completa do escritório',
  ],
  Escrivaninha: [
    '50 processos criados',
    'Até 3 membros',
    '1 escritório próprio premium',
    'Múltiplos templates ativos',
    'Automações de workflow',
    'Convite por e-mail e por link',
  ],
  Executivo: [
    '200 processos por escritório',
    'Até 8 membros por escritório',
    'Até 3 escritórios próprios premium',
    'Múltiplos templates ativos',
    'Automações de workflow',
    'Convite por e-mail e por link',
  ],
};

const PLANS_ORDER: OfficePlan[] = ['Free', 'Escrivaninha', 'Executivo'];

export function OfficePlanScreen({ officeId }: OfficePlanScreenProps) {
  const { data: office, isLoading, error } = useOfficeById(officeId);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-40 bg-muted rounded" />
        <div className="h-24 w-full bg-muted rounded" />
      </div>
    );
  }

  if (error || !office) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm">
        Não foi possível carregar os dados do plano.
      </div>
    );
  }

  const limits = PLAN_LIMITS[office.plan];

  const handleUpgrade = (plan: OfficePlan) => {
    // TODO: integrar com processador de pagamento (Stripe / Pagar.me / Iugu)
    toast.info(`Upgrade para ${PLAN_LABELS[plan]} em breve!`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold">Plano e uso</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie o plano do seu escritório e acompanhe o uso.
        </p>
      </div>

      {/* Card do plano atual */}
      <div className="rounded-lg border p-5 space-y-4 bg-muted/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Plano atual</span>
              <PlanBadge plan={office.plan} />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {office.isOwner
                ? 'Você é o owner deste escritório'
                : 'O owner gerencia o plano'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <PlanUsageBar
            label="Processos criados"
            current={office.processCount}
            max={limits.maxProcesses}
          />
          <PlanUsageBar
            label="Membros"
            current={office.memberCount}
            max={limits.maxMembers}
          />
        </div>
      </div>

      <Separator />

      {/* Comparativo de planos */}
      <div>
        <h2 className="text-base font-medium mb-4">Comparar planos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLANS_ORDER.map((plan) => {
            const isCurrentPlan = plan === office.plan;
            const isUpgrade =
              PLANS_ORDER.indexOf(plan) > PLANS_ORDER.indexOf(office.plan);
            const features = PLAN_FEATURES[plan];

            return (
              <div
                key={plan}
                className={`rounded-lg border p-4 space-y-4 ${
                  isCurrentPlan
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'bg-card'
                }`}
              >
                <div className="flex items-center justify-between">
                  <PlanBadge plan={plan} />
                  {isCurrentPlan && (
                    <span className="text-xs text-primary font-medium">
                      Atual
                    </span>
                  )}
                </div>

                <ul className="space-y-1.5">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-xs text-muted-foreground leading-tight">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {office.isOwner && isUpgrade && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5"
                    onClick={() => handleUpgrade(plan)}
                    aria-label={`Fazer upgrade para ${PLAN_LABELS[plan]}`}
                  >
                    <Zap className="h-3.5 w-3.5" />
                    Fazer upgrade
                  </Button>
                )}

                {isCurrentPlan && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full cursor-default text-muted-foreground"
                    disabled
                  >
                    Plano atual
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          * Preços a anunciar. Membros da lista de espera têm condições
          especiais.
        </p>
      </div>
    </div>
  );
}
