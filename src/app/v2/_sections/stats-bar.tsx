'use client';

import { motion, useInView } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { stagger, staggerChild, vp } from '../_lib/animations';

/* ── Animated counter ───────────────────────────────────── */

function AnimatedNumber({
  value,
  suffix = '',
  prefix = '',
}: {
  value: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const steps = 40;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      // Ease-out curve
      const progress = 1 - Math.pow(1 - step / steps, 3);
      current = Math.round(value * progress);
      setDisplay(current);
      if (step >= steps) {
        setDisplay(value);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* ── Stats data ─────────────────────────────────────────── */

const stats = [
  { value: 500, suffix: '+', label: 'Empresas abertas na plataforma' },
  { value: 50, suffix: '+', label: 'Contabilidades ativas' },
  { value: 3, suffix: 'x', label: 'Mais rpido que planilhas' },
  { value: 98, suffix: '%', label: 'Satisfao dos clientes' },
];

/* ── Component ──────────────────────────────────────────── */

export function StatsBar() {
  return (
    <section className="relative border-y border-border/40 bg-muted/20">
      {/* Subtle shine sweep */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.03] to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 4,
        }}
      />
      <motion.div
        variants={stagger(0.12)}
        initial="hidden"
        whileInView="visible"
        viewport={vp}
        className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-14 md:grid-cols-4 lg:px-8"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={staggerChild}
            className="flex flex-col items-center text-center"
          >
            <span className="text-3xl font-bold text-foreground md:text-4xl">
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
            </span>
            <span className="mt-2 text-sm text-muted-foreground">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
