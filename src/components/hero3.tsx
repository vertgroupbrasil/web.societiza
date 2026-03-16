'use client';

import { cn } from '@societiza/lib/utils';
import { Button } from '@societiza/components/ui/button';
import { ArrowRightIcon, ChevronRight, PhoneCallIcon } from 'lucide-react';
import { AnimatedGradientText, Highlighter } from './ui/magicui';
import { motion } from 'motion/react';
import { Safari } from './ui/safari';

export function HeroSection() {
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

  return (
    <section>
      <div className="relative flex flex-col items-center justify-center gap-5 px-4 py-12 md:px-4 md:py-24 lg:py-28">
        {/* X Faded Borders & Shades */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-1 size-full overflow-hidden"
        >
          <div
            className={cn(
              'absolute -inset-x-20 inset-y-0 z-0 rounded-full',
              'bg-[radial-gradient(ellipse_at_center,theme(--color-foreground/.1),transparent,transparent)]',
              'blur-[50px]',
            )}
          />
          <div className="absolute inset-y-0 left-4 w-px bg-linear-to-b from-transparent via-border to-border md:left-8" />
          <div className="absolute inset-y-0 right-4 w-px bg-linear-to-b from-transparent via-border to-border md:right-8" />
          <div className="absolute inset-y-0 left-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:left-12" />
          <div className="absolute inset-y-0 right-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:right-12" />
        </div>
        {/* Badge with AnimatedGradientText */}
        <motion.div className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#ff550020] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#ff550035]">
          <span
            className={cn(
              'animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#FF5500]/50 via-[#FF8C40]/50 to-[#FF5500]/50 bg-[length:300%_100%] p-[1px]',
            )}
            style={{
              WebkitMask:
                'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'destination-out',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'subtract',
              WebkitClipPath: 'padding-box',
            }}
          />
          <AnimatedGradientText
            colorFrom="#FF5500"
            colorTo="#FF8C40"
            speed={0.6}
            className="text-sm font-medium"
          >
            Workflow societário para contabilidades
          </AnimatedGradientText>
          <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </motion.div>

        <motion.h1
          {...fadeUp(0.08)}
          className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-center"
        >
          Seu societário <br />
          Seu{' '}
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
        </motion.h1>

        <motion.p
          {...fadeUp(0.16)}
          className="text-muted-foreground max-w-200  text-center text-base leading-relaxed"
        >
          Organize, automatize e acompanhe todo o processo de abertura de
          empresas em um workflow societário totalmente customizável.
        </motion.p>

        <div className="fade-in slide-in-from-bottom-10 flex w-fit animate-in items-center justify-center gap-3 fill-mode-backwards pt-2 delay-300 duration-500 ease-out">
          <Button variant="outline">
            <PhoneCallIcon data-icon="inline-start" /> Marque uma conversa
          </Button>
          <Button>
            Comece gratuitamente <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
      </div>
      {/* ── RIGHT: image ── */}
      <motion.div {...fadeUp(0.14)} className="relative">
        <Safari
          url="societiza.com.br/societario"
          imageSrc="/societario-light.png"
          className="w-full"
        />
      </motion.div>
    </section>
  );
}
