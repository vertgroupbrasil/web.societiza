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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@societiza/components/ui/shadcnui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@societiza/components/ui/shadcnui/dialog';
import { Input } from '@societiza/components/ui/shadcnui/input';
import {
  CalendarClock,
  CreditCard,
  Crown,
  MessageSquareMore,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
} from 'lucide-react';
import { toast } from 'sonner';
import { PLAN_LABELS } from '../constants/plans.constants';
import { useMyOffice } from '../hooks/queries/useOfficeQueries';
import type { OfficePlan } from '../schemas/office.schema';

type BillingPlanMeta = {
  priceLabel: string;
  renewalLabel: string;
  description: string;
};

const PLAN_META: Record<OfficePlan, BillingPlanMeta> = {
  Free: {
    priceLabel: 'R$0/mês',
    renewalLabel: 'Sem cobrança recorrente',
    description: 'Plano de entrada para estruturar o escritório e validar a operação.',
  },
  Escrivaninha: {
    priceLabel: 'R$109,90/mês',
    renewalLabel: 'Renovação prevista em 15 de maio de 2026',
    description: 'Melhor equilíbrio entre capacidade operacional e colaboração diária.',
  },
  Executivo: {
    priceLabel: 'Sob consulta',
    renewalLabel: 'Cobrança assistida pelo time comercial',
    description: 'Plano voltado para operação maior, mais equipe e expansão de estrutura.',
  },
};

const PLAN_COMPARISON: Record<
  OfficePlan,
  {
    price: string;
    subtitle: string;
    features: string[];
    cta: string;
  }
> = {
  Free: {
    price: 'R$0',
    subtitle: 'Para começar com baixo volume e uma estrutura enxuta.',
    features: ['5 processos ativos', '1 membro no escritório', '1 escritório principal'],
    cta: 'Manter plano atual',
  },
  Escrivaninha: {
    price: 'R$109,90',
    subtitle: 'Para escritórios que precisam ganhar ritmo e colaboração.',
    features: [
      '50 processos ativos',
      'Até 3 membros',
      'Convites e automações liberados',
    ],
    cta: 'Solicitar mudança',
  },
  Executivo: {
    price: 'Sob consulta',
    subtitle: 'Para operação ampliada, mais membros e mais de um escritório premium.',
    features: [
      '200 processos ativos',
      'Até 8 membros',
      'Até 3 escritórios premium',
    ],
    cta: 'Falar com comercial',
  },
};

function BillingQuotaBar({
  icon: Icon,
  label,
  current,
  limit,
}: {
  icon: React.ElementType;
  label: string;
  current: number;
  limit: number;
}) {
  const ratio = Math.min((current / limit) * 100, 100);
  const isCritical = ratio >= 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <div className="flex min-w-0 items-center gap-2 text-foreground">
          <Icon className="h-4 w-4 shrink-0 text-primary" />
          <span className="truncate">{label}</span>
        </div>
        <span className={cn('font-medium', isCritical ? 'text-red-600' : 'text-foreground')}>
          {current.toLocaleString('pt-BR')} / {limit.toLocaleString('pt-BR')}
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-primary/10">
        <div
          className={cn('h-full rounded-full', isCritical ? 'bg-red-500' : 'bg-primary')}
          style={{ width: `${ratio}%` }}
        />
      </div>
    </div>
  );
}

