'use client';

import { Button } from '@societiza/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { stagger, staggerChild, vp } from '../_lib/animations';

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,var(--primary)/.06,transparent)]" />
        {/* Animated gradient lines */}
        <motion.div
          className="absolute left-0 top-1/3 h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute left-0 bottom-1/3 h-px w-full bg-gradient-to-r from-transparent via-primary/10 to-transparent"
          animate={{ x: ['100%', '-100%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={vp}
        variants={stagger(0.12)}
        className="relative mx-auto max-w-3xl px-6 text-center lg:px-8"
      >
        <motion.h2
          variants={staggerChild}
          className="font-bold text-3xl leading-tight tracking-tight md:text-5xl lg:text-6xl"
        >
          Sua operao societria merece ser{' '}
          <span className="text-primary">escalvel.</span>
        </motion.h2>

        <motion.p
          variants={staggerChild}
          className="mx-auto mt-6 max-w-xl text-muted-foreground text-base md:text-lg"
        >
          Com a Societiza, a abertura de empresas acontece de forma simples,
          rpida e organizada. Pare de perder horas com burocracia.
        </motion.p>

        <motion.div
          variants={staggerChild}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            size="lg"
            className="gap-2 rounded-full px-10 shadow-lg shadow-primary/25"
          >
            Cansei das planilhas
            <ArrowRightIcon className="size-4" />
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-10">
            Agende uma conversa
          </Button>
        </motion.div>

        {/* Trust text */}
        <motion.p
          variants={staggerChild}
          className="mt-8 text-xs text-muted-foreground"
        >
          Sem carto de crdito Comece grtis em 30 segundos
        </motion.p>
      </motion.div>
    </section>
  );
}
