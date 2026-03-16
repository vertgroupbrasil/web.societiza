'use client';

import Link from 'next/link';
import { cn } from '@societiza/lib/utils';
import { Button } from '@societiza/components/ui/button';
import { ArrowRightIcon, ZapIcon } from 'lucide-react';
import { DottedGlowBackground } from '@societiza/components/ui/shadcnui/dotted-glow-background';
import { AnimatedGradientText } from '@societiza/components/ui/magicui/animated-gradient-text';
import { Highlighter } from '@societiza/components/ui/magicui/highlighter';
import { Safari } from '@societiza/components/ui/safari';
import { motion } from 'motion/react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: {
    duration: 0.55,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    delay,
  },
});

export function HeroSection() {
  return (
    <div className="relative">
      {/* DottedGlowBackground */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <DottedGlowBackground
          className="absolute inset-0 z-0"
          gap={24}
          radius={1.5}
          opacity={0.5}
          glowColor="rgba(255, 85, 0, 0.7)"
          darkGlowColor="rgba(255, 85, 0, 0.85)"
          colorLightVar="--color-zinc-400"
          colorDarkVar="--color-zinc-600"
          speedScale={0.6}
        />
      </div>

      <div className="relative z-10">
        <div className="py-32 grid items-center lg:grid-cols-2">
          {/* ── LEFT: text content ── */}
          <div className="flex flex-col gap-6 lg:pr-12">
            {/* Badge with AnimatedGradientText */}
            <motion.a
              {...fadeUp(0)}
              className={cn(
                'group flex w-fit items-center gap-2 rounded-full border bg-card px-3 py-1.5 shadow',
                'transition-all hover:shadow-md',
              )}
              href="#solucao"
            >
              <AnimatedGradientText
                colorFrom="#FF5500"
                colorTo="#FF8C40"
                speed={0.6}
                className="text-xs font-medium"
              >
                Workflow societário para contabilidades
              </AnimatedGradientText>
              <ArrowRightIcon className="size-3 text-primary -translate-x-0.5 duration-150 ease-out group-hover:translate-x-0.5" />
            </motion.a>

            {/* Headline */}
            <motion.h1
              {...fadeUp(0.08)}
              className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Seu societário. Seu{' '}
              <Highlighter
                action="highlight"
                color="rgba(255, 85, 0, 0.18)"
                strokeWidth={2}
                animationDuration={800}
                isView
                delay={700}
              >
                controle
              </Highlighter>
              .
            </motion.h1>

            <motion.p
              {...fadeUp(0.16)}
              className="text-muted-foreground text-base leading-relaxed"
            >
              Organize e automatize a abertura de empresas com um kanban
              totalmente customizável.
            </motion.p>

            <motion.div
              {...fadeUp(0.24)}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Button asChild size="lg" className="h-11 sm:w-auto">
                <Link href="/login">
                  Começar demonstração
                  <ArrowRightIcon data-icon="inline-end" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-11 sm:w-auto"
              >
                <Link href="#solucao">Quero conhecer a Societiza</Link>
              </Button>
            </motion.div>

            <motion.p
              {...fadeUp(0.3)}
              className="text-muted-foreground text-xs"
            >
              <ZapIcon className="mr-1 inline-block size-3" />
              Grátis para começar · Sem cartão de crédito · Setup em 5 minutos
            </motion.p>
          </div>

          {/* ── RIGHT: image ── */}
          <motion.div
            {...fadeUp(0.14)}
            className="relative hidden lg:block lg:-mr-[20vw] lg:-mt-20 lg:-mb-8"
          >
            <Safari
              url="app.societiza.com.br"
              imageSrc="/societario-light.png"
              className="w-full"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
