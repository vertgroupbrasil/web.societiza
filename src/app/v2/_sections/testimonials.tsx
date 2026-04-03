'use client';

import { cn } from '@societiza/lib/utils';
import { motion } from 'motion/react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@societiza/components/ui/shadcnui/avatar';
import { QuoteIcon, Star } from 'lucide-react';
import { stagger, staggerChild, vp } from '../_lib/animations';

/* ── Data ───────────────────────────────────────────────── */

const testimonials = [
  {
    quote:
      'Antes perdia 2 horas por dia acompanhando processos em prefeituras diferentes. Com o Societiza, tudo aparece no kanban automaticamente. Virou rotina da equipe.',
    image: 'https://unavatar.io/github/ferr',
    name: 'Ana Ferreira',
    role: 'Scia-contadora',
    company: 'Ferreira & Associados',
    rating: 5,
  },
  {
    quote:
      'Finalmente um sistema feito por quem entende de abertura de empresa de verdade. Os templates economizaram umas 3 semanas de configurao. Recomendo sem hesitar.',
    image: 'https://unavatar.io/github/carlos',
    name: 'Carlos Mendes',
    role: 'Diretor',
    company: 'Mendes Contabilidade',
    rating: 5,
  },
  {
    quote:
      'Nossa equipe cresceu 40% em volume de processos sem contratar ningum. O Societiza automatiza as partes chatas e libera o time para o que realmente importa.',
    image: 'https://unavatar.io/github/juliana',
    name: 'Juliana Costa',
    role: 'Head de Societrio',
    company: 'Grupo Atlas',
    rating: 5,
  },
];

/* ── Section ────────────────────────────────────────────── */

export function TestimonialsSection() {
  return (
    <section className="relative py-24 md:py-32 bg-muted/10">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_0%,var(--primary)/.03,transparent)]" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={vp}
        variants={stagger(0.1)}
        className="relative mx-auto mb-16 max-w-2xl space-y-4 px-6 text-center lg:px-8"
      >
        <motion.div variants={staggerChild} className="flex justify-center">
          <div className="rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            Depoimentos
          </div>
        </motion.div>
        <motion.h2
          variants={staggerChild}
          className="font-bold text-3xl tracking-tight md:text-5xl"
        >
          Quem usa, <span className="text-primary">no volta atrs</span>
        </motion.h2>
        <motion.p
          variants={staggerChild}
          className="text-muted-foreground text-sm leading-relaxed md:text-base"
        >
          Contabilidades de todo o Brasil j transformaram seu processo societrio
          com o Societiza.
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={vp}
        variants={stagger(0.12, 0.1)}
        className="relative mx-auto max-w-7xl px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <motion.figure
              key={t.name}
              variants={staggerChild}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              className={cn(
                'relative flex flex-col justify-between gap-6 rounded-2xl border border-border/60 bg-card p-6 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5',
                // Staggered vertical offset on desktop
                index === 1 && 'md:translate-y-8',
                index === 2 && 'md:translate-y-16',
              )}
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.4 + i * 0.08,
                      type: 'spring',
                      stiffness: 400,
                      damping: 15,
                    }}
                  >
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                  </motion.div>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="flex gap-3 flex-1">
                <QuoteIcon
                  aria-hidden="true"
                  className="size-5 shrink-0 stroke-1 text-muted-foreground/40"
                />
                <p className="flex-1 text-sm text-muted-foreground leading-relaxed">
                  {t.quote}
                </p>
              </blockquote>

              {/* Author */}
              <figcaption className="flex items-center gap-3 pt-4 border-t border-border/40">
                <Avatar className="size-10 rounded-full ring-2 ring-border ring-offset-2 ring-offset-background">
                  <AvatarImage alt={`${t.name}`} src={t.image} />
                  <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <cite className="font-medium text-foreground text-sm not-italic">
                    {t.name}
                  </cite>
                  <p className="text-muted-foreground text-xs">
                    {t.role},{' '}
                    <span className="text-foreground/80">{t.company}</span>
                  </p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
