import { cn } from '@societiza/lib/utils';
import Logo from '@societiza/components/logo';
import { Button } from '@societiza/components/ui/button';
import { InstagramIcon, LinkedinIcon, TwitterIcon } from 'lucide-react';

const socialLinks = [
  { icon: <InstagramIcon className="size-4" />, link: 'https://instagram.com/societiza' },
  { icon: <LinkedinIcon className="size-4" />, link: 'https://linkedin.com/company/societiza' },
  { icon: <TwitterIcon className="size-4" />, link: 'https://x.com/societiza' },
];

const produto = [
  { title: 'Funcionalidades', href: '#funcionalidades' },
  { title: 'Preços', href: '#precos' },
  { title: 'FAQ', href: '#faq' },
];

const empresa = [
  { title: 'Sobre nós', href: '#' },
  { title: 'Blog', href: '#' },
  { title: 'Contato', href: '#contato' },
  { title: 'Privacidade', href: '#' },
  { title: 'Termos de uso', href: '#' },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border/40">
      <div
        className={cn(
          'mx-auto max-w-7xl px-4 md:px-8',
          'dark:bg-[radial-gradient(35%_80%_at_25%_0%,oklch(from_var(--foreground)_l_c_h_/_0.1),transparent)]'
        )}
      >
        <div className="grid grid-cols-6 gap-6 py-8">
          <div className="col-span-6 flex flex-col gap-4 pt-5 md:col-span-4">
            <a className="w-max" href="#">
              <Logo className="h-5" />
            </a>
            <p className="max-w-sm text-balance text-muted-foreground text-sm">
              O workflow societário que muda a forma como contabilidades abrem empresas no Brasil.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((item, index) => (
                <Button
                  asChild
                  key={`social-${item.link}-${index}`}
                  size="icon-sm"
                  variant="outline"
                >
                  <a href={item.link} rel="noopener noreferrer" target="_blank">
                    {item.icon}
                  </a>
                </Button>
              ))}
            </div>
          </div>
          <div className="col-span-3 w-full md:col-span-1">
            <span className="text-muted-foreground text-xs">Produto</span>
            <div className="mt-2 flex flex-col gap-2">
              {produto.map(({ href, title }) => (
                <a className="w-max text-sm hover:underline" href={href} key={title}>
                  {title}
                </a>
              ))}
            </div>
          </div>
          <div className="col-span-3 w-full md:col-span-1">
            <span className="text-muted-foreground text-xs">Empresa</span>
            <div className="mt-2 flex flex-col gap-2">
              {empresa.map(({ href, title }) => (
                <a className="w-max text-sm hover:underline" href={href} key={title}>
                  {title}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-border/40 flex flex-col justify-between gap-2 py-4">
          <p className="text-center font-light text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Societiza. Todos os direitos reservados. Feito em
            Joinville, SC.
          </p>
        </div>
      </div>
    </footer>
  );
}
