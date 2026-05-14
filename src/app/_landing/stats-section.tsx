'use client';

import { StaggerContainer, StaggerItem } from './fade-in';
import { NumberTicker } from '@societiza/components/ui/magicui';
import { Clock, Brain, TrendingUp, LineChart } from 'lucide-react';

const stats = [
  {
    icon: Clock,
    value: 10,
    suffix: 'h+',
    label: 'economizadas por semana',
    description: 'Tempo medio que contadores perdem com processos manuais',
  },
  {
    icon: Brain,
    value: 0,
    suffix: '',
    label: 'sites de prefeitura abertos',
    description: 'As automações fazem isso por você, 24/7',
  },
  {
    icon: TrendingUp,
    value: 3,
    suffix: 'x',
    label: 'mais processos gerenciados',
    description: 'Com o mesmo time, gerencie muito mais aberturas',
  },
  {
    icon: LineChart,
    value: 100,
    suffix: '%',
    label: 'visibilidade',
    description: 'Saiba o status de cada processo em tempo real',
  },
];

export function StatsSection() {
  return (
    <section className="py-16 lg:py-20 relative border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerContainer
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          staggerDelay={0.1}
        >
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="text-center space-y-3 group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mx-auto">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl sm:text-4xl font-extrabold text-foreground">
                    <NumberTicker
                      value={stat.value}
                      className="text-foreground"
                    />
                    {stat.suffix}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {stat.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
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
