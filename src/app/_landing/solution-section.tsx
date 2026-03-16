'use client';

import { FadeIn } from './fade-in';
import {
  ArrowRight,
  ArrowDown,
  Workflow,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Mail,
  Smartphone,
  Monitor,
  ClipboardList,
} from 'lucide-react';
import Link from 'next/link';

const benefits = [
  'Todos os processos em um lugar só',
  'Quadros kanban que se adaptam ao seu escritório',
  'Automações que checam prefeituras por você',
  'Templates prontos para cada tipo de empresa',
  'Funciona para qualquer estado do Brasil',
];

export function SolutionSection() {
  return (
              <section id="solucao" className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/[0.02] to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Visual */}
          <FadeIn direction="left">
            <div className="relative">
              <div className="grid gap-6">
                {/* Before */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
                      Antes do Societiza
                    </span>
                  </div>
                  <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-muted-foreground" />
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <Smartphone className="w-4 h-4 text-muted-foreground" />
                      <Monitor className="w-4 h-4 text-muted-foreground" />
                      <ClipboardList className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground ml-1">5 ferramentas diferentes</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { label: 'Planilha_abertura_v3_FINAL(2).xlsx', color: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20' },
                        { label: 'WhatsApp: "Sócio, manda o RG de novo"', color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20' },
                        { label: 'Prefeitura: F5... F5... F5... F5...', color: 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20' },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className={`text-xs font-medium px-3 py-2 rounded-lg ${item.color}`}
                        >
                          {item.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <ArrowDown className="w-5 h-5 text-primary" />
                  </div>
                </div>

                {/* After */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-bold text-green-500 uppercase tracking-wider">
                      Com o Societiza
                    </span>
                  </div>
                  <div className="bg-card border-2 border-primary/20 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <Workflow className="w-5 h-5 text-primary" />
                      <span className="text-sm font-bold text-foreground">
                        Workflow Societário Unificado
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {['Documentação', 'Prefeitura', 'Aguardando', 'Concluído'].map(
                        (col) => (
                          <div
                            key={col}
                            className="flex-1 bg-primary/5 border border-primary/10 rounded-lg p-2 text-center"
                          >
                            <span className="text-[10px] font-semibold text-primary">
                              {col}
                            </span>
                            <div className="mt-1 h-4 bg-primary/10 rounded animate-pulse" />
                          </div>
                        )
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Automação: Viabilidade aprovada automaticamente
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Right - Copy */}
          <FadeIn direction="right">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  A solução
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight">
                  Um workflow que funciona{' '}
                  <span className="text-primary">do seu jeito</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  O Societiza centraliza todo o processo societário em um kanban
                  inteligente que se adapta ao seu escritório, não o contrário.
                </p>
              </div>

              {/* Benefits list */}
              <ul className="space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground font-medium">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl text-base font-bold hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Quero experimentar
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
