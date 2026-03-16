"use client";

import { cn } from "@societiza/lib/utils";
import type React from "react";
import { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";
import { DecorIcon } from "@societiza/components/ui/decor-icon";

type FeatureType = {
  title: string;
  step: string;
  icon: React.ReactNode;
  description: string;
  animation: React.ReactNode;
};

export function FeatureSection2() {
  return (
    <div className="mx-auto flex w-full flex-col gap-12 py-12">
      <div className="mx-auto max-w-2xl space-y-3 text-center">
        <h2 className="font-semibold text-3xl tracking-tight md:text-4xl lg:text-5xl">
          Abrir empresas nunca foi tão fácil
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          Organize cada etapa do processo societário em um workflow claro,
          automatize tarefas repetitivas e reduza o tempo gasto na abertura de
          empresas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <FeatureCard feature={feature} key={feature.title} />
        ))}
      </div>
    </div>
  );
}

function FeatureCard({
  feature,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  feature: FeatureType;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-between gap-6 bg-background px-6 pt-8 pb-6 shadow-xs",
        "dark:bg-[radial-gradient(50%_80%_at_25%_0%,--theme(--color-foreground/.1),transparent)]",
        className
      )}
      {...props}
    >
      {/* Extended Borders */}
      <div className="absolute -inset-y-4 -left-px w-px bg-border" />
      <div className="absolute -inset-y-4 -right-px w-px bg-border" />
      <div className="absolute -inset-x-4 -top-px h-px bg-border" />
      <div className="absolute -right-4 -bottom-px -left-4 h-px bg-border" />

      {/* Corner Decor */}
      <DecorIcon className="size-3.5" position="top-left" />

      {/* Animation Display Area */}
      <div className="relative h-40 w-full overflow-hidden rounded-lg bg-muted/20 border">
        {feature.animation}
      </div>

      <div className="relative z-10 flex items-start justify-between gap-2">
        <div
          className={cn(
            "flex w-fit items-center justify-center rounded-lg border bg-muted/20 p-3",
            "[&_svg]:size-5 [&_svg]:stroke-[1.5] [&_svg]:text-foreground"
          )}
        >
          {feature.icon}
        </div>
        <span className="text-xs font-medium text-muted-foreground/60 tabular-nums">
          {feature.step}
        </span>
      </div>

      <div className="relative z-10 space-y-2">
        <h3 className="font-medium text-base text-foreground">
          {feature.title}
        </h3>
        <p className="text-muted-foreground text-xs leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