function ChangePlanDialog({ currentPlan }: { currentPlan: OfficePlan }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Alterar plano
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Alterar plano</DialogTitle>
          <DialogDescription>
            Compare os planos disponíveis e escolha a etapa mais adequada para o escritório.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 lg:grid-cols-3">
          {Object.entries(PLAN_COMPARISON).map(([plan, meta]) => {
            const officePlan = plan as OfficePlan;
            const isCurrent = officePlan === currentPlan;

            return (
              <div
                key={plan}
                className={cn(
                  'flex flex-col gap-4 rounded-lg border p-4',
                  isCurrent ? 'border-primary/30 bg-primary/5' : 'bg-background',
                )}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-lg font-semibold">{PLAN_LABELS[officePlan]}</p>
                    {isCurrent && (
                      <span className="rounded-md bg-background px-2 py-1 text-[11px] font-medium text-muted-foreground">
                        Atual
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-semibold text-foreground">{meta.price}</p>
                  <p className="text-sm text-muted-foreground">{meta.subtitle}</p>
                </div>

                <ul className="flex flex-1 flex-col gap-2">
                  {meta.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  size="sm"
                  variant={isCurrent ? 'ghost' : officePlan === 'Executivo' ? 'outline' : 'default'}
                  className="w-full"
                  disabled={isCurrent}
                  onClick={() =>
                    toast.success(
                      officePlan === 'Executivo'
                        ? 'Contato com o comercial iniciado.'
                        : `Solicitação de mudança para ${PLAN_LABELS[officePlan]} iniciada.`,
                    )
                  }
                >
                  {meta.cta}
                </Button>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function UpdatePaymentMethodDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Atualizar pagamento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Atualizar forma de pagamento</DialogTitle>
          <DialogDescription>
            Atualize o cartão principal usado na renovação da assinatura do escritório.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Nome no cartão</label>
            <Input defaultValue="Carlos Henrique Lima" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Número do cartão</label>
            <Input defaultValue="4242 4242 4242 4242" mask="credit-card" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Validade</label>
              <Input defaultValue="04/29" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">CVC</label>
              <Input defaultValue="123" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => toast.success('Forma de pagamento atualizada.')}>
            Salvar cartão
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ContactSalesDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" icon={MessageSquareMore} iconPlacement="left">
          Falar com comercial
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Falar com comercial</DialogTitle>
          <DialogDescription>
            Conte o momento do seu escritório para receber uma proposta adequada ao plano Executivo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Responsável</label>
            <Input defaultValue="Carlos Henrique Lima" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">E-mail para contato</label>
            <Input defaultValue="contato@contabil-lima.com.br" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Contexto</label>
            <Input placeholder="Ex.: queremos expandir a equipe e operar mais de um escritório" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => toast.success('Solicitação enviada ao comercial.')}>
            Enviar solicitação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function OfficePlanScreen() {
  const { data: office, isLoading, error, refetch } = useMyOffice();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-52 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-[26rem] w-full rounded-lg" />
      </div>
    );
  }

  if (error || !office) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar os dados do plano.
          </p>
          <Button variant="outline" onClick={() => void refetch()}>
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  const meta = PLAN_META[office.plan];
  const processLimit =
    office.plan === 'Free' ? 5 : office.plan === 'Escrivaninha' ? 50 : 200;
  const membersLimit =
    office.plan === 'Free' ? 1 : office.plan === 'Escrivaninha' ? 3 : 8;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Plano e assinatura</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie o plano do escritório, acompanhe o consumo e atualize a cobrança.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <CardTitle>{PLAN_LABELS[office.plan]}</CardTitle>
                <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  Plano atual
                </span>
              </div>
              <CardDescription className="mt-2">
                {meta.priceLabel} • {meta.renewalLabel}
              </CardDescription>
              <p className="mt-2 text-sm text-muted-foreground">{meta.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <ChangePlanDialog currentPlan={office.plan} />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                  >
                    Cancelar plano
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancelar plano?</AlertDialogTitle>
                    <AlertDialogDescription>
                      O cancelamento encerra a renovação automática. O escritório mantém o acesso até o fim do ciclo já pago.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Voltar</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 text-white hover:bg-red-700"
                      onClick={() => toast.error('Fluxo de cancelamento iniciado.')}
                    >
                      Confirmar cancelamento
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5">
          <BillingQuotaBar
            icon={Workflow}
            label="Processos ativos"
            current={office.processCount}
            limit={processLimit}
          />
          <BillingQuotaBar
            icon={Users}
            label="Membros"
            current={office.memberCount}
            limit={membersLimit}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Forma de pagamento</CardTitle>
          </div>
          <CardDescription>
            Método usado na renovação automática da assinatura.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="rounded-lg border bg-[#fff8f2] px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <CreditCard className="h-4 w-4 text-primary" />
              <span>Visa final 4242</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Atualizado para renovações mensais do escritório.
            </p>
          </div>
          <UpdatePaymentMethodDialog />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Crown className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Comparar planos</CardTitle>
          </div>
          <CardDescription>
            Veja o que muda em cada etapa antes de solicitar a alteração.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-3">
          {Object.entries(PLAN_COMPARISON).map(([plan, planData]) => {
            const officePlan = plan as OfficePlan;
            const isCurrent = officePlan === office.plan;

            return (
              <div
                key={plan}
                className={cn(
                  'flex flex-col gap-4 rounded-lg border p-4',
                  isCurrent && 'border-primary/30 bg-primary/5',
                )}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-lg font-semibold">{PLAN_LABELS[officePlan]}</p>
                    {isCurrent && (
                      <span className="rounded-md bg-background px-2 py-1 text-[11px] font-medium text-muted-foreground">
                        Atual
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-semibold text-foreground">{planData.price}</p>
                  <p className="text-sm text-muted-foreground">{planData.subtitle}</p>
                </div>

                <ul className="flex flex-1 flex-col gap-2">
                  {planData.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {officePlan === 'Executivo' ? (
                  <ContactSalesDialog />
                ) : (
                  <Button
                    size="sm"
                    variant={isCurrent ? 'ghost' : 'default'}
                    className="w-full"
                    disabled={isCurrent}
                    onClick={() =>
                      toast.success(
                        `Solicitação de mudança para ${PLAN_LABELS[officePlan]} iniciada.`,
                      )
                    }
                  >
                    {planData.cta}
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Próxima renovação</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {meta.renewalLabel}. Se quiser trocar de plano antes, a mudança
              pode ser solicitada agora.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Suporte comercial</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Para mudança de estrutura, volumes maiores ou negociação do plano Executivo.
            </p>
            <ContactSalesDialog />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
