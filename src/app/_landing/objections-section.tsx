'use client';

import { FadeIn, StaggerContainer, StaggerItem } from './fade-in';
import { Clock, Zap, TrendingDown, Heart } from 'lucide-react';

const objections = [
  {
    icon: Clock,
    question: '"Não tenho tempo para migrar"',
    answer:
      'Setup em 5 minutos com templates prontos. Não precisa parar seu escritório para começar.',
  },
  {
    icon: Zap,
    question: '"Minha equipe não vai se adaptar"',
    answer:
      'Interface intuitiva de arrastar e soltar. Se usam Trello ou planilhas, vao amar o Societiza.',
  },
  {
    icon: TrendingDown,
    question: '"E se não funcionar para mim?"',
    answer:
      'Teste gratis, sem compromisso. Cancele quando quiser, sem burocracia.',
  },
  {
    icon: Heart,
    question: '"Preciso convencer meu sócio"',
    answer:
      'Mande o link desta página. Os números falam por si: menos horas perdidas, mais processos concluídos.',
  },
];

export function ObjectionsSection() {
  return (
    <section className="py-20 lg:py-32 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mt-3 leading-tight">
            Suas dúvidas, <span className="text-primary">nossas respostas</span>
          </h2>
        </FadeIn>

        {/* Objection cards */}
        <StaggerContainer
          className="grid sm:grid-cols-2 gap-6"
          staggerDelay={0.1}
        >
          {objections.map((item) => (
            <StaggerItem key={item.question}>
              <div className="bg-card border border-border rounded-2xl p-6 h-full hover:border-primary/30 transition-all group">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    {item.question}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
