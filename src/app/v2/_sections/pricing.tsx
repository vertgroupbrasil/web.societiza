'use client';

import { cn } from '@societiza/lib/utils';
import { Button } from '@societiza/components/ui/button';
import { CheckIcon, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { OnlineFriends } from '@societiza/components/online-friends';
import { stagger, staggerChild, vp } from '../_lib/animations';

/* ── Data ───────────────────────────────────────────────── */

type Plan = {
  name: string;
  price: string;
  priceLabel?: string;
  audience: string;
  description: string;
  href?: string;
  includesTitle: string;
  includes: string[];
  limitsTitle: string;
  limits: string[];
  ctaLabel: string;
  isPopular?: boolean;
};

const plans: Plan[] = [
  {
    name: 'Salinha',
    price: 'Grtis',
    priceLabel: 'para sempre',
    audience: 'Para contadores independentes e pequenos volumes de processos',
    description:
      'Organize e profissionalize sua gesto societria sem nenhum custo.',
    includesTitle: 'Inclui',
    includes: [
      'Workflow societrio customizvel',
      'Notificao ao cliente',
      'Notificao inteligente ao contador',
      'Limite de 3 processos',
      '1 usurio',
    ],
    limitsTitle: 'Limites',
    limits: ['1 usurio', 'at 3 processos ativos'],
    ctaLabel: 'Comece agora',
    href: '#',
  },
  {
    name: 'Escritrio',
    isPopular: true,
    href: '#',
    price: 'R$ 109,90',
    priceLabel: 'por ms',
    audience: 'Para contabilidades que lidam com alto volume de processos',
    description:
      'Tudo do plano Salinha, preparado para equipes e maior escala de operao.',
    includesTitle: 'Tudo do Salinha, mais',
    includes: [
      'Colaborao entre usurios',
      'Gesto centralizada do escritrio',
      'Fluxos organizados para mltiplos clientes',
      'Processos ilimitados',
    ],
    limitsTitle: 'Limites',
    limits: ['at 3 usurios', 'processos ilimitados'],
    ctaLabel: 'Teste gratuitamente',
  },
];

/* ── Section ────────────────────────────────────────────── */

export function PricingSection() {
  return (
    <section id="precos" className="relative py-24 md:py-32 bg-muted/10">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,var(--primary)/.04,transparent)]" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={vp}
        variants={stagger(0.1)}
        className="relative mx-auto max-w-7xl px-6 lg:px-8"
      >
        {/* Header row */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Title block */}
          <motion.div
            variants={staggerChild}
            className="lg:col-span-2 flex flex-col justify-center"
          >
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary">
              Planos
            </p>
            <h2 className="font-bold text-3xl leading-tight md:text-5xl">
              Planos para quem vive de societrio
            </h2>
            <p className="mt-4 text-muted-foreground text-sm md:text-base">
              Da organizao do contador independente escala de escritrios
              contbeis.
            </p>
            <OnlineFriends className="mt-6 w-full max-w-xs" />
          </motion.div>

          {/* Plan cards */}
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={staggerChild}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className={cn(
                'relative flex flex-col rounded-2xl border bg-card transition-shadow duration-300',
                plan.isPopular
                  ? 'border-primary/40 shadow-lg shadow-primary/10'
                  : 'border-border/60 hover:shadow-lg hover:shadow-primary/5',
              )}
            >
              {/* Popular badge */}
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground shadow-md">
                  <Sparkles className="size-3" />
                  Mais popular
                </div>
              )}

              {/* Shine effect for popular plan */}
              {plan.isPopular && (
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-primary/[0.04] to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                    repeatDelay: 5,
                  }}
                />
              )}

              <div className="relative flex flex-col flex-1 p-6">
                {/* Plan name & price */}
                <div className="border-b border-border/40 pb-6">
                  <p className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    {plan.name}
                  </p>
                  <div className="mb-1 flex items-baseline gap-1">
                    <span className="font-bold text-4xl text-foreground">
                      {plan.price}
                    </span>
                  </div>
                  {plan.priceLabel && (
                    <p className="mb-4 text-xs text-muted-foreground">
                      {plan.priceLabel}
                    </p>
                  )}
                  <p className="mb-2 text-sm font-medium leading-relaxed">
                    {plan.audience}
                  </p>
                  <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
                    {plan.description}
                  </p>
                  <Button
                    asChild
                    className="w-full"
                    variant={plan.isPopular ? 'default' : 'outline'}
                  >
                    <a href={plan.href}>{plan.ctaLabel}</a>
                  </Button>
                </div>

                {/* Features */}
                <div className="space-y-3 pt-6 text-sm">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {plan.includesTitle}
                  </p>
                  {plan.includes.map((feature) => (
                    <p
                      className="flex items-center gap-2 text-foreground/80"
                      key={feature}
                    >
                      <CheckIcon className="size-4 text-primary shrink-0" />
                      {feature}
                    </p>
                  ))}
                  <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {plan.limitsTitle}
                  </p>
                  {plan.limits.map((limit) => (
                    <p
                      className="flex items-center gap-2 text-foreground/80"
                      key={limit}
                    >
                      <span className="text-muted-foreground"></span>
                      {limit}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
