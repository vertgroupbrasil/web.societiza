'use client';

import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import { stagger, staggerChild, vp, fadeUp } from '../_lib/animations';

const comparisons = [
  {
    benefit: 'Relaxar sem precisar entrar no site da prefeitura a cada 2 horas',
  },
  { benefit: 'Saber exatamente em qual etapa est cada processo' },
  { benefit: 'No perder prazos por esquecimento' },
  { benefit: 'Ter todas as informaes do cliente em um s lugar' },
  { benefit: 'Receber alertas automticos de pendncias' },
  { benefit: 'Delegar tarefas com clareza para a equipe' },
  { benefit: 'Mostrar ao cliente o andamento em tempo real' },
  { benefit: 'Escalar a operao sem virar refm de planilhas' },
];

export function ProblemSection() {
  return (
    <section id="comparativo" className="relative py-24 md:py-32">
      {/* Section header */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={vp}
        variants={stagger(0.1)}
        className="mx-auto mb-14 max-w-3xl space-y-4 px-6 text-center lg:px-8"
      >
        <motion.div variants={staggerChild} className="flex justify-center">
          <div className="rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            Comparativo
          </div>
        </motion.div>
        <motion.h2
          variants={staggerChild}
          className="font-bold text-3xl leading-tight tracking-tight md:text-5xl"
        >
          A diferena entre continuar no caos ou ter{' '}
          <span className="text-primary">controle total.</span>
        </motion.h2>
        <motion.p
          variants={staggerChild}
          className="text-muted-foreground md:text-base"
        >
          Veja como a sua rotina muda quando voc deixa de improvisar e passa a
          usar um sistema feito para contabilidades.
        </motion.p>
      </motion.div>

      {/* Comparison Table */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={vp}
        variants={stagger(0.06, 0.2)}
        className="mx-auto max-w-3xl px-6 lg:px-8"
      >
        <motion.div
          variants={fadeUp}
          className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm"
        >
          {/* Header */}
          <div className="grid grid-cols-[1fr_120px_120px] border-b bg-muted/40 md:grid-cols-[1fr_160px_160px]">
            <div className="p-4 md:p-5">
              <span className="font-medium text-sm text-muted-foreground">
                Benefcio
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
            <motion.div
              key={index}
              variants={staggerChild}
              className={`grid grid-cols-[1fr_120px_120px] md:grid-cols-[1fr_160px_160px] ${
                index !== comparisons.length - 1 ? 'border-b' : ''
              } transition-colors duration-200 hover:bg-muted/20`}
            >
              <div className="flex items-center p-4 md:p-5">
                <span className="text-sm leading-relaxed">{item.benefit}</span>
              </div>
              <div className="flex items-center justify-center border-l p-4 md:p-5">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.3 + index * 0.05,
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                  }}
                  className="flex size-7 items-center justify-center rounded-full bg-destructive/10"
                >
                  <X className="size-4 text-destructive" />
                </motion.div>
              </div>
              <div className="flex items-center justify-center border-l bg-primary/5 p-4 md:p-5">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.4 + index * 0.05,
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                  }}
                  className="flex size-7 items-center justify-center rounded-full bg-primary/20"
                >
                  <Check className="size-4 text-primary" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-muted-foreground text-sm">
            Pare de improvisar.{' '}
            <span className="font-semibold text-foreground">
              Seja um contador societizado.
            </span>
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
