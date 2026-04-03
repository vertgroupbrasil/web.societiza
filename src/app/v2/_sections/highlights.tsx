'use client';

import { cn } from '@societiza/lib/utils';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  Eye,
  Bell,
} from 'lucide-react';
import { stagger, staggerChild, vp } from '../_lib/animations';

/* ── Mock UIs ───────────────────────────────────────────── */

function AutomationsMockUI() {
  const updates = [
    { label: 'Viabilidade deferida', time: 'h 2min', done: true },
    { label: 'Alvar liberado', time: 'h 1h', done: true },
    { label: 'Inscrio municipal', time: 'aguardando...', done: false },
  ];
  return (
    <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
      <p className="text-xs text-muted-foreground font-medium mb-3">
        Atualizaes automticas hoje
      </p>
      {updates.map((u) => (
        <div
          key={u.label}
          className="flex items-center gap-2 rounded-md bg-background px-3 py-2 text-xs border"
        >
          <CheckCircle2
            className={cn(
              'size-3.5 shrink-0',
              u.done ? 'text-green-500' : 'text-muted-foreground/30',
            )}
          />
          <span className="flex-1 text-foreground">{u.label}</span>
          <span className="text-muted-foreground">{u.time}</span>
        </div>
      ))}
    </div>
  );
}

function ClientMockUI() {
  const steps = [
    { step: 'Viabilidade', done: true },
    { step: 'CNPJ', done: true },
    { step: 'Alvar', done: true },
    { step: 'Inscrio Municipal', done: false },
    { step: 'Entrega final', done: false },
  ];
  return (
    <div className="rounded-xl border bg-muted/30 p-4">
      <p className="text-xs text-muted-foreground mb-3">
        Abertura Empresa X Ltda.
      </p>
      <div className="relative pl-4">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
        <div className="space-y-3">
          {steps.map((s) => (
            <div key={s.step} className="flex items-center gap-3">
              <div
                className={cn(
                  'size-3.5 rounded-full border-2 shrink-0 -ml-[1.125rem] relative z-10',
                  s.done
                    ? 'bg-primary border-primary'
                    : 'bg-background border-muted-foreground/30',
                )}
              />
              <span
                className={cn(
                  'text-xs',
                  s.done ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {s.step}
              </span>
              {s.done && (
                <span className="ml-auto text-[10px] text-green-500 font-medium">
                  Concludo
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AlertsMockUI() {
  return (
    <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
      <p className="text-xs text-muted-foreground font-medium mb-3">
        Alertas pendentes 3
      </p>
      <div className="flex items-center gap-2 rounded-md border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs">
        <AlertTriangle className="size-3.5 text-amber-500 shrink-0" />
        <span className="text-foreground">
          Empresa Silva Ltda. parada h 7 dias
        </span>
      </div>
      <div className="flex items-center gap-2 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs">
        <Clock className="size-3.5 text-red-500 shrink-0" />
        <span className="text-foreground">
          Documentos pendentes 2 processos
        </span>
      </div>
      <div className="flex items-center gap-2 rounded-md border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs">
        <Bell className="size-3.5 text-amber-500 shrink-0" />
        <span className="text-foreground">
          Lembrar cliente sobre inscrio municipal
        </span>
      </div>
    </div>
  );
}

/* ── Highlights data ────────────────────────────────────── */

const highlights = [
  {
    badge: 'Automaes',
    icon: Zap,
    title: 'Pare de perder tempo consultando sites de prefeitura.',
    description:
      'Uma das tarefas mais cansativas da rotina societria  verificar manualmente se algo mudou.',
    points: [
      'Viabilidade deferida  voc  notificado.',
      'Alvar liberado  voc  notificado.',
      'Qualquer atualizao no processo  voc  notificado.',
    ],
    mockUI: <AutomationsMockUI />,
  },
  {
    badge: 'Transparncia',
    icon: Eye,
    title: 'Seu cliente sempre sabe em que etapa est a empresa dele.',
    description:
      'Nada pior do que clientes perguntando: "E a, como est minha empresa?"',
    points: [
      'Seu cliente acompanha o progresso.',
      'Recebe notificaes de atualizao.',
      'Menos mensagens no WhatsApp. Mais confiana.',
    ],
    mockUI: <ClientMockUI />,
  },
  {
    badge: 'Alertas',
    icon: Bell,
    title: 'Nunca mais deixe um processo parado.',
    description:
      'A Societiza identifica processos parados por muito tempo e avisa sua equipe.',
    points: [
      'Lembrete para solicitar documentos ao cliente.',
      'Alerta de processos travados h mais de X dias.',
      'Mais velocidade e controle operacional.',
    ],
    mockUI: <AlertsMockUI />,
  },
];

/* ── Section ────────────────────────────────────────────── */

export function HighlightsSection() {
  return (
    <section className="relative py-24 md:py-32">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={vp}
        variants={stagger(0.1)}
        className="mx-auto mb-16 max-w-2xl space-y-4 px-6 text-center lg:px-8"
      >
        <motion.div variants={staggerChild} className="flex justify-center">
          <div className="rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            Funcionalidades
          </div>
        </motion.div>
        <motion.h2
          variants={staggerChild}
          className="font-bold text-3xl tracking-tight md:text-5xl"
        >
          Menos trabalho manual.{' '}
          <span className="text-primary">Mais controle.</span>
        </motion.h2>
        <motion.p
          variants={staggerChild}
          className="text-muted-foreground text-sm leading-relaxed md:text-base"
        >
          Cada funcionalidade foi construda para resolver uma dor real da rotina
          societria.
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={vp}
        variants={stagger(0.15, 0.1)}
        className="mx-auto max-w-7xl px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {highlights.map((h) => (
            <motion.div
              key={h.badge}
              variants={staggerChild}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group relative flex flex-col gap-5 rounded-2xl border border-border/60 bg-card p-5 transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/5"
            >
              {/* Mock UI */}
              <div className="relative">{h.mockUI}</div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex w-fit items-center justify-center rounded-lg border bg-muted/20 p-2">
                    <h.icon className="size-4 text-primary" />
                  </div>
                  <div className="rounded-full border px-3 py-0.5 text-xs font-medium">
                    {h.badge}
                  </div>
                </div>
                <h3 className="font-semibold text-base leading-snug text-foreground">
                  {h.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {h.description}
                </p>
                <ul className="space-y-1.5 pt-1">
                  {h.points.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
