'use client';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@shadcn/index';
import { cn } from '@societiza/lib/utils';
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
      <div className="flex flex-col gap-6">
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-72 w-full rounded-lg" />
      </div>
    );
  }

  if (error || !office) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          Não foi possível carregar os dados do plano.
        </CardContent>
      </Card>
    );
  }

  const limits = PLAN_LIMITS[office.plan];

  const handleUpgrade = (plan: OfficePlan) => {
    // TODO: integrar com processador de pagamento (Stripe / Pagar.me / Iugu)
    toast.info(`Upgrade para ${PLAN_LABELS[plan]} em breve!`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Plano e uso</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie o plano do seu escritório e acompanhe o uso.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plano atual</CardTitle>
          <CardDescription>
            {office.isOwner
              ? 'Você gerencia o plano deste escritório.'
              : 'O owner gerencia o plano deste escritório.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <PlanBadge plan={office.plan} />
              <span className="text-sm text-muted-foreground">
                {PLAN_LABELS[office.plan]}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comparar planos</CardTitle>
          <CardDescription>
            Veja quais limites e recursos cada plano libera para o escritório.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {PLANS_ORDER.map((plan) => {
              const isCurrentPlan = plan === office.plan;
              const isUpgrade =
                PLANS_ORDER.indexOf(plan) > PLANS_ORDER.indexOf(office.plan);
              const features = PLAN_FEATURES[plan];

              return (
                <div
                  key={plan}
                  className={cn(
                    'flex flex-col gap-4 rounded-lg border p-4',
                    isCurrentPlan &&
                      'border-primary bg-primary/5 ring-1 ring-primary',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <PlanBadge plan={plan} />
                    {isCurrentPlan && (
                      <span className="text-xs font-medium text-primary">
                        Atual
                      </span>
                    )}
                  </div>

                  <ul className="flex flex-col gap-1.5">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        <span className="text-xs leading-tight text-muted-foreground">
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

          <p className="text-center text-xs text-muted-foreground">
            * Preços a anunciar. Membros da lista de espera têm condições
            especiais.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
