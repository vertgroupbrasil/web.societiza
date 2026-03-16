'use client';
/* eslint-disable unicorn/prefer-single-call */

import { cn } from '@societiza/lib/utils';
import { DecorIcon } from '@societiza/components/ui/decor-icon';
import type React from 'react';
import { useState, useEffect } from 'react';
import {
  Bell,
  Mail,
  Clock,
  AlertTriangle,
  CheckCircle2,
  User,
  Briefcase,
  Sparkles,
  Send,
  Building2,
  Heart,
  Zap,
  MessageCircle,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Feature = {
  step: string;
  title: string;
  description: string;
  highlight?: string;
  icon: React.ReactNode;
  animation: React.ReactNode;
};

// ─── Animations ───────────────────────────────────────────────────────────────

function ClientNotificationsAnimation() {
  const [currentEmail, setCurrentEmail] = useState(0);
  const [emailOpen, setEmailOpen] = useState(false);
  const [showHappy, setShowHappy] = useState(false);

  const emails = [
    {
      subject: 'Viabilidade Aprovada',
      preview: 'Sua empresa ABC Ltda avançou para a próxima etapa',
    },
    {
      subject: 'Contrato Social Pronto',
      preview: 'O documento foi elaborado e está disponível para revisão',
    },
    {
      subject: 'Registro na Junta',
      preview: 'Iniciamos o processo de registro na Junta Comercial',
    },
  ];

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    const runAnimation = () => {
      setCurrentEmail(0);
      setEmailOpen(false);
      setShowHappy(false);
      timers.push(setTimeout(() => setCurrentEmail(1), 600));
      timers.push(setTimeout(() => setEmailOpen(true), 1200));
      timers.push(
        setTimeout(() => {
          setEmailOpen(false);
          setCurrentEmail(2);
        }, 2800),
      );
      timers.push(setTimeout(() => setEmailOpen(true), 3400));
      timers.push(
        setTimeout(() => {
          setEmailOpen(false);
          setCurrentEmail(3);
        }, 5000),
      );
      timers.push(setTimeout(() => setShowHappy(true), 5600));
      timers.push(setTimeout(runAnimation, 8000));
    };

    runAnimation();
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex h-full w-full flex-col gap-2 p-3 overflow-hidden">
      {/* Header row: avatar + badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background shadow transition-all duration-500',
              showHappy ? 'border-primary scale-110' : 'border-border',
            )}
          >
            <User
              className={cn(
                'h-4 w-4 transition-colors duration-300',
                showHappy ? 'text-primary' : 'text-foreground',
              )}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold">Cliente</span>
            {currentEmail > 0 && !showHappy && (
              <span className="text-[9px] text-blue-500 animate-in fade-in duration-200">
                {currentEmail} email(s) recebido(s)
              </span>
            )}
            {showHappy && (
              <span className="text-[9px] text-primary animate-in fade-in duration-200">
                Informado e tranquilo
              </span>
            )}
          </div>
        </div>
        {showHappy ? (
          <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 animate-in zoom-in duration-300">
            <Heart className="h-3 w-3 text-primary fill-primary" />
            <span className="text-[9px] font-medium text-primary">
              Satisfeito
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[9px] text-muted-foreground">Aguardando</span>
          </div>
        )}
      </div>

      {/* Email list */}
      <div className="flex-1 flex flex-col gap-1 overflow-hidden">
        {emails.slice(0, currentEmail).map((email, i) => (
          <div
            key={i}
            className={cn(
              'flex items-center gap-2 rounded-lg border p-1.5 transition-all duration-300 animate-in slide-in-from-top-1 fade-in',
              i === currentEmail - 1 && emailOpen
                ? 'border-blue-500/40 bg-blue-500/10'
                : 'border-border bg-muted/40',
            )}
          >
            <Mail
              className={cn(
                'h-3 w-3 shrink-0',
                i === currentEmail - 1 && emailOpen
                  ? 'text-blue-500'
                  : 'text-muted-foreground',
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-semibold truncate">
                {email.subject}
              </p>
              <p className="text-[8px] text-muted-foreground truncate">
                {email.preview}
              </p>
            </div>
            <CheckCircle2
              className={cn(
                'h-3 w-3 shrink-0 transition-colors duration-300',
                i === currentEmail - 1 && emailOpen
                  ? 'text-blue-500'
                  : 'text-muted-foreground/40',
              )}
            />
          </div>
        ))}
        {/* Placeholder rows */}
        {Array.from({ length: Math.max(0, 3 - currentEmail) }).map((_, i) => (
          <div
            key={`ph-${i}`}
            className="flex items-center gap-2 rounded-lg border border-dashed bg-muted/20 p-1.5 opacity-30"
          >
            <div className="h-3 w-3 rounded bg-muted shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="h-1.5 w-3/4 rounded bg-muted" />
              <div className="h-1.5 w-full rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>

      {/* Status bar */}
      <div
        className={cn(
          'flex items-center justify-center gap-1.5 rounded-lg py-1.5 transition-all duration-300',
          showHappy ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50',
        )}
      >
        {showHappy ? (
          <>
            <Heart className="h-3 w-3 text-primary fill-primary" />
            <span className="text-[9px] font-medium text-primary">
              Cliente informado e tranquilo
            </span>
          </>
        ) : (
          <>
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span className="text-[9px] text-muted-foreground">
              Recebendo atualizações por email
            </span>
          </>
        )}
      </div>
    </div>
  );
}

function ContadorAlertsAnimation() {
  const [stalledDays, setStalledDays] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    const runAnimation = () => {
      setStalledDays(0);
      setShowAlert(false);
      setShowSuggestion(false);
      timers.push(setTimeout(() => setStalledDays(1), 600));
      timers.push(setTimeout(() => setStalledDays(2), 1200));
      timers.push(
        setTimeout(() => {
          setStalledDays(3);
          setShowAlert(true);
        }, 1800),
      );
      timers.push(setTimeout(() => setShowSuggestion(true), 3000));
      timers.push(setTimeout(runAnimation, 6500));
    };

    runAnimation();
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex h-full w-full flex-col gap-2 p-3 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Briefcase className="h-3.5 w-3.5 text-primary" />
        <span className="text-[10px] font-medium">Painel do Contador</span>
        <div
          className={cn(
            'ml-auto flex items-center gap-1 rounded-full px-2 py-0.5 transition-all duration-300',
            stalledDays >= 3 ? 'bg-amber-500/10' : 'bg-muted',
          )}
        >
          <Clock
            className={cn(
              'h-3 w-3',
              stalledDays >= 3 ? 'text-amber-500' : 'text-muted-foreground',
            )}
          />
          <span
            className={cn(
              'text-[9px] font-medium tabular-nums',
              stalledDays >= 3 ? 'text-amber-500' : 'text-muted-foreground',
            )}
          >
            {stalledDays} dias
          </span>
        </div>
      </div>

      {/* Process card */}
      <div
        className={cn(
          'rounded-xl border-2 bg-background p-2.5 shadow transition-all duration-500',
          stalledDays >= 3 ? 'border-amber-500' : 'border-border',
        )}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <Building2 className="h-3.5 w-3.5 text-foreground" />
          </div>
          <div>
            <p className="text-[10px] font-semibold">Empresa XYZ</p>
            <p className="text-[9px] text-muted-foreground">
              Viabilidade · 2/5 etapas
            </p>
          </div>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mb-2">
          <div className="h-full w-[40%] bg-primary rounded-full" />
        </div>
        <div
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-2 py-1 transition-all duration-300',
            stalledDays >= 3 ? 'bg-amber-500/10' : 'bg-muted/50',
          )}
        >
          {stalledDays >= 3 ? (
            <>
              <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" />
              <span className="text-[9px] text-amber-600 font-medium">
                Processo parado há {stalledDays} dias
              </span>
            </>
          ) : (
            <>
              <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-[9px] text-muted-foreground">
                Monitorando...
              </span>
            </>
          )}
        </div>
      </div>

      {/* Alert */}
      {showAlert && (
        <div className="rounded-xl border-2 border-amber-500 bg-background overflow-hidden animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="flex items-center gap-2 bg-amber-500 px-2.5 py-1.5">
            <Bell className="h-3 w-3 text-white" />
            <span className="text-[9px] font-medium text-white">
              Alerta para Contador
            </span>
          </div>
          <div className="p-2 space-y-1.5">
            <p className="text-[9px] leading-relaxed">
              <span className="font-semibold">Empresa XYZ</span> parada há{' '}
              <span className="font-semibold text-amber-600">3 dias</span> na
              etapa de Viabilidade.
            </p>
            {showSuggestion && (
              <button className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-green-500/10 border border-green-500/30 px-2 py-1.5 text-[9px] font-medium text-green-600 animate-in fade-in slide-in-from-bottom-1 duration-200">
                <MessageCircle className="h-3 w-3" />
                Contato via WhatsApp
              </button>
            )}
          </div>
        </div>
      )}

      {/* Status */}
      <div
        className={cn(
          'mt-auto flex items-center justify-center gap-1.5 rounded-lg py-1.5 transition-all duration-300',
          showAlert
            ? 'bg-amber-500/10 border border-amber-500/20'
            : 'bg-muted/50',
        )}
      >
        {showAlert ? (
          <>
            <AlertTriangle className="h-3 w-3 text-amber-500" />
            <span className="text-[9px] font-medium text-amber-600">
              Contador notificado
            </span>
          </>
        ) : (
          <>
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[9px] text-muted-foreground">
              Sistema monitorando processos
            </span>
          </>
        )}
      </div>
    </div>
  );
}

function EmailFlowAnimation() {
  const [emails, setEmails] = useState<
    { to: string; subject: string; sent: boolean }[]
  >([]);

  const emailQueue = [
    { to: 'cliente@email.com', subject: 'Proposta aceita' },
    { to: 'contador@empresa.com', subject: 'Nova empresa iniciada' },
    { to: 'cliente@email.com', subject: 'Envie documentos' },
  ];

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    const runAnimation = () => {
      setEmails([]);
      emailQueue.forEach((email, i) => {
        timers.push(
          setTimeout(
            () => {
              setEmails((prev) => [...prev, { ...email, sent: false }]);
            },
            600 + i * 1200,
          ),
        );
        timers.push(
          setTimeout(
            () => {
              setEmails((prev) =>
                prev.map((e, idx) => (idx === i ? { ...e, sent: true } : e)),
              );
            },
            600 + i * 1200 + 600,
          ),
        );
      });
      timers.push(
        setTimeout(runAnimation, 600 + emailQueue.length * 1200 + 1500),
      );
    };

    runAnimation();
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
          <Mail className="h-3.5 w-3.5 text-blue-500" />
        </div>
        <div>
          <p className="text-[11px] font-semibold">Emails Automáticos</p>
          <p className="text-[9px] text-muted-foreground">
            Disparados por eventos
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5">
          <Zap className="h-2.5 w-2.5 text-primary" />
          <span className="text-[9px] font-medium text-primary">Auto</span>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-hidden">
        {emails.map((email, i) => (
          <div
            key={i}
            className={cn(
              'flex items-center gap-2 rounded-lg border bg-background p-2 transition-all duration-500',
              email.sent ? 'border-primary/30 bg-primary/5' : 'border-border',
            )}
          >
            <div
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full shrink-0 transition-all duration-300',
                email.sent ? 'bg-primary' : 'bg-muted',
              )}
            >
              {email.sent ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" />
              ) : (
                <Send className="h-3 w-3 text-muted-foreground animate-pulse" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium truncate">
                {email.subject}
              </p>
              <p className="text-[9px] text-muted-foreground truncate">
                {email.to}
              </p>
            </div>
            {email.sent && (
              <span className="text-[8px] text-primary font-medium shrink-0">
                Enviado
              </span>
            )}
          </div>
        ))}

        {emails.length < 3 && (
          <div className="space-y-2">
            {Array.from({ length: 3 - emails.length }).map((_, i) => (
              <div
                key={`placeholder-${i}`}
                className="flex items-center gap-2 rounded-lg border border-dashed bg-muted/20 p-2 opacity-40"
              >
                <div className="h-7 w-7 rounded-full bg-muted" />
                <div className="flex-1 space-y-1">
                  <div className="h-2 w-20 rounded bg-muted" />
                  <div className="h-2 w-28 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 pt-2 border-t flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[9px] text-muted-foreground">
            Monitorando eventos
          </span>
        </div>
        <span className="text-[10px] font-medium text-primary">
          {emails.filter((e) => e.sent).length}/3 enviados
        </span>
      </div>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const features: Feature[] = [
  {
    step: '01',
    title: 'Cliente sempre informado por email',
    icon: <Mail />,
    description:
      'Cada movimentação no processo gera um email automático para o cliente. Ele acompanha tudo em tempo real, sem precisar perguntar nada.',
    animation: <ClientNotificationsAnimation />,
    highlight: 'Transparência total = confiança',
  },
  {
    step: '02',
    title: 'Alertas inteligentes para o contador',
    icon: <AlertTriangle />,
    description:
      'Se um processo fica parado por alguns dias, você recebe um alerta com a sugestão de entrar em contato com o cliente via WhatsApp para destravar o processo.',
    animation: <ContadorAlertsAnimation />,
    highlight: 'Nenhum processo esquecido',
  },
  {
    step: '03',
    title: 'Emails automáticos por evento',
    icon: <Mail />,
    description:
      'Proposta aceita? Documento necessário? Etapa concluída? O sistema dispara emails personalizados automaticamente, mantendo todos alinhados.',
    animation: <EmailFlowAnimation />,
    highlight: 'Zero emails manuais',
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div
      className={cn(
        'relative flex flex-col gap-6 px-6 pt-10 pb-8',
        'dark:bg-[radial-gradient(50%_80%_at_25%_0%,oklch(from_var(--foreground)_l_c_h_/_0.06),transparent)]',
      )}
    >
      <div className="absolute -inset-y-4 -left-px w-px bg-border" />
      <div className="absolute -inset-y-4 -right-px w-px bg-border" />
      <div className="absolute -inset-x-4 -top-px h-px bg-border" />
      <div className="absolute -right-4 -bottom-px -left-4 h-px bg-border" />
      <DecorIcon className="size-3.5" position="top-left" />

      <div className="relative h-40 w-full overflow-hidden rounded-xl border bg-muted/30">
        {feature.animation}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex w-fit items-center justify-center rounded-lg border bg-muted/20 p-2 [&_svg]:size-4 [&_svg]:text-primary">
            {feature.icon}
          </div>
          <div className="w-fit rounded-md border px-3 py-0.5 text-xs">
            Etapa {feature.step}
          </div>
        </div>

        <h3 className="font-semibold text-base leading-snug text-foreground">
          {feature.title}
        </h3>
        <p className="text-muted-foreground text-xs leading-relaxed">
          {feature.description}
        </p>

        {feature.highlight && (
          <div className="flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5">
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="text-xs font-medium text-primary">
              {feature.highlight}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function FeaturesShowcase() {
  return (
    <section id="como-funciona" className="py-20 md:py-28">
      <div className="mx-auto mb-14 max-w-2xl space-y-3 text-center">
        <div className="flex justify-center">
          <div className="rounded-md border px-4 py-1 text-sm">
            Comunicação Inteligente
          </div>
        </div>
        <h2 className="font-bold text-3xl tracking-tight md:text-5xl">
          Cliente e contador sempre conectados
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          Cada movimentação gera uma notificação. O cliente sabe exatamente o
          que está acontecendo, e o contador nunca deixa um processo parar.
          Resultado: empresas abertas mais rápido.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard feature={feature} key={feature.step} />
        ))}
      </div>
    </section>
  );
}
