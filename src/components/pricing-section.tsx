import { OnlineFriends } from '@societiza/components/online-friends';
import { Button } from '@societiza/components/ui/button';
import { CheckIcon } from 'lucide-react';

type PricingPlan = {
  name: string;
  price: string;
  detail: string;
  highlights: string[];
  cta: string;
  featured?: boolean;
};

const plans: PricingPlan[] = [
  {
    name: 'Salinha',
    price: 'Gratis',
    detail: 'Para operacao menor e poucos processos ativos.',
    highlights: ['3 processos', '1 usuario', 'Notificacoes basicas'],
    cta: 'Comece agora',
  },
  {
    name: 'Escritorio',
    price: 'R$ 109,90',
    detail: 'Para times com volume alto e colaboracao diaria.',
    highlights: ['Processos ilimitados', 'Ate 3 usuarios', 'Gestao central'],
    cta: 'Teste gratuitamente',
    featured: true,
  },
];

export function PricingSection() {
  return (
    <section className="mx-auto w-full max-w-7xl py-4">
      <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col bg-background p-8 md:col-span-2">
          <p className="mb-4 text-muted-foreground text-sm uppercase tracking-wider">
            Planos
          </p>
          <h2 className="font-bold text-3xl leading-tight md:text-5xl">
            Planos para quem vive de societario
          </h2>
          <p className="mt-4 text-muted-foreground text-sm md:text-base">
            Da organizacao do contador independente a escala do escritorio.
          </p>
          <OnlineFriends className="mt-6 max-w-xs" />
        </div>

        {plans.map((plan) => (
          <article
            key={plan.name}
            className="flex flex-col justify-between bg-background p-6"
          >
            <div>
              <p className="text-muted-foreground text-sm uppercase tracking-wider">
                {plan.name}
              </p>
              <p className="mt-4 font-bold text-4xl">{plan.price}</p>
              <p className="mt-4 text-muted-foreground text-sm">{plan.detail}</p>

              <div className="mt-6 space-y-3 text-sm">
                {plan.highlights.map((item) => (
                  <p key={item} className="flex items-center gap-2">
                    <CheckIcon className="size-4" />
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <Button asChild className="mt-8 w-full" variant={plan.featured ? 'default' : 'outline'}>
              <a href="https://forms.gle/Psgqo5uy2MXtwU1n8" target="_blank" rel="noopener noreferrer">
                {plan.cta}
              </a>
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}
