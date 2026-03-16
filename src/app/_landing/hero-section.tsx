'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Zap, Shield } from 'lucide-react';
import { motion } from 'motion/react';

const avatarColors = ['bg-orange-400', 'bg-amber-500', 'bg-rose-400', 'bg-orange-600'];
const avatarInitials = ['A', 'R', 'C', 'M'];

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/[0.10] rounded-full blur-[160px] translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/[0.04] rounded-full blur-[100px] -translate-x-1/2 translate-y-1/4" />
      </div>

      {/* ── LEFT content — constrained ── */}
      <div className="relative lg:absolute lg:inset-y-0 lg:left-0 lg:w-[46%] flex items-center">
        <div className="w-full px-6 lg:px-12 xl:px-20 pt-32 pb-16 lg:pt-0 lg:pb-0">
          <div className="flex flex-col max-w-xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.45 }}
              className="inline-flex items-center gap-3 bg-card border border-border rounded-full pl-1.5 pr-4 py-1.5 w-fit mb-8"
            >
              <div className="flex items-center -space-x-2">
                {avatarColors.map((color, i) => (
                  <div
                    key={i}
                    className={`w-7 h-7 rounded-full ${color} border-2 border-card flex items-center justify-center text-[10px] font-bold text-white`}
                  >
                    {avatarInitials[i]}
                  </div>
                ))}
              </div>
              <span className="text-sm text-foreground font-medium">
                Escolhido por <span className="font-bold">+500 contadores</span>
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.45 }}
              className="text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold text-foreground leading-[1.04] tracking-tight"
            >
              Abra empresas.
              <br />
              <span className="text-primary">Sem complicação.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26, duration: 0.45 }}
              className="mt-6 text-lg text-muted-foreground leading-relaxed"
            >
              Substitua planilhas e e-mails por um workflow societário inteligente.
              Feito para contadores, despachantes e escritórios de contabilidade.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34, duration: 0.45 }}
              className="mt-10 flex items-center gap-5"
            >
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-full text-base font-bold hover:bg-primary/90 transition-all hover:scale-[1.03] active:scale-[0.98] shadow-lg shadow-primary/25"
              >
                Começar agora
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#como-funciona"
                className="text-base font-semibold text-foreground hover:text-primary transition-colors"
              >
                Por que usar?
              </Link>
            </motion.div>

            {/* Mini features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.44, duration: 0.45 }}
              className="mt-10 flex items-center gap-8"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-none">Rápido</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Setup em minutos</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-none">Seguro</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Dados criptografados</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── RIGHT — full-bleed screenshot, clipped by section overflow-hidden ── */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
        className="hidden lg:block absolute top-[8%] bottom-[8%] left-[48%] right-[-10px]"
      >
        {/* Glow */}
        <div className="absolute -left-20 inset-y-0 w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

        {/* Browser window — tall, fills height */}
        <div className="relative h-full rounded-l-2xl border border-border border-r-0 bg-card overflow-hidden shadow-2xl shadow-black/20">
          {/* macOS title bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-muted/60 border-b border-border shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-background/80 border border-border rounded-md px-4 py-1 text-xs text-muted-foreground min-w-[200px] text-center select-none">
                societiza.com.br/societario
              </div>
            </div>
            <div className="w-[52px]" />
          </div>

          {/* Screenshot fills remaining height, object-cover crops it naturally */}
          <div className="relative w-full h-[calc(100%-24px)]">
            <Image
              src="/societario-light.png"
              alt="Societiza app"
              fill
              className="object-cover object-left-top block dark:hidden"
              priority
            />
            <Image
              src="/societario-dark.png"
              alt="Societiza app"
              fill
              className="object-cover object-left-top hidden dark:block"
              priority
            />
          </div>
        </div>
      </motion.div>

      {/* Mobile fallback — normal screenshot below text */}
      <div className="lg:hidden px-6 pb-12 pt-4">
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xl">
          <div className="flex items-center gap-2 px-4 py-3 bg-muted/60 border-b border-border">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
            </div>
          </div>
          <Image src="/societario-light.png" alt="Societiza app" width={1920} height={1080} className="w-full h-auto block dark:hidden" />
          <Image src="/societario-dark.png" alt="Societiza app" width={1920} height={1080} className="w-full h-auto hidden dark:block" />
        </div>
      </div>

      {/* Spacer so section has height on desktop */}
      <div className="hidden lg:block" style={{ minHeight: '100vh' }} />
    </section>
  );
}
