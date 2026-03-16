import { DecorIcon } from '@societiza/components/ui/decor-icon';
import { FullWidthDivider } from '@societiza/components/ui/full-width-divider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@societiza/components/ui/shadcnui/accordion';

const faqs = [
  {
    question: 'O Societiza funciona para qualquer estado do Brasil?',
    answer:
      'Sim. O Societiza foi construído para funcionar em todos os estados brasileiros. Cada prefeitura tem suas peculiaridades e nosso sistema se adapta a elas — seja no checklist de documentos, seja nas consultas automáticas nos portais municipais.',
  },
  {
    question: 'Preciso instalar algum software ou é tudo na nuvem?',
    answer:
      'Tudo na nuvem. Acesse pelo navegador em qualquer dispositivo — computador, tablet ou celular. Sem instalação, sem atualização manual. Quando lançamos novidades, elas já aparecem direto no seu painel.',
  },
  {
    question: 'Como funciona o período gratuito?',
    answer:
      'O plano Starter é gratuito sem limite de tempo. Você gerencia até 5 processos ativos com 1 usuário. Quando precisar de mais capacidade, automações ou mais colaboradores, é só fazer o upgrade — sem perder nenhum dado.',
  },
  {
    question: 'Posso importar meus processos atuais?',
    answer:
      'Sim. Nossa equipe oferece suporte na migração de dados de planilhas, outros sistemas e CRMs. Além disso, disponibilizamos templates pré-configurados para acelerar o início no Societiza.',
  },
  {
    question: 'Quantos usuários posso ter no plano Pro?',
    answer:
      'O plano Pro suporta até 5 usuários simultâneos com controle de permissões por perfil. Para equipes maiores ou redes contábeis, o plano Enterprise oferece usuários ilimitados e gestão centralizada.',
  },
  {
    question: 'Vocês possuem integração com softwares de contabilidade?',
    answer:
      'Estamos desenvolvendo integrações nativas com os principais ERPs contábeis do mercado. Enquanto isso, oferecemos importação/exportação via planilha e API para integrações customizadas no plano Enterprise.',
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="mx-auto w-full max-w-5xl px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto mb-14 max-w-2xl space-y-3 text-center">
        <div className="flex justify-center">
          <div className="rounded-md border px-4 py-1 text-sm">FAQ</div>
        </div>
        <h2 className="font-bold text-3xl tracking-tight md:text-5xl">
          Perguntas <span className="text-primary">frequentes</span>
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          Tudo que você precisa saber antes de começar.
        </p>
      </div>

      <div className="relative">
        <FullWidthDivider position="top" />
        <DecorIcon className="size-3.5" position="top-left" />
        <DecorIcon className="size-3.5" position="top-right" />

        <Accordion className="mx-auto w-full" collapsible type="single">
          {faqs.map((faq, index) => (
            <AccordionItem
              className="relative border-b last:border-b-0"
              key={faq.question}
              value={`item-${index}`}
            >
              <AccordionTrigger className="py-5 text-left font-medium text-sm hover:no-underline md:text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <DecorIcon className="size-3.5" position="bottom-left" />
        <DecorIcon className="size-3.5" position="bottom-right" />
        <FullWidthDivider position="bottom" />
      </div>
    </section>
  );
}
