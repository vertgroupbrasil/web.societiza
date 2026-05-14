'use client';

import { FadeIn, StaggerContainer, StaggerItem } from './fade-in';
import { UserPlus, Settings2, Rocket, ArrowRight } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Crie sua conta',
    description:
      'Cadastro rápido e gratuito. Em menos de 2 minutos você já está dentro da plataforma.',
    detail: 'Sem cartão de crédito',
  },
  {
    step: '02',
    icon: Settings2,
    title: 'Configure seu workflow',
    description:
      'Use um template pronto ou crie seu fluxo do zero. Arraste, renomeie, customize. É tudo seu.',
    detail: 'Templates prontos disponíveis',
  },
  {
    step: '03',
    icon: Rocket,
    title: 'Deixe as automações trabalhar',
    description:
      'Ative as consultas automáticas e nunca mais entre no site da prefeitura. O Societiza avisa quando sair.',
    detail: 'Automações em 1 clique',
  },
];

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-20 lg:py-32 relative">
      <div className="absolute inset-0 bg-muted/30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Como funciona
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mt-3 leading-tight">
            Comece em <span className="text-primary">minutos</span>, não em
            semanas
          </h2>
          <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
            Sabemos que seu tempo é precioso. Por isso, o setup foi feito para
            ser o mais rápido e indolor possível.
          </p>
        </FadeIn>

        {/* Steps */}
        <StaggerContainer
          className="grid lg:grid-cols-3 gap-8"
          staggerDelay={0.15}
        >
          {steps.map((step, idx) => (
            <StaggerItem key={step.step}>
              <div className="relative">
                {/* Connector arrow */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-16 left-full w-full items-center justify-center z-0">
                    <ArrowRight className="w-5 h-5 text-border" />
                  </div>
                )}

                <div className="bg-card border border-border rounded-2xl p-8 relative z-10 h-full hover:border-primary/30 transition-all group text-center">
                  {/* Step icon */}
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 group-hover:bg-primary/15 transition-colors mb-6">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">
                        Passo {step.step}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                    <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mt-2">
                      {step.detail}
                    </span>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
