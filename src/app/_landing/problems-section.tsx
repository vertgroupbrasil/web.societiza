'use client';

import { FadeIn, StaggerContainer, StaggerItem } from './fade-in';
import {
  FileSpreadsheet,
  Unplug,
  MonitorSmartphone,
  Timer,
  AlertTriangle,
} from 'lucide-react';

const problems = [
  {
    icon: FileSpreadsheet,
    title: 'Planilhas infinitas',
    description:
      'Abertura de empresa, alteração contratual, encerramento... tudo controlado em planilhas diferentes que ninguém mantém atualizada.',
  },
  {
    icon: Unplug,
    title: 'Sistemas desconectados',
    description:
      'Um sistema para contrato, outro pro CNPJ, e-mail pra cliente, WhatsApp pra sócio. Informação espalhada em 5 lugares.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Sites de prefeitura',
    description:
      'Entrar manualmente no site da prefeitura todo dia pra ver se saiu o alvará ou a viabilidade. Tempo jogado fora.',
  },
  {
    icon: Timer,
    title: 'Horas desperdicadas',
    description:
      'Horas por semana gastas organizando processos ao invés de atender clientes. Seu tempo vale mais que isso.',
  },
];

export function ProblemsSection() {
  return (
    <section id="problema" className="py-20 lg:py-32 relative">
      <div className="absolute inset-0 bg-muted/30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            O problema
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mt-3 leading-tight">
            O caos que você{' '}
            <span className="text-muted-foreground line-through decoration-primary/50">
              já conhece
            </span>{' '}
            vive todo dia
          </h2>
          <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
            Se você é contador, sabe: o processo societário brasileiro é um labirinto
            de burocracia, sistemas e improviso.
          </p>
        </FadeIn>

        {/* Problem cards */}
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem) => (
            <StaggerItem key={problem.title}>
              <div className="bg-card border border-border rounded-2xl p-6 h-full hover:border-destructive/30 transition-all group">
                <div className="space-y-4">
                  <div className="w-11 h-11 rounded-xl bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/15 transition-colors">
                    <problem.icon className="w-5 h-5 text-destructive" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    {problem.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Emotional statement */}
        <FadeIn delay={0.4} className="text-center mt-16">
          <div className="inline-flex items-center gap-3 bg-card border border-border rounded-2xl px-8 py-5">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <p className="text-left text-sm sm:text-base text-muted-foreground">
              <strong className="text-foreground">
                67% dos contadores
              </strong>{' '}
              dizem que processos societários são a maior dor do dia a dia.
              <br />
              <span className="text-xs text-muted-foreground/70">
                E se existisse um jeito melhor?
              </span>
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
