'use client';

import { Check, X } from 'lucide-react';

const comparisons = [
  {
    benefit: 'Relaxar sem precisar entrar no site da prefeitura a cada 2 horas',
  },
  {
    benefit: 'Saber exatamente em qual etapa está cada processo',
  },
  {
    benefit: 'Não perder prazos por esquecimento',
  },
  {
    benefit: 'Ter todas as informações do cliente em um só lugar',
  },
  {
    benefit: 'Receber alertas automáticos de pendências',
  },
  {
    benefit: 'Delegar tarefas com clareza para a equipe',
  },
  {
    benefit: 'Mostrar ao cliente o andamento do processo em tempo real',
  },
  {
    benefit: 'Escalar a operação sem virar refém de planilhas',
  },
];

export function ProblemSection() {
  return (
    <div id="problema" className="py-16 md:py-20">
      <div className="mb-12 text-center">
        <div className="mx-auto mb-6 w-fit rounded-md border px-4 py-1 text-sm">
          Comparativo
        </div>
        <h2 className="mx-auto max-w-3xl font-bold text-3xl leading-tight tracking-tight md:text-5xl">
          A diferença entre continuar no caos ou ter controle total.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Veja como a sua rotina muda quando você deixa de improvisar e passa a
          usar um sistema feito para contabilidades.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border bg-card">
        {/* Header */}
        <div className="grid grid-cols-[1fr_120px_120px] border-b bg-muted/50 md:grid-cols-[1fr_160px_160px]">
          <div className="p-4 md:p-5">
            <span className="font-medium text-sm text-muted-foreground">
              Benefício
            </span>
          </div>
          <div className="flex items-center justify-center border-l p-4 md:p-5">
            <span className="text-center font-medium text-xs text-muted-foreground md:text-sm">
              Contador Comum
            </span>
          </div>
          <div className="flex items-center justify-center border-l bg-primary/5 p-4 md:p-5">
            <span className="text-center font-semibold text-xs text-primary md:text-sm">
              Contador Societizado
            </span>
          </div>
        </div>

        {/* Rows */}
        {comparisons.map((item, index) => (
          <div
            key={index}
            className={`grid grid-cols-[1fr_120px_120px] md:grid-cols-[1fr_160px_160px] ${
              index !== comparisons.length - 1 ? 'border-b' : ''
            }`}
          >
            <div className="flex items-center p-4 md:p-5">
              <span className="text-sm leading-relaxed">{item.benefit}</span>
            </div>
            <div className="flex items-center justify-center border-l p-4 md:p-5">
              <div className="flex size-7 items-center justify-center rounded-full bg-destructive/10">
                <X className="size-4 text-destructive" />
              </div>
            </div>
            <div className="flex items-center justify-center border-l bg-primary/5 p-4 md:p-5">
              <div className="flex size-7 items-center justify-center rounded-full bg-primary/20">
                <Check className="size-4 text-primary" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA hint */}
      <div className="mt-8 text-center">
        <p className="text-muted-foreground text-sm">
          Pare de improvisar.{' '}
          <span className="font-medium text-foreground">
            Seja um contador societizado.
          </span>
        </p>
      </div>
    </div>
  );
}