// Kanban Animation Component with Interactive Sheet
function KanbanAnimation() {
  const [cardColumn, setCardColumn] = useState(0);
  const [showSheet, setShowSheet] = useState(false);
  const [checkedTasks, setCheckedTasks] = useState<boolean[]>([false, false, false]);
  const [isAnimatingClick, setIsAnimatingClick] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 20, y: 50 });

  const columns = ["Proposta", "Viabilidade", "Registro"];

  const resetAnimation = useCallback(() => {
    setCardColumn(0);
    setShowSheet(false);
    setCheckedTasks([false, false, false]);
    setIsAnimatingClick(false);
    setCursorPosition({ x: 20, y: 50 });
  }, []);

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];

    const runAnimation = () => {
      // Phase 1: Move cursor to card and click
      timeouts.push(setTimeout(() => {
        setCursorPosition({ x: 30, y: 65 });
      }, 500));

      timeouts.push(setTimeout(() => {
        setIsAnimatingClick(true);
      }, 1000));

      timeouts.push(setTimeout(() => {
        setIsAnimatingClick(false);
        setShowSheet(true);
      }, 1200));

      // Phase 2: Check tasks one by one
      timeouts.push(setTimeout(() => {
        setCheckedTasks([true, false, false]);
      }, 2000));

      timeouts.push(setTimeout(() => {
        setCheckedTasks([true, true, false]);
      }, 2600));

      timeouts.push(setTimeout(() => {
        setCheckedTasks([true, true, true]);
      }, 3200));

      // Phase 3: Close sheet and move card
      timeouts.push(setTimeout(() => {
        setShowSheet(false);
      }, 3800));

      timeouts.push(setTimeout(() => {
        setCardColumn(1);
        setCheckedTasks([false, false, false]);
      }, 4200));

      // Repeat for second column
      timeouts.push(setTimeout(() => {
        setCursorPosition({ x: 95, y: 65 });
      }, 4800));

      timeouts.push(setTimeout(() => {
        setIsAnimatingClick(true);
      }, 5300));

      timeouts.push(setTimeout(() => {
        setIsAnimatingClick(false);
        setShowSheet(true);
      }, 5500));

      timeouts.push(setTimeout(() => {
        setCheckedTasks([true, false, false]);
      }, 6200));

      timeouts.push(setTimeout(() => {
        setCheckedTasks([true, true, false]);
      }, 6800));

      timeouts.push(setTimeout(() => {
        setCheckedTasks([true, true, true]);
      }, 7400));

      timeouts.push(setTimeout(() => {
        setShowSheet(false);
      }, 8000));

      timeouts.push(setTimeout(() => {
        setCardColumn(2);
      }, 8400));

      // Reset and loop
      timeouts.push(setTimeout(() => {
        resetAnimation();
      }, 10000));
    };

    runAnimation();

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [cardColumn === 0 && !showSheet, resetAnimation]);

  return (
    <div className="relative flex h-full w-full items-start justify-center gap-1 p-3 pt-4">
      {/* Cursor */}
      <div
        className={cn(
          "absolute z-30 transition-all duration-500 ease-out pointer-events-none",
          isAnimatingClick && "scale-90"
        )}
        style={{
          left: `${cursorPosition.x}%`,
          top: `${cursorPosition.y}%`,
          transform: "translate(-50%, -50%)",
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

      {/* Kanban Columns */}
      {columns.map((column, colIndex) => (
        <div
          key={column}
          className="flex h-full w-1/3 flex-col gap-1.5 rounded bg-muted/40 p-1.5"
        >
          <span className="text-[8px] font-medium text-muted-foreground text-center truncate px-0.5">
            {column}
          </span>
          <div className="flex flex-col gap-1 flex-1 relative">
            {/* Static cards in columns */}
            {colIndex === 2 && cardColumn === 2 && (
              <div className="h-6 rounded bg-primary/20 border border-primary/40 shadow-sm" />
            )}
            {colIndex === 1 && cardColumn >= 1 && cardColumn < 2 && (
              <div
                className={cn(
                  "h-6 rounded bg-primary/20 border border-primary/40 shadow-sm transition-all duration-500",
                  cardColumn === 1 && "ring-2 ring-primary/30"
                )}
              />
            )}
            {colIndex === 0 && cardColumn === 0 && (
              <div
                className={cn(
                  "h-6 rounded bg-primary/20 border border-primary/40 shadow-sm transition-all duration-300",
                  isAnimatingClick && "ring-2 ring-primary/50 scale-95"
                )}
              />
            )}
            {/* Placeholder cards */}
            {colIndex === 0 && (
              <>
                <div className="h-6 rounded bg-background/80 border shadow-sm opacity-40" />
              </>
            )}
          </div>
        </div>
      ))}

      {/* Sheet Overlay */}
      {showSheet && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-[2px] p-2">
          <div className="w-[85%] max-w-[160px] rounded-lg border bg-background shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Sheet Header */}
            <div className="flex items-center justify-between gap-2 p-2 border-b bg-muted/30">
              <div className="h-2.5 w-16 rounded bg-muted animate-pulse" />
              <X className="h-3 w-3 text-muted-foreground" />
            </div>

            {/* Sheet Content - Skeleton Tasks */}
            <div className="p-2 space-y-1.5">
              {[0, 1, 2].map((taskIndex) => (
                <div
                  key={taskIndex}
                  className={cn(
                    "flex items-center gap-2 p-1.5 rounded border transition-all duration-300",
                    checkedTasks[taskIndex]
                      ? "bg-primary/10 border-primary/30"
                      : "bg-muted/20 border-transparent"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-3 w-3 items-center justify-center rounded border transition-all duration-300 shrink-0",
                      checkedTasks[taskIndex]
                        ? "bg-primary border-primary"
                        : "bg-background border-muted-foreground/30"
                    )}
                  >
                    {checkedTasks[taskIndex] && (
                      <Check className="h-2 w-2 text-primary-foreground" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "h-2 rounded bg-muted flex-1",
                      checkedTasks[taskIndex] ? "opacity-50" : "animate-pulse"
                    )}
                    style={{ width: `${60 + taskIndex * 10}%` }}
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

// Form Animation Component
function FormAnimation() {
  const NAME = "Empresa ABC Ltda";
  const CNPJ = "00.000.000/0001";
  const [nameText, setNameText] = useState("");
  const [cnpjText, setCnpjText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    const run = () => {
      setNameText("");
      setCnpjText("");
      setSubmitted(false);

      NAME.split("").forEach((_, i) => {
        timers.push(setTimeout(() => setNameText(NAME.slice(0, i + 1)), 400 + i * 65));
      });

      const afterName = 400 + NAME.length * 65 + 300;

      CNPJ.split("").forEach((_, i) => {
        timers.push(setTimeout(() => setCnpjText(CNPJ.slice(0, i + 1)), afterName + i * 50));
      });

      const afterCnpj = afterName + CNPJ.length * 50 + 400;

      timers.push(setTimeout(() => setSubmitted(true), afterCnpj));
      timers.push(setTimeout(run, afterCnpj + 1800));
    };

    timers.push(setTimeout(run, 300));
    return () => timers.forEach(clearTimeout);
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
              <span className="text-[8px] text-muted-foreground">{cnpjText}</span>
              {cnpjText.length > 0 && cnpjText.length < CNPJ.length && (
                <span className="w-px h-2.5 bg-foreground animate-pulse" />
              )}
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[7px] text-muted-foreground">E-mail</div>
            <div className="h-4 rounded border bg-muted/30 flex items-center gap-1 px-1">
              <Mail className="h-2 w-2 text-muted-foreground" />
              <span className="text-[8px] text-muted-foreground">contato@...</span>
            </div>
          </div>
        </div>
        <div
          className={cn(
            "h-5 rounded flex items-center justify-center transition-all duration-300",
            submitted ? "bg-primary" : "bg-primary/40"
          )}
        >
          <span className="text-[8px] text-primary-foreground font-medium">
            {submitted ? "Enviado ✓" : "Enviar"}
          </span>
        </div>
      </div>
    </div>
  );
}

// Tasks & Automations Animation Component
function TasksAnimation() {
  const tasks = [
    { label: "Consulta CNPJ" },
    { label: "Viabilidade" },
    { label: "Registro Junta" },
    { label: "Alvará" },
  ];
  const [checkedCount, setCheckedCount] = useState(0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    const run = () => {
      setCheckedCount(0);
      tasks.forEach((_, i) => {
        timers.push(setTimeout(() => setCheckedCount(i + 1), 600 + i * 800));
      });
      timers.push(setTimeout(run, 600 + tasks.length * 800 + 1500));
    };

    timers.push(setTimeout(run, 400));
    return () => timers.forEach(clearTimeout);
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
                "flex items-center gap-1.5 rounded border bg-background p-1.5 transition-all duration-500",
                done && "bg-primary/5 border-primary/30"
              )}
            >
              <div
                className={cn(
                  "flex h-3 w-3 items-center justify-center rounded-full border transition-all duration-300 shrink-0",
                  done ? "bg-primary border-primary" : "bg-muted/30 border-muted-foreground/30",
                  active && "animate-pulse border-primary/50"
                )}
              >
                {done && <Check className="h-2 w-2 text-primary-foreground" />}
              </div>
              <span className={cn("text-[9px] font-medium transition-colors duration-300", done && "text-primary")}>
                {task.label}
              </span>
              {index === 2 && (
                <ZapIcon className={cn("ml-auto h-2.5 w-2.5 transition-colors duration-300", done ? "text-primary" : "text-muted-foreground/40")} />
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

// Notifications Animation Component
function NotificationsAnimation() {
  const notifications = [
    { title: "Processo atualizado", desc: "Viabilidade aprovada" },
    { title: "Novo documento", desc: "Contrato disponível" },
    { title: "Ação necessária", desc: "Assinar CNPJ" },
  ];
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    const run = () => {
      setVisibleCount(0);
      notifications.forEach((_, i) => {
        timers.push(setTimeout(() => setVisibleCount(i + 1), 500 + i * 700));
      });
      timers.push(setTimeout(run, 500 + notifications.length * 700 + 1500));
    };

    timers.push(setTimeout(run, 300));
    return () => timers.forEach(clearTimeout);
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
              <span className="text-[7px] font-bold text-white">{visibleCount}</span>
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          {notifications.map((notif, i) => (
            <div
              key={notif.title}
              className={cn(
                "flex items-start gap-1.5 rounded border bg-background p-1.5 shadow-sm transition-all duration-500",
                i < visibleCount ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              )}
            >
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Building className="h-2.5 w-2.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[8px] font-medium truncate">{notif.title}</div>
                <div className="text-[7px] text-muted-foreground truncate">{notif.desc}</div>
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

const features: FeatureType[] = [
  {
    step: "01",
    title: "Kanban personalizado",
    icon: <LayoutTemplateIcon />,
    description:
      "Selecione um template de kanban pronto ou monte um fluxo sob medida para cada tipo de abertura de empresa.",
    animation: <KanbanAnimation />,
  },
  {
    step: "02",
    title: "Formulário para o cliente",
    icon: <FileTextIcon />,
    description:
      "Crie o card e envie um link de formulário para o cliente preencher os dados da empresa. Sem e-mails perdidos.",
    animation: <FormAnimation />,
  },
  {
    step: "03",
    title: "Tarefas e automações",
    icon: <ZapIcon />,
    description:
      "Marque as etapas concluídas e ative automações nos sites de prefeitura: viabilidade, alvará, e muito mais.",
    animation: <TasksAnimation />,
  },
  {
    step: "04",
    title: "Notificações automáticas",
    icon: <BellIcon />,
    description:
      "Cliente e contabilidade são avisados a cada avanço e quando o processo fica parado por muito tempo.",
    animation: <NotificationsAnimation />,
  },
];
