'use client';
import { cn } from '@societiza/lib/utils';
import Logo from '@societiza/components/logo';
import { useScroll } from '@societiza/hooks/use-scroll';
import { Button } from '@societiza/components/ui/button';
import { MobileNav } from '@societiza/components/mobile-nav';

export const navLinks = [
  {
    label: 'Funcionalidades',
    href: '#funcionalidades',
  },
  {
    label: 'Preços',
    href: '#precos',
  },
  {
    label: 'FAQ',
    href: '#faq',
  },
];

export function Header() {
  const scrolled = useScroll(10);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 mx-auto w-full max-w-4xl border-transparent border-b md:rounded-md md:border md:transition-all md:ease-out',
        {
          'border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50 md:top-2 md:max-w-3xl md:shadow':
            scrolled,
        },
      )}
    >
      <nav
        className={cn(
          'flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out',
          {
            'md:px-2': scrolled,
          },
        )}
      >
        <a href="#">
          <Logo className="w-30 h-8" />
        </a>
        <div className="hidden items-center gap-2 md:flex">
          <div>
            {navLinks.map((link) => (
              <Button asChild key={link.label} size="sm" variant="ghost">
                <a href={link.href}>{link.label}</a>
              </Button>
            ))}
          </div>
          <Button asChild size="sm" variant="outline">
            <a href="/login">Entrar</a>
          </Button>
          <Button asChild size="sm">
            <a href="/login">Começar grátis</a>
          </Button>
        </div>
        <MobileNav />
      </nav>
    </header>
  );
}
