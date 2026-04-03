'use client';

import { motion } from 'motion/react';
import Logo from '@societiza/components/logo';
import { Button } from '@societiza/components/ui/button';
import { InstagramIcon, LinkedinIcon, TwitterIcon } from 'lucide-react';
import { vp } from '../_lib/animations';

const socialLinks = [
  { icon: InstagramIcon, link: 'https://instagram.com/societiza' },
  { icon: LinkedinIcon, link: 'https://linkedin.com/company/societiza' },
  { icon: TwitterIcon, link: 'https://x.com/societiza' },
];

const produto = [
  { title: 'Funcionalidades', href: '#funcionalidades' },
  { title: 'Preos', href: '#precos' },
  { title: 'FAQ', href: '#faq' },
];

const empresa = [
  { title: 'Sobre ns', href: '#' },
  { title: 'Blog', href: '#' },
  { title: 'Contato', href: '#contato' },
  { title: 'Privacidade', href: '#' },
  { title: 'Termos de uso', href: '#' },
];

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={vp}
      transition={{ duration: 0.6 }}
      className="relative border-t border-border/40"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-6 gap-8 py-12">
          {/* Brand */}
          <div className="col-span-6 flex flex-col gap-4 md:col-span-4">
            <a className="w-max" href="/v2">
              <Logo className="h-6" />
            </a>
            <p className="max-w-sm text-balance text-muted-foreground text-sm">
              O workflow societrio que muda a forma como contabilidades abrem
              empresas no Brasil.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((item, index) => (
                <Button
                  asChild
                  key={`social-${index}`}
                  size="icon-sm"
                  variant="outline"
                  className="rounded-full"
                >
                  <a href={item.link} rel="noopener noreferrer" target="_blank">
                    <item.icon className="size-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="col-span-3 w-full md:col-span-1">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Produto
            </span>
            <div className="mt-3 flex flex-col gap-2.5">
              {produto.map(({ href, title }) => (
                <a
                  className="w-max text-sm text-foreground/80 transition-colors hover:text-primary"
                  href={href}
                  key={title}
                >
                  {title}
                </a>
              ))}
            </div>
          </div>
          <div className="col-span-3 w-full md:col-span-1">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Empresa
            </span>
            <div className="mt-3 flex flex-col gap-2.5">
              {empresa.map(({ href, title }) => (
                <a
                  className="w-max text-sm text-foreground/80 transition-colors hover:text-primary"
                  href={href}
                  key={title}
                >
                  {title}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border/40 py-6">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Societiza. Todos os direitos
            reservados. Feito em Joinville, SC.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
