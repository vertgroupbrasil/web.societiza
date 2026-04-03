'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { vp } from '../_lib/animations';

export function PositioningSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Parallax text movement
  const textY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const opacity = useTransform(
    scrollYProgress,
    [0.1, 0.3, 0.7, 0.9],
    [0, 1, 1, 0],
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-32 md:py-44"
    >
      {/* Gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,var(--primary)/.05,transparent)]" />

      {/* Animated border lines */}
      <motion.div
        className="absolute left-1/2 top-0 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        whileInView={{ width: '60%' }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        whileInView={{ width: '60%' }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      />

      <motion.div
        style={{ y: textY, opacity }}
        className="relative mx-auto max-w-4xl px-6 text-center lg:px-8"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 text-sm font-medium uppercase tracking-widest text-primary"
        >
          Nossa misso
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="font-bold text-3xl leading-tight tracking-tight md:text-5xl lg:text-6xl"
        >
          Estamos mudando a maneira como o Brasil{' '}
          <span className="text-primary">abre empresas.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          className="mx-auto mt-8 max-w-2xl text-muted-foreground text-base leading-relaxed md:text-lg"
        >
          A burocracia brasileira no vai desaparecer. Mas a forma de lidar com
          ela pode evoluir. A Societiza nasceu com um objetivo claro:
          transformar o processo societrio em algo organizado, transparente e
          eficiente. Para que contadores possam focar no que realmente importa
          fazer seus clientes crescerem.
        </motion.p>
      </motion.div>
    </section>
  );
}
