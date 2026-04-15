'use client';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import Logo from '@societiza/components/logo';
import { Button } from '@societiza/components/ui/button';
import { MobileNav } from '@societiza/components/mobile-nav';
import { useScroll } from '@societiza/hooks/use-scroll';

const GRID_W = 1060;

export const navLinks = [
  {
    label: 'Funcionalidades',
    href: '#funcionalidades',
  },
  {
    label: 'Plataforma',
    href: '#plataforma',
  },
  {
    label: 'Interesse',
    href: '#interesse',
  },
];

export function Header() {
  const scrolled = useScroll(10);
  const [vw, setVw] = useState(1440);

  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  // Only shrink when viewport is wider than the grid — on smaller screens the
  // container already spans the full width so there's nothing to shrink to.
  const scaleX = scrolled && vw > GRID_W ? GRID_W / vw : 1;

  return (
    <header className="sticky top-0 z-50 w-full bg-background/92 backdrop-blur-md supports-backdrop-filter:bg-background/78">
      <div className="relative mx-auto w-full max-w-[1060px] px-4 sm:px-6 md:px-8 lg:px-0">
        <div className="absolute left-4 top-0 z-0 h-full w-px bg-border sm:left-6 md:left-8 lg:left-0" />
        <div className="absolute right-4 top-0 z-0 h-full w-px bg-border sm:right-6 md:right-8 lg:right-0" />

        <nav className="relative z-10 flex h-14 items-center justify-between bg-background/92 px-4 text-foreground md:h-16 md:px-5">
          <a href="#">
            <Logo className="h-8 w-auto" />
          </a>
          <div className="hidden items-center gap-2 md:flex">
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Button asChild key={link.label} size="sm" variant="ghost">
                  <a href={link.href}>{link.label}</a>
                </Button>
              ))}
            </div>
            {/* <Button asChild size="sm" variant="outline">
              <a href="/login">Entrar</a>
            </Button> */}
            {/* <Button asChild size="sm">
              <a href="#interesse">Quero conhecer</a>
            </Button> */}
          </div>
          <MobileNav />
        </nav>
      </div>

      {/*
        Separator line lives here — directly inside <header> (w-full), NOT inside
        the constrained max-w-[1060px] container. This prevents ancestors with
        overflow-x:hidden from clipping the full-width line.
        We animate scaleX from 1 → (1060/vw) so it contracts toward the grid edges.
      */}
      <div className="pointer-events-none h-px w-full" aria-hidden="true">
        <motion.div
          className="h-full w-full bg-border"
          style={{ originX: 0.5, originY: 0.5 }}
          animate={{ scaleX }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </header>
  );
}
