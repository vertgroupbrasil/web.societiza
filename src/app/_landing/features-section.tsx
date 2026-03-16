import type React from 'react';
import { cn } from '@societiza/lib/utils';
import { DecorIcon } from '@societiza/components/ui/decor-icon';
import {
  Kanban,
  SlidersHorizontal,
  LayoutTemplate,
  Zap,
  MapPin,
  Settings2,
} from 'lucide-react';

type Feature = {
  title: string;
  icon: React.ReactNode;
  description: string;
};

const features: Feature[] = [
  {
    icon: <Kanban />,
    title: 'Kanban 100% customizável',
    description:
      'Crie seu próprio fluxo societário. Adicione colunas, etapas e status que refletem exatamente como seu escritório trabalha.',
  },
  {
    icon: <SlidersHorizontal />,
    title: 'Tarefas configuráveis',
    description:
      'Configure checklists, campos personalizados e responsabilidades exclusivos para cada etapa do processo.',
  },
  {
    icon: <LayoutTemplate />,
    title: 'Templates prontos',
    description:
      'Comece em minutos com modelos pré-configurados para abertura, alteração e encerramento de empresas.',
  },
  {
    icon: <Zap />,
    title: 'Automação de etapas',
    description:
      'Automatize o que é repetitivo. Avance etapas, dispare notificações e consulte prefeituras sem esforço.',
  },
  {
    icon: <MapPin />,
    title: 'Multi-estado',
    description:
      'Funciona em todos os estados do Brasil. Cada prefeitura tem suas regras? O Societiza se adapta a cada uma delas.',
  },
  {
    icon: <Settings2 />,
    title: 'Seu sistema, do seu jeito',
    description:
      'A maioria dos sistemas força você a se adaptar. Aqui é o contrário: o Societiza respeita como cada contabilidade trabalha.',
  },
];

function FeatureCard({
  feature,
  className,
  ...props
}: React.ComponentProps<'div'> & { feature: Feature }) {
  return (
    <div
      className={cn(
        'relative flex flex-col gap-6 bg-background px-6 pt-8 pb-6',
        'dark:bg-[radial-gradient(50%_80%_at_25%_0%,oklch(from_var(--foreground)_l_c_h_/_0.06),transparent)]',
        className,
      )}
      {...props}
    >
      <div className="absolute -inset-y-4 -left-px w-px bg-border" />
      <div className="absolute -inset-y-4 -right-px w-px bg-border" />
      <div className="absolute -inset-x-4 -top-px h-px bg-border" />
      <div className="absolute -right-4 -bottom-px -left-4 h-px bg-border" />
      <DecorIcon className="size-3.5" position="top-left" />

      <div
        className={cn(
          'relative z-10 flex w-fit items-center justify-center rounded-lg border bg-muted/20 p-3',
          '[&_svg]:size-5 [&_svg]:stroke-[1.5] [&_svg]:text-primary',
        )}
      >
        {feature.icon}
      </div>

      <div className="relative z-10 space-y-2">
        <h3 className="font-semibold text-base text-foreground">
          {feature.title}
        </h3>
        <p className="text-muted-foreground text-xs leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <div id="diferenciais" className="py-20 md:py-28">
      <div className="mx-auto mb-14 max-w-2xl space-y-3 text-center">
        <div className="flex justify-center">
          <div className="rounded-md border px-4 py-1 text-sm">
            Diferenciais
          </div>
        </div>
        <h2 className="font-bold text-3xl tracking-tight md:text-5xl">
          Diferente de qualquer sistema{' '}
          <span className="text-primary">do mercado.</span>
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          A maioria dos softwares força sua contabilidade a se adaptar ao
          sistema. A Societiza faz o contrário.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard feature={feature} key={feature.title} />
        ))}
      </div>
    </div>
  );
}
