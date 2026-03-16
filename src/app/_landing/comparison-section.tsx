'use client';

import { FadeIn } from './fade-in';
import { Check, X, Minus } from 'lucide-react';

const rows = [
  {
    feature: 'Kanban societário',
    societiza: 'full',
    traditional: 'partial',
    detail: 'Customizável vs. engessado',
  },
  {
    feature: 'Automação de prefeituras',
    societiza: 'full',
    traditional: 'none',
    detail: 'Consulta automática de alvará, viabilidade, IE',
  },
  {
    feature: 'Templates prontos',
    societiza: 'full',
    traditional: 'none',
    detail: 'Modelos para abertura, alteração, encerramento',
  },
  {
    feature: 'Tarefas customizáveis',
    societiza: 'full',
    traditional: 'none',
    detail: 'Checklists, campos e prazos personalizados',
  },
  {
    feature: 'Multi-estado',
    societiza: 'full',
    traditional: 'partial',
    detail: 'Funciona em qualquer estado do Brasil',
  },
  {
    feature: 'Integração fácil',
    societiza: 'full',
    traditional: 'none',
    detail: 'Setup em minutos, sem treinamento longo',
  },
  {
    feature: 'Centralização total',
    societiza: 'full',
    traditional: 'none',
    detail: 'Todos os processos em um lugar só',
  },
];

function StatusIcon({ status }: { status: string }) {
  if (status === 'full')
    return (
      <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-500/15 flex items-center justify-center">
        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
      </div>
    );
  if (status === 'partial')
    return (
      <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-500/15 flex items-center justify-center">
        <Minus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
      </div>
    );
  return (
    <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-500/15 flex items-center justify-center">
      <X className="w-4 h-4 text-red-500 dark:text-red-400" />
    </div>
  );
}

export function ComparisonSection() {
  return (
    <section className="py-20 lg:py-32 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Comparação
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mt-3 leading-tight">
            Por que o Societiza é{' '}
            <span className="text-primary">diferente</span>?
          </h2>
          <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
            Não somos apenas mais um kanban. Somos o único workflow societário
            com automações reais no Brasil.
          </p>
        </FadeIn>

        {/* Comparison table */}
        <FadeIn delay={0.2}>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_120px_120px] sm:grid-cols-[1fr_150px_150px] border-b border-border">
              <div className="p-4 sm:p-5">
                <span className="text-sm font-semibold text-muted-foreground">
                  Funcionalidade
                </span>
              </div>
              <div className="p-4 sm:p-5 text-center bg-primary/5 border-x border-border">
                <span className="text-sm font-bold text-primary">
                  Societiza
                </span>
              </div>
              <div className="p-4 sm:p-5 text-center">
                <span className="text-sm font-semibold text-muted-foreground">
                  Tradicional
                </span>
              </div>
            </div>

            {/* Table rows */}
            {rows.map((row, idx) => (
              <div
                key={row.feature}
                className={`grid grid-cols-[1fr_120px_120px] sm:grid-cols-[1fr_150px_150px] ${
                  idx !== rows.length - 1 ? 'border-b border-border' : ''
                } hover:bg-muted/30 transition-colors`}
              >
                <div className="p-4 sm:p-5">
                  <span className="text-sm font-medium text-foreground block">
                    {row.feature}
                  </span>
                  <span className="text-xs text-muted-foreground hidden sm:block mt-0.5">
                    {row.detail}
                  </span>
                </div>
                <div className="p-4 sm:p-5 flex items-center justify-center bg-primary/5 border-x border-border">
                  <StatusIcon status={row.societiza} />
                </div>
                <div className="p-4 sm:p-5 flex items-center justify-center">
                  <StatusIcon status={row.traditional} />
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
