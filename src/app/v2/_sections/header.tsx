'use client';

import { cn } from '@societiza/lib/utils';
import Logo from '@societiza/components/logo';
import { useScroll } from '@societiza/hooks/use-scroll';
import { Button } from '@societiza/components/ui/button';
import { MobileNav } from '@societiza/components/mobile-nav';
import { motion } from 'motion/react';

const navLinks = [
  { label: 'Funcionalidades', href: '#funcionalidades' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Preços', href: '#precos' },
  { label: 'FAQ', href: '#faq' },
];

export function Header() {
  const scrolled = useScroll(10);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/50'
          : 'bg-transparent',
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <a href="/v2" className="relative z-10">
          <Logo className="h-7 w-auto" />
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Button
              asChild
              key={link.label}
              size="sm"
              variant="ghost"
              className="text-sm font-medium"
            >
              <a href={link.href}>{link.label}</a>
            </Button>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button asChild size="sm" variant="ghost">
            <a href="/login">Entrar</a>
          </Button>
          <Button asChild size="sm">
            <a href="/login">Começar grátis</a>
          </Button>
        </div>

        <MobileNav />
      </nav>
    </motion.header>
  );
}
