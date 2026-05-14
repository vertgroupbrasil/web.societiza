import type React from 'react';
import { cn } from '@societiza/lib/utils';
import { DecorIcon } from '@societiza/components/ui/decor-icon';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@societiza/components/ui/shadcnui/avatar';
import { QuoteIcon } from 'lucide-react';

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  image: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      'Antes perdia 2 horas por dia acompanhando processos em prefeituras diferentes. Com o Societiza, tudo aparece no kanban automaticamente. Virou rotina da equipe.',
    image: 'https://unavatar.io/github/ferr',
    name: 'Ana Ferreira',
    role: 'Sócia-contadora',
    company: 'Ferreira & Associados',
  },
  {
    quote:
      'Finalmente um sistema feito por quem entende de abertura de empresa de verdade. Os templates economizaram umas 3 semanas de configuração. Recomendo sem hesitar.',
    image: 'https://unavatar.io/github/carlos',
    name: 'Carlos Mendes',
    role: 'Diretor',
    company: 'Mendes Contabilidade',
  },
  {
    quote:
      'Nossa equipe cresceu 40% em volume de processos sem contratar ninguém. O Societiza automatiza as partes chatas e libera o time para o que realmente importa.',
    image: 'https://unavatar.io/github/juliana',
    name: 'Juliana Costa',
    role: 'Head de Societário',
    company: 'Grupo Atlas',
  },
];

export function TestimonialsSection() {
  return (
    <div className="py-20 md:py-28">
      <div className="mx-auto mb-14 max-w-2xl space-y-3 text-center">
        <div className="flex justify-center">
          <div className="rounded-md border px-4 py-1 text-sm">Depoimentos</div>
        </div>
        <h2 className="font-bold text-3xl tracking-tight md:text-5xl">
          Quem usa, <span className="text-primary">não volta atrás</span>
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          Contabilidades de todo o Brasil já transformaram seu processo
          societário com o Societiza.
        </p>
      </div>

      <div className="grid w-full gap-8 md:grid-cols-3 md:gap-6">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            index={index}
            key={testimonial.name}
            testimonial={testimonial}
          />
        ))}
      </div>
    </div>
  );
}

function TestimonialCard({
  testimonial,
  index,
  className,
  ...props
}: React.ComponentProps<'figure'> & {
  testimonial: Testimonial;
  index: number;
}) {
  const { quote, name, role, company, image } = testimonial;

  return (
    <figure
      className={cn(
        'relative flex flex-col justify-between gap-6 px-8 pt-8 pb-6 shadow-xs md:translate-y-[calc(3rem*var(--t-card-index))]',
        'dark:bg-[radial-gradient(50%_80%_at_25%_0%,oklch(from_var(--foreground)_l_c_h_/_0.1),transparent)]',
        className,
      )}
      style={{ '--t-card-index': index } as React.CSSProperties}
      {...props}
    >
      <div className="absolute -inset-y-4 -left-px w-px bg-border" />
      <div className="absolute -inset-y-4 -right-px w-px bg-border" />
      <div className="absolute -inset-x-4 -top-px h-px bg-border" />
      <div className="absolute -right-4 -bottom-px -left-4 h-px bg-border" />
      <DecorIcon className="size-3.5" position="top-left" />

      <blockquote className="flex gap-4">
        <QuoteIcon aria-hidden="true" className="size-6 shrink-0 stroke-1" />
        <p className="flex-1 font-normal text-base text-muted-foreground leading-relaxed">
          {quote}
        </p>
      </blockquote>

      <figcaption className="flex items-center gap-3">
        <Avatar className="size-10 rounded-full ring-2 ring-border ring-offset-2 ring-offset-background">
          <AvatarImage alt={`${name}'s profile picture`} src={image} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <cite className="font-medium text-foreground text-sm not-italic">
            {name}
          </cite>
          <p className="text-muted-foreground text-xs">
            {role}, <span className="text-foreground/80">{company}</span>
          </p>
        </div>
      </figcaption>
    </figure>
  );
}
