'use client';
/* eslint-disable unicorn/prefer-single-call */

import { cn } from '@societiza/lib/utils';
import { motion } from 'motion/react';
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
import { stagger, staggerChild, vp } from '../_lib/animations';

/* ── Animations ─────────────────────────────────────────── */

function ClientNotificationsAnimation() {
  const [currentEmail, setCurrentEmail] = useState(0);
  const [emailOpen, setEmailOpen] = useState(false);
  const [showHappy, setShowHappy] = useState(false);

  const emails = [
    {
      subject: 'Viabilidade Aprovada',
      preview: 'Sua empresa ABC Ltda avanou para a prxima etapa',
    },
    {
      subject: 'Contrato Social Pronto',
      preview: 'O documento foi elaborado e est disponvel',
    },
    {
      subject: 'Registro na Junta',
      preview: 'Iniciamos o processo de registro na Junta Comercial',
    },
  ];

  useEffect(() => {
    const t: NodeJS.Timeout[] = [];
    const run = () => {
      setCurrentEmail(0);
      setEmailOpen(false);
      setShowHappy(false);
      t.push(setTimeout(() => setCurrentEmail(1), 600));
      t.push(setTimeout(() => setEmailOpen(true), 1200));
      t.push(
        setTimeout(() => {
          setEmailOpen(false);
          setCurrentEmail(2);
        }, 2800),
      );
      t.push(setTimeout(() => setEmailOpen(true), 3400));
      t.push(
        setTimeout(() => {
          setEmailOpen(false);
          setCurrentEmail(3);
        }, 5000),
      );
      t.push(setTimeout(() => setShowHappy(true), 5600));
      t.push(setTimeout(run, 8000));
    };
    run();
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex h-full w-full flex-col gap-2 p-3 overflow-hidden">
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
                'h-4 w-4 transition-colors',
                showHappy ? 'text-primary' : 'text-foreground',
              )}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold">Cliente</span>
            {currentEmail > 0 && !showHappy && (
              <span className="text-[9px] text-blue-500 animate-in fade-in duration-200">
                {currentEmail} email(s)
              </span>
            )}
            {showHappy && (
              <span className="text-[9px] text-primary animate-in fade-in duration-200">
                Informado
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
                'h-3 w-3 shrink-0 transition-colors',
                i === currentEmail - 1 && emailOpen
                  ? 'text-blue-500'
                  : 'text-muted-foreground/40',
              )}
            />
          </div>
        ))}
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
      <div
        className={cn(
          'flex items-center justify-center gap-1.5 rounded-lg py-1.5 transition-all',
          showHappy ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50',
        )}
      >
        {showHappy ? (
          <>
            <Heart className="h-3 w-3 text-primary fill-primary" />
            <span className="text-[9px] font-medium text-primary">
              Cliente informado
            </span>
          </>
        ) : (
          <>
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span className="text-[9px] text-muted-foreground">
              Recebendo atualizaes
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
    const t: NodeJS.Timeout[] = [];
    const run = () => {
      setStalledDays(0);
      setShowAlert(false);
      setShowSuggestion(false);
      t.push(setTimeout(() => setStalledDays(1), 600));
      t.push(setTimeout(() => setStalledDays(2), 1200));
      t.push(
        setTimeout(() => {
          setStalledDays(3);
          setShowAlert(true);
        }, 1800),
      );
      t.push(setTimeout(() => setShowSuggestion(true), 3000));
      t.push(setTimeout(run, 6500));
    };
    run();
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex h-full w-full flex-col gap-2 p-3 overflow-hidden">
      <div className="flex items-center gap-2">
        <Briefcase className="h-3.5 w-3.5 text-primary" />
        <span className="text-[10px] font-medium">Painel do Contador</span>
        <div
          className={cn(
            'ml-auto flex items-center gap-1 rounded-full px-2 py-0.5 transition-all',
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
              Viabilidade 2/5 etapas
            </p>
          </div>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mb-2">
          <div className="h-full w-[40%] bg-primary rounded-full" />
        </div>
        <div
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-2 py-1 transition-all',
            stalledDays >= 3 ? 'bg-amber-500/10' : 'bg-muted/50',
          )}
        >
          {stalledDays >= 3 ? (
            <>
              <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" />
              <span className="text-[9px] text-amber-600 font-medium">
                Parado h {stalledDays} dias
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
              <span className="font-semibold">Empresa XYZ</span> parada h{' '}
              <span className="font-semibold text-amber-600">3 dias</span> na
              Viabilidade.
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
    const t: NodeJS.Timeout[] = [];
    const run = () => {
      setEmails([]);
      emailQueue.forEach((email, i) => {
        t.push(
          setTimeout(
            () => setEmails((prev) => [...prev, { ...email, sent: false }]),
            600 + i * 1200,
          ),
        );
        t.push(
          setTimeout(
            () =>
              setEmails((prev) =>
                prev.map((e, idx) => (idx === i ? { ...e, sent: true } : e)),
              ),
            600 + i * 1200 + 600,
          ),
        );
      });
      t.push(setTimeout(run, 600 + emailQueue.length * 1200 + 1500));
    };
    run();
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
          <Mail className="h-3.5 w-3.5 text-blue-500" />
        </div>
        <div>
          <p className="text-[11px] font-semibold">Emails Automticos</p>
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
                'flex h-7 w-7 items-center justify-center rounded-full shrink-0 transition-all',
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
                key={`p-${i}`}
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

/* ── Feature data ───────────────────────────────────────── */

const features = [
  {
    step: '01',
    title: 'Cliente sempre informado por email',
    icon: Mail,
    description:
      'Cada movimentao gera um email automtico. O cliente acompanha tudo em tempo real, sem precisar perguntar.',
    animation: <ClientNotificationsAnimation />,
    highlight: 'Transparncia total = confiana',
  },
  {
    step: '02',
    title: 'Alertas inteligentes para o contador',
    icon: AlertTriangle,
    description:
      'Se um processo fica parado, voc recebe alerta com sugesto de contato via WhatsApp para destravar.',
    animation: <ContadorAlertsAnimation />,
    highlight: 'Nenhum processo esquecido',
  },
  {
    step: '03',
    title: 'Emails automticos por evento',
    icon: Mail,
    description:
      'Proposta aceita? Documento necessrio? Etapa concluda? O sistema dispara emails personalizados automaticamente.',
    animation: <EmailFlowAnimation />,
    highlight: 'Zero emails manuais',
  },
];

/* ── Section ────────────────────────────────────────────── */

export function FeaturesShowcase() {
  return (
    <section id="como-funciona" className="relative py-24 md:py-32 bg-muted/10">
      {/* Subtle background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={vp}
        variants={stagger(0.1)}
        className="relative mx-auto mb-16 max-w-2xl space-y-4 px-6 text-center lg:px-8"
      >
        <motion.div variants={staggerChild} className="flex justify-center">
          <div className="rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            Comunicao Inteligente
          </div>
        </motion.div>
        <motion.h2
          variants={staggerChild}
          className="font-bold text-3xl tracking-tight md:text-5xl"
        >
          Cliente e contador{' '}
          <span className="text-primary">sempre conectados</span>
        </motion.h2>
        <motion.p
          variants={staggerChild}
          className="text-muted-foreground text-sm leading-relaxed md:text-base"
        >
          Cada movimentao gera uma notificao. O cliente sabe exatamente o que
          est acontecendo, e o contador nunca deixa um processo parar.
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={vp}
        variants={stagger(0.15, 0.1)}
        className="relative mx-auto max-w-7xl px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <motion.div
              key={feature.step}
              variants={staggerChild}
              whileHover={{
                y: -8,
                transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
              }}
              className="group relative flex flex-col gap-5 rounded-2xl border border-border/60 bg-card p-5 transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/5"
            >
              {/* Animation area */}
              <div className="relative h-48 w-full overflow-hidden rounded-xl border bg-muted/20">
                {feature.animation}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex w-fit items-center justify-center rounded-lg border bg-muted/20 p-2">
                    <feature.icon className="size-4 text-primary" />
                  </div>
                  <div className="rounded-full border px-3 py-0.5 text-xs font-medium">
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
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
