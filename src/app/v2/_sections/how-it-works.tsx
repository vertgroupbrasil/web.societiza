'use client';
/* eslint-disable unicorn/prefer-single-call */

import { cn } from '@societiza/lib/utils';
import { motion } from 'motion/react';
import { useState, useEffect, useCallback } from 'react';
import {
  LayoutTemplateIcon,
  FileTextIcon,
  ZapIcon,
  BellIcon,
  Check,
  User,
  Mail,
  Building,
  X,
} from 'lucide-react';
import { stagger, staggerChild, vp } from '../_lib/animations';

/* ── Mini Animations ────────────────────────────────────── */

function KanbanAnimation() {
  const [cardColumn, setCardColumn] = useState(0);
  const [showSheet, setShowSheet] = useState(false);
  const [checkedTasks, setCheckedTasks] = useState([false, false, false]);
  const [isClick, setIsClick] = useState(false);
  const [cursor, setCursor] = useState({ x: 20, y: 50 });
  const columns = ['Proposta', 'Viabilidade', 'Registro'];

  const reset = useCallback(() => {
    setCardColumn(0);
    setShowSheet(false);
    setCheckedTasks([false, false, false]);
    setIsClick(false);
    setCursor({ x: 20, y: 50 });
  }, []);

  useEffect(() => {
    const t: NodeJS.Timeout[] = [];
    const run = () => {
      t.push(setTimeout(() => setCursor({ x: 30, y: 65 }), 500));
      t.push(setTimeout(() => setIsClick(true), 1000));
      t.push(
        setTimeout(() => {
          setIsClick(false);
          setShowSheet(true);
        }, 1200),
      );
      t.push(setTimeout(() => setCheckedTasks([true, false, false]), 2000));
      t.push(setTimeout(() => setCheckedTasks([true, true, false]), 2600));
      t.push(setTimeout(() => setCheckedTasks([true, true, true]), 3200));
      t.push(setTimeout(() => setShowSheet(false), 3800));
      t.push(
        setTimeout(() => {
          setCardColumn(1);
          setCheckedTasks([false, false, false]);
        }, 4200),
      );
      t.push(setTimeout(() => setCursor({ x: 95, y: 65 }), 4800));
      t.push(setTimeout(() => setIsClick(true), 5300));
      t.push(
        setTimeout(() => {
          setIsClick(false);
          setShowSheet(true);
        }, 5500),
      );
      t.push(setTimeout(() => setCheckedTasks([true, false, false]), 6200));
      t.push(setTimeout(() => setCheckedTasks([true, true, false]), 6800));
      t.push(setTimeout(() => setCheckedTasks([true, true, true]), 7400));
      t.push(setTimeout(() => setShowSheet(false), 8000));
      t.push(setTimeout(() => setCardColumn(2), 8400));
      t.push(setTimeout(reset, 10000));
    };
    run();
    return () => t.forEach(clearTimeout);
  }, [cardColumn === 0 && !showSheet, reset]);

  return (
    <div className="relative flex h-full w-full items-start justify-center gap-1 p-3 pt-4">
      <div
        className={cn(
          'absolute z-30 pointer-events-none transition-all duration-500 ease-out',
          isClick && 'scale-90',
        )}
        style={{
          left: `${cursor.x}%`,
          top: `${cursor.y}%`,
          transform: 'translate(-50%,-50%)',
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className="drop-shadow-md"
        >
          <path
            d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.48 0 .72-.58.38-.92L6.35 2.88a.5.5 0 0 0-.85.33Z"
            fill="currentColor"
            stroke="white"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      {columns.map((col, ci) => (
        <div
          key={col}
          className="flex h-full w-1/3 flex-col gap-1.5 rounded bg-muted/40 p-1.5"
        >
          <span className="text-[8px] font-medium text-muted-foreground text-center truncate">
            {col}
          </span>
          <div className="flex flex-col gap-1 flex-1 relative">
            {ci === cardColumn && (
              <div
                className={cn(
                  'h-6 rounded bg-primary/20 border border-primary/40 shadow-sm transition-all duration-500',
                  isClick && 'ring-2 ring-primary/50 scale-95',
                  !isClick && ci === cardColumn && 'ring-1 ring-primary/30',
                )}
              />
            )}
            {ci === 0 && (
              <div className="h-6 rounded bg-background/80 border shadow-sm opacity-40" />
            )}
          </div>
        </div>
      ))}
      {showSheet && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-[2px] p-2">
          <div className="w-[85%] max-w-[160px] rounded-lg border bg-background shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between gap-2 p-2 border-b bg-muted/30">
              <div className="h-2.5 w-16 rounded bg-muted animate-pulse" />
              <X className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="p-2 space-y-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={cn(
                    'flex items-center gap-2 p-1.5 rounded border transition-all duration-300',
                    checkedTasks[i]
                      ? 'bg-primary/10 border-primary/30'
                      : 'bg-muted/20 border-transparent',
                  )}
                >
                  <div
                    className={cn(
                      'flex h-3 w-3 items-center justify-center rounded border transition-all duration-300 shrink-0',
                      checkedTasks[i]
                        ? 'bg-primary border-primary'
                        : 'bg-background border-muted-foreground/30',
                    )}
                  >
                    {checkedTasks[i] && (
                      <Check className="h-2 w-2 text-primary-foreground" />
                    )}
                  </div>
                  <div
                    className={cn(
                      'h-2 rounded bg-muted flex-1',
                      checkedTasks[i] ? 'opacity-50' : 'animate-pulse',
                    )}
                    style={{ width: `${60 + i * 10}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FormAnimation() {
  const NAME = 'Empresa ABC Ltda';
  const CNPJ = '00.000.000/0001';
  const [nameText, setNameText] = useState('');
  const [cnpjText, setCnpjText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const t: NodeJS.Timeout[] = [];
    const run = () => {
      setNameText('');
      setCnpjText('');
      setSubmitted(false);
      NAME.split('').forEach((_, i) => {
        t.push(
          setTimeout(() => setNameText(NAME.slice(0, i + 1)), 400 + i * 65),
        );
      });
      const afterName = 400 + NAME.length * 65 + 300;
      CNPJ.split('').forEach((_, i) => {
        t.push(
          setTimeout(
            () => setCnpjText(CNPJ.slice(0, i + 1)),
            afterName + i * 50,
          ),
        );
      });
      const afterCnpj = afterName + CNPJ.length * 50 + 400;
      t.push(setTimeout(() => setSubmitted(true), afterCnpj));
      t.push(setTimeout(run, afterCnpj + 1800));
    };
    t.push(setTimeout(run, 300));
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-[160px] space-y-2 rounded-lg border bg-background p-3 shadow-sm">
        <div className="flex items-center gap-2 pb-2 border-b">
          <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="h-2.5 w-2.5 text-primary" />
          </div>
          <span className="text-[8px] font-medium">Dados da Empresa</span>
        </div>
        <div className="space-y-1.5">
          <div className="space-y-0.5">
            <div className="text-[7px] text-muted-foreground">Nome</div>
            <div className="h-4 rounded border bg-muted/30 flex items-center px-1 gap-0.5">
              <span className="text-[8px]">{nameText}</span>
              {nameText.length < NAME.length && (
                <span className="w-px h-2.5 bg-foreground animate-pulse" />
              )}
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[7px] text-muted-foreground">CNPJ</div>
            <div className="h-4 rounded border bg-muted/30 flex items-center px-1 gap-0.5">
              <span className="text-[8px] text-muted-foreground">
                {cnpjText}
              </span>
              {cnpjText.length > 0 && cnpjText.length < CNPJ.length && (
                <span className="w-px h-2.5 bg-foreground animate-pulse" />
              )}
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[7px] text-muted-foreground">E-mail</div>
            <div className="h-4 rounded border bg-muted/30 flex items-center gap-1 px-1">
              <Mail className="h-2 w-2 text-muted-foreground" />
              <span className="text-[8px] text-muted-foreground">
                contato@...
              </span>
            </div>
          </div>
        </div>
        <div
          className={cn(
            'h-5 rounded flex items-center justify-center transition-all duration-300',
            submitted ? 'bg-primary' : 'bg-primary/40',
          )}
        >
          <span className="text-[8px] text-primary-foreground font-medium">
            {submitted ? 'Enviado' : 'Enviar'}
          </span>
        </div>
      </div>
    </div>
  );
}

function TasksAnimation() {
  const tasks = [
    { label: 'Consulta CNPJ' },
    { label: 'Viabilidade' },
    { label: 'Registro Junta' },
    { label: 'Alvar' },
  ];
  const [checkedCount, setCheckedCount] = useState(0);

  useEffect(() => {
    const t: NodeJS.Timeout[] = [];
    const run = () => {
      setCheckedCount(0);
      tasks.forEach((_, i) => {
        t.push(setTimeout(() => setCheckedCount(i + 1), 600 + i * 800));
      });
      t.push(setTimeout(run, 600 + tasks.length * 800 + 1500));
    };
    t.push(setTimeout(run, 400));
    return () => t.forEach(clearTimeout);
  }, []);

  const progress = (checkedCount / tasks.length) * 100;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-3">
      <div className="w-full max-w-[170px] space-y-1.5">
        {tasks.map((task, index) => {
          const done = index < checkedCount;
          const active = index === checkedCount;
          return (
            <div
              key={task.label}
              className={cn(
                'flex items-center gap-1.5 rounded border bg-background p-1.5 transition-all duration-500',
                done && 'bg-primary/5 border-primary/30',
              )}
            >
              <div
                className={cn(
                  'flex h-3 w-3 items-center justify-center rounded-full border transition-all duration-300 shrink-0',
                  done
                    ? 'bg-primary border-primary'
                    : 'bg-muted/30 border-muted-foreground/30',
                  active && 'animate-pulse border-primary/50',
                )}
              >
                {done && <Check className="h-2 w-2 text-primary-foreground" />}
              </div>
              <span
                className={cn(
                  'text-[9px] font-medium transition-colors',
                  done && 'text-primary',
                )}
              >
                {task.label}
              </span>
              {index === 2 && (
                <ZapIcon
                  className={cn(
                    'ml-auto h-2.5 w-2.5',
                    done ? 'text-primary' : 'text-muted-foreground/40',
                  )}
                />
              )}
            </div>
          );
        })}
        <div className="mt-1.5 h-1 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function NotificationsAnimation() {
  const notifications = [
    { title: 'Processo atualizado', desc: 'Viabilidade aprovada' },
    { title: 'Novo documento', desc: 'Contrato disponvel' },
    { title: 'Ao necessria', desc: 'Assinar CNPJ' },
  ];
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const t: NodeJS.Timeout[] = [];
    const run = () => {
      setVisibleCount(0);
      notifications.forEach((_, i) => {
        t.push(setTimeout(() => setVisibleCount(i + 1), 500 + i * 700));
      });
      t.push(setTimeout(run, 500 + notifications.length * 700 + 1500));
    };
    t.push(setTimeout(run, 300));
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-3">
      <div className="relative w-full max-w-[170px]">
        <div className="flex justify-center mb-3">
          <div className="relative">
            <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center">
              <BellIcon className="h-4 w-4 text-foreground" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-destructive flex items-center justify-center">
              <span className="text-[7px] font-bold text-white">
                {visibleCount}
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          {notifications.map((notif, i) => (
            <div
              key={notif.title}
              className={cn(
                'flex items-start gap-1.5 rounded border bg-background p-1.5 shadow-sm transition-all duration-500',
                i < visibleCount
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-2',
              )}
            >
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Building className="h-2.5 w-2.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[8px] font-medium truncate">
                  {notif.title}
                </div>
                <div className="text-[7px] text-muted-foreground truncate">
                  {notif.desc}
                </div>
              </div>
              {i < visibleCount && (
                <div className="h-1 w-1 rounded-full bg-primary shrink-0 mt-1 animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Features data ──────────────────────────────────────── */

const steps = [
  {
    step: '01',
    title: 'Kanban personalizado',
    icon: LayoutTemplateIcon,
    description:
      'Selecione um template pronto ou monte um fluxo sob medida para cada tipo de abertura de empresa.',
    animation: <KanbanAnimation />,
  },
  {
    step: '02',
    title: 'Formulrio para o cliente',
    icon: FileTextIcon,
    description:
      'Crie o card e envie um link de formulrio para o cliente preencher os dados. Sem e-mails perdidos.',
    animation: <FormAnimation />,
  },
  {
    step: '03',
    title: 'Tarefas e automaes',
    icon: ZapIcon,
    description:
      'Marque etapas concludas e ative automaes nos sites de prefeitura: viabilidade, alvar e mais.',
    animation: <TasksAnimation />,
  },
  {
    step: '04',
    title: 'Notificaes automticas',
    icon: BellIcon,
    description:
      'Cliente e contabilidade so avisados a cada avano e quando o processo fica parado.',
    animation: <NotificationsAnimation />,
  },
];

/* ── Section ────────────────────────────────────────────── */

export function HowItWorks() {
  return (
    <section id="funcionalidades" className="relative py-24 md:py-32">
      {/* Section header */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={vp}
        variants={stagger(0.1)}
        className="mx-auto mb-16 max-w-2xl space-y-4 px-6 text-center lg:px-8"
      >
        <motion.div variants={staggerChild} className="flex justify-center">
          <div className="rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            Como funciona
          </div>
        </motion.div>
        <motion.h2
          variants={staggerChild}
          className="font-bold text-3xl tracking-tight md:text-5xl"
        >
          Da proposta empresa aberta{' '}
          <span className="text-primary">em 4 passos</span>
        </motion.h2>
        <motion.p
          variants={staggerChild}
          className="text-muted-foreground text-sm leading-relaxed md:text-base"
        >
          Organize cada etapa do processo societrio em um workflow claro,
          automatize tarefas repetitivas e reduza o tempo de abertura.
        </motion.p>
      </motion.div>

      {/* Steps grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={vp}
        variants={stagger(0.12, 0.1)}
        className="mx-auto max-w-7xl px-6 lg:px-8"
      >
        {/* Connecting line (desktop) */}
        <div className="hidden lg:block relative mb-8">
          <motion.div
            className="absolute left-[12.5%] right-[12.5%] top-1/2 h-px bg-gradient-to-r from-transparent via-border to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          />
          <div className="flex justify-between px-[12.5%]">
            {steps.map((s) => (
              <motion.div
                key={s.step}
                variants={staggerChild}
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-background text-sm font-bold text-primary"
              >
                {s.step}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <motion.div
              key={step.step}
              variants={staggerChild}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group relative flex flex-col gap-5 rounded-2xl border border-border/60 bg-card p-5 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Step number (mobile) */}
              <div className="flex items-center gap-3 lg:hidden">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-primary/5 text-xs font-bold text-primary">
                  {step.step}
                </div>
                <step.icon className="size-5 text-primary" />
              </div>

              {/* Animation area */}
              <div className="relative h-44 w-full overflow-hidden rounded-xl border bg-muted/20">
                {step.animation}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <div className="hidden items-center gap-2 lg:flex">
                  <div className="flex w-fit items-center justify-center rounded-lg border bg-muted/20 p-2">
                    <step.icon className="size-4 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-base text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
