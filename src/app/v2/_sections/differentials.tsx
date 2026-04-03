'use client';

import { cn } from '@societiza/lib/utils';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import type { MouseEvent } from 'react';
import {
  Kanban,
  SlidersHorizontal,
  LayoutTemplate,
  Zap,
  MapPin,
  Settings2,
} from 'lucide-react';
import { stagger, staggerChild, vp } from '../_lib/animations';

/* ── Feature data ───────────────────────────────────────── */

const features = [
  {
    icon: Kanban,
    title: 'Kanban 100% customizvel',
    description:
      'Crie seu prprio fluxo societrio. Adicione colunas, etapas e status que refletem exatamente como seu escritrio trabalha.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Tarefas configurveis',
    description:
      'Configure checklists, campos personalizados e responsabilidades exclusivos para cada etapa do processo.',
  },
  {
    icon: LayoutTemplate,
    title: 'Templates prontos',
    description:
      'Comece em minutos com modelos pr-configurados para abertura, alterao e encerramento de empresas.',
  },
  {
    icon: Zap,
    title: 'Automao de etapas',
    description:
      'Automatize o que  repetitivo. Avance etapas, dispare notificaes e consulte prefeituras sem esforo.',
  },
  {
    icon: MapPin,
    title: 'Multi-estado',
    description:
      'Funciona em todos os estados do Brasil. Cada prefeitura tem suas regras? O Societiza se adapta a cada uma.',
  },
  {
    icon: Settings2,
    title: 'Seu sistema, do seu jeito',
    description:
      'A maioria dos sistemas fora voc a se adaptar. Aqui  o contrrio: o Societiza respeita como cada contabilidade trabalha.',
  },
];

/* ── 3D tilt card ───────────────────────────────────────── */

function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), {
    stiffness: 300,
    damping: 30,
  });

  function handleMouse(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={cn('will-change-transform', className)}
    >
      {children}
    </motion.div>
  );
}

/* ── Section ────────────────────────────────────────────── */

export function DifferentialsSection() {
  return (
    <section id="diferenciais" className="relative py-24 md:py-32 bg-muted/10">
      {/* Background dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage: `radial-gradient(circle, var(--border) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
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
            Diferenciais
          </div>
        </motion.div>
        <motion.h2
          variants={staggerChild}
          className="font-bold text-3xl tracking-tight md:text-5xl"
        >
          Feito para quem vive de{' '}
          <span className="text-primary">societrio.</span>
        </motion.h2>
        <motion.p
          variants={staggerChild}
          className="text-muted-foreground text-sm leading-relaxed md:text-base"
        >
          A maioria dos softwares fora sua contabilidade a se adaptar ao
          sistema. A Societiza faz o contrrio.
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={vp}
        variants={stagger(0.08, 0.1)}
        className="relative mx-auto max-w-7xl px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <motion.div key={feature.title} variants={staggerChild}>
              <TiltCard className="h-full">
                <div className="group relative flex h-full flex-col gap-5 rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
                  {/* Icon */}
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border bg-muted/30 transition-colors duration-300 group-hover:bg-primary/10 group-hover:border-primary/20">
                    <feature.icon className="size-5 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-base text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
