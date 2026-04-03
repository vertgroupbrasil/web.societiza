'use client';

import { cn } from '@societiza/lib/utils';
import { Button } from '@societiza/components/ui/button';
import { ArrowRightIcon, PhoneCallIcon, ChevronRight } from 'lucide-react';
import { AnimatedGradientText } from '@societiza/components/ui/magicui';
import { Safari } from '@societiza/components/ui/safari';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

/* ── Floating gradient orbs ─────────────────────────────── */

function GradientOrb({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={cn('absolute rounded-full', className)}
      animate={{
        x: [0, 40, -30, 10, 0],
        y: [0, -30, 20, -10, 0],
        scale: [1, 1.05, 0.95, 1.02, 1],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        ease: 'linear',
        delay,
      }}
    />
  );
}

/* ── Hero Section ───────────────────────────────────────── */

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Parallax for the mockup: moves up slower than scroll
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const mockupScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const orbOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden pt-16">
      {/* ── Background effects ─────────────────────────────── */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{ opacity: orbOpacity }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(circle, var(--border) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
        {/* Gradient orbs */}
        <GradientOrb
          className="left-[10%] top-[5%] h-[600px] w-[600px] bg-primary/20 blur-[160px]"
          delay={0}
        />
        <GradientOrb
          className="right-[5%] top-[30%] h-[500px] w-[500px] bg-[#FF8C40]/15 blur-[140px]"
          delay={8}
        />
        {/* Radial fade edges */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,transparent_50%,var(--background))]" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent" />
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-20 md:pt-28 lg:px-8 lg:pt-36">
        <div className="flex flex-col items-center text-center">
          {/* ── Badge ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.1,
            }}
            className="group relative mb-8 flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-5 py-2 backdrop-blur-sm shadow-[inset_0_-8px_10px_#ff550015] transition-shadow duration-500 hover:shadow-[inset_0_-5px_10px_#ff550030]"
          >
            {/* Animated gradient border */}
            <span
              className="absolute inset-0 animate-gradient rounded-[inherit] bg-gradient-to-r from-primary/40 via-[#FF8C40]/40 to-primary/40 bg-[length:300%_100%] p-[1px]"
              style={{
                WebkitMask:
                  'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'destination-out',
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'subtract',
              }}
            />
            <AnimatedGradientText
              colorFrom="#FF5500"
              colorTo="#FF8C40"
              speed={0.6}
              className="text-sm font-medium"
            >
              Plataforma #1 em operao societria
            </AnimatedGradientText>
            <ChevronRight className="size-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5" />
          </motion.div>

          {/* ── Headline ───────────────────────────────────── */}
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.2,
            }}
            className="max-w-5xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-7xl"
          >
            Chega de caos societrio.{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-primary">
                Escale com controle total.
              </span>
              <motion.span
                className="absolute -inset-x-2 bottom-1 z-0 h-[30%] rounded-sm bg-primary/12"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.9,
                }}
                style={{ transformOrigin: 'left' }}
              />
            </span>
          </motion.h1>

          {/* ── Subtitle ───────────────────────────────────── */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.4,
            }}
            className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Centralize abertura, alterao e encerramento de empresas em um
            workflow visual que elimina retrabalho e d previsibilidade real sua
            operao.
          </motion.p>

          {/* ── CTAs ───────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.55,
            }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Button size="lg" className="gap-2 rounded-full px-8">
              Comece gratuitamente
              <ArrowRightIcon className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 rounded-full px-8"
            >
              <PhoneCallIcon className="size-4" />
              Agende uma demo
            </Button>
          </motion.div>
        </div>

        {/* ── Safari Mockup with parallax ──────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.7,
          }}
          style={{ y: mockupY, scale: mockupScale }}
          className="relative mx-auto mt-16 max-w-5xl md:mt-20"
        >
          {/* Glow behind mockup */}
          <div className="absolute -inset-8 rounded-3xl bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-2xl" />
          <div className="absolute -inset-px rounded-xl bg-gradient-to-b from-primary/20 to-transparent opacity-50" />
          <Safari
            url="societiza.com.br/societario"
            imageSrc="/societario-light.png"
            className="relative w-full"
          />
        </motion.div>
      </div>

      {/* Bottom gradient fade into next section */}
      <div className="h-24 bg-gradient-to-b from-transparent to-background" />
    </section>
  );
}
