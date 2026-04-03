'use client';

import { motion } from 'motion/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@societiza/components/ui/shadcnui/accordion';
import { stagger, staggerChild, vp } from '../_lib/animations';

const faqs = [
  {
    question: 'O Societiza funciona para qualquer estado do Brasil?',
    answer:
      'Sim. O Societiza foi construdo para funcionar em todos os estados brasileiros. Cada prefeitura tem suas peculiaridades e nosso sistema se adapta a elas  seja no checklist de documentos, seja nas consultas automticas nos portais municipais.',
  },
  {
    question: 'Preciso instalar algum software ou  tudo na nuvem?',
    answer:
      'Tudo na nuvem. Acesse pelo navegador em qualquer dispositivo  computador, tablet ou celular. Sem instalao, sem atualizao manual. Quando lanamos novidades, elas j aparecem direto no seu painel.',
  },
  {
    question: 'Como funciona o perodo gratuito?',
    answer:
      'O plano Starter  gratuito sem limite de tempo. Voc gerencia at 5 processos ativos com 1 usurio. Quando precisar de mais capacidade, automaes ou mais colaboradores,  s fazer o upgrade  sem perder nenhum dado.',
  },
  {
    question: 'Posso importar meus processos atuais?',
    answer:
      'Sim. Nossa equipe oferece suporte na migrao de dados de planilhas, outros sistemas e CRMs. Alm disso, disponibilizamos templates pr-configurados para acelerar o incio no Societiza.',
  },
  {
    question: 'Quantos usurios posso ter no plano Pro?',
    answer:
      'O plano Pro suporta at 5 usurios simultneos com controle de permisses por perfil. Para equipes maiores ou redes contbeis, o plano Enterprise oferece usurios ilimitados e gesto centralizada.',
  },
  {
    question: 'Vocs possuem integrao com softwares de contabilidade?',
    answer:
      'Estamos desenvolvendo integraes nativas com os principais ERPs contbeis do mercado. Enquanto isso, oferecemos importao/exportao via planilha e API para integraes customizadas no plano Enterprise.',
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="relative py-24 md:py-32 bg-muted/10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={vp}
        variants={stagger(0.1)}
        className="mx-auto mb-14 max-w-2xl space-y-4 px-6 text-center lg:px-8"
      >
        <motion.div variants={staggerChild} className="flex justify-center">
          <div className="rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            FAQ
          </div>
        </motion.div>
        <motion.h2
          variants={staggerChild}
          className="font-bold text-3xl tracking-tight md:text-5xl"
        >
          Perguntas <span className="text-primary">frequentes</span>
        </motion.h2>
        <motion.p
          variants={staggerChild}
          className="text-muted-foreground text-sm leading-relaxed md:text-base"
        >
          Tudo que voc precisa saber antes de comear.
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={vp}
        variants={stagger(0.06, 0.2)}
        className="mx-auto max-w-3xl px-6 lg:px-8"
      >
        <motion.div
          variants={staggerChild}
          className="rounded-2xl border border-border/60 bg-card overflow-hidden"
        >
          <Accordion className="w-full" collapsible type="single">
            {faqs.map((faq, index) => (
              <motion.div key={faq.question} variants={staggerChild}>
                <AccordionItem
                  className="border-b border-border/40 last:border-b-0 px-6"
                  value={`item-${index}`}
                >
                  <AccordionTrigger className="py-5 text-left font-medium text-sm hover:no-underline md:text-base hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </motion.div>
    </section>
  );
}
