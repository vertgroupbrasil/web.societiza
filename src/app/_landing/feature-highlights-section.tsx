import type React from 'react';
import { cn } from '@societiza/lib/utils';
import { DecorIcon } from '@societiza/components/ui/decor-icon';
import { CheckCircle2, Clock, AlertTriangle, Zap, Eye, Bell } from 'lucide-react';

/* ─── Mock UI components ─────────────────────────────────── */

function AutomationsMockUI() {
  const updates = [
    { label: 'Viabilidade deferida', time: 'há 2min', done: true },
    { label: 'Alvará liberado', time: 'há 1h', done: true },
    { label: 'Inscrição municipal', time: 'aguardando...', done: false },
  ];
  return (
    <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
      <p className="text-xs text-muted-foreground font-medium mb-3">Atualizações automáticas · hoje</p>
      {updates.map((u) => (
        <div key={u.label} className="flex items-center gap-2 rounded-md bg-background px-3 py-2 text-xs border">
          <CheckCircle2
            className={cn('size-3.5 shrink-0', u.done ? 'text-green-500' : 'text-muted-foreground/30')}
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
    { step: 'Alvará', done: true },
    { step: 'Inscrição Municipal', done: false },
    { step: 'Entrega final', done: false },
  ];
  return (
    <div className="rounded-xl border bg-muted/30 p-4">
      <p className="text-xs text-muted-foreground mb-3">Abertura — Empresa X Ltda.</p>
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
                    : 'bg-background border-muted-foreground/30'
                )}
              />
              <span className={cn('text-xs', s.done ? 'text-foreground' : 'text-muted-foreground')}>
                {s.step}
              </span>
              {s.done && (
                <span className="ml-auto text-[10px] text-green-500 font-medium">Concluído</span>
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
      <p className="text-xs text-muted-foreground font-medium mb-3">Alertas pendentes · 3</p>
      <div className="flex items-center gap-2 rounded-md border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs">
        <AlertTriangle className="size-3.5 text-amber-500 shrink-0" />
        <span className="text-foreground">Empresa Silva Ltda. parada há 7 dias</span>
      </div>
      <div className="flex items-center gap-2 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs">
        <Clock className="size-3.5 text-red-500 shrink-0" />
        <span className="text-foreground">Documentos pendentes · 2 processos</span>
      </div>
      <div className="flex items-center gap-2 rounded-md border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs">
        <Bell className="size-3.5 text-amber-500 shrink-0" />
        <span className="text-foreground">Lembrar cliente sobre inscrição municipal</span>
      </div>
    </div>
  );
}

/* ─── Feature card ───────────────────────────────────────── */

type Highlight = {
  badge: string;
  icon: React.ElementType;
  title: string;
  description: string;
  points: string[];
  mockUI: React.ReactNode;
};

const highlights: Highlight[] = [
  {
    badge: 'Automações',
    icon: Zap,
    title: 'Pare de perder tempo consultando sites de prefeitura.',
    description:
      'Uma das tarefas mais cansativas da rotina societária é verificar manualmente se algo mudou.',
    points: [
      'Viabilidade deferida — você é notificado.',
      'Alvará liberado — você é notificado.',
      'Qualquer atualização no processo — você é notificado.',
    ],
    mockUI: <AutomationsMockUI />,
  },
  {
    badge: 'Transparência',
    icon: Eye,
    title: 'Seu cliente sempre sabe em que etapa está a empresa dele.',
    description: 'Nada pior do que clientes perguntando o tempo todo: "E aí, como está minha empresa?"',
    points: [
      'Seu cliente acompanha o progresso do processo.',
      'Recebe notificações de atualização.',
      'Menos mensagens no WhatsApp. Mais confiança.',
    ],
    mockUI: <ClientMockUI />,
  },
  {
    badge: 'Alertas',
    icon: Bell,
    title: 'Nunca mais deixe um processo parado.',
    description:
      'A Societiza identifica processos que estão parados por muito tempo e avisa sua equipe.',
    points: [
      'Lembrete para solicitar documentos ao cliente.',
      'Alerta de processos travados há mais de X dias.',
      'Mais velocidade e controle operacional.',
    ],
    mockUI: <AlertsMockUI />,
  },
];

function HighlightCard({
  highlight,
  className,
}: {
  highlight: Highlight;
  className?: string;
}) {
  const { badge, icon: Icon, title, description, points, mockUI } = highlight;
  return (
    <div
      className={cn(
        'relative flex flex-col gap-6 px-6 pt-10 pb-8',
        'dark:bg-[radial-gradient(50%_80%_at_25%_0%,oklch(from_var(--foreground)_l_c_h_/_0.06),transparent)]',
        className
      )}
    >
      <div className="absolute -inset-y-4 -left-px w-px bg-border" />
      <div className="absolute -inset-y-4 -right-px w-px bg-border" />
      <div className="absolute -inset-x-4 -top-px h-px bg-border" />
      <div className="absolute -right-4 -bottom-px -left-4 h-px bg-border" />
      <DecorIcon className="size-3.5" position="top-left" />

      {mockUI}

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex w-fit items-center justify-center rounded-lg border bg-muted/20 p-2 [&_svg]:size-4 [&_svg]:text-primary">
            <Icon />
          </div>
          <div className="w-fit rounded-md border px-3 py-0.5 text-xs">{badge}</div>
        </div>
        <h3 className="font-semibold text-base leading-snug text-foreground">{title}</h3>
        <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
        <ul className="space-y-1.5 pt-1">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function FeatureHighlightsSection() {
  return (
    <div id="como-funciona" className="py-20 md:py-28">
      <div className="mx-auto mb-14 max-w-2xl space-y-3 text-center">
        <div className="flex justify-center">
          <div className="rounded-md border px-4 py-1 text-sm">Como funciona</div>
        </div>
        <h2 className="font-bold text-3xl tracking-tight md:text-5xl">
          Menos trabalho manual.{' '}
          <span className="text-primary">Mais controle.</span>
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          Cada funcionalidade foi construída para resolver uma dor real da rotina societária.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {highlights.map((h) => (
          <HighlightCard highlight={h} key={h.badge} />
        ))}
      </div>
    </div>
  );
}
