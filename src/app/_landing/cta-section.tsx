import { FullWidthDivider } from '@societiza/components/ui/full-width-divider';
import { Button } from '@societiza/components/ui/button';
import { Flagged } from '@societiza/components/flagged';
import { ArrowRightIcon } from 'lucide-react';

export function CTASection() {
  return (
    <div className="relative flex w-full flex-col justify-between border-x max-w-7xl items-center">
      <FullWidthDivider className="-top-px" />
      <div className="w-full  px-4 py-8 md:px-8">
        <div className="grid items-center gap-6 md:grid-cols-2">
          <div className="space-y-3 text-left">
            <h2 className="font-semibold text-lg md:text-6xl">
              Pare de perder horas com burocracia.
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Com a Societiza, a abertura de empresas acontece de forma simples,
              rapida e organizada.
            </p>
            <Button className="w-full sm:w-fit">
              Cansei das planilhas <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </div>
          <div className="flex w-full justify-center md:justify-end">
            <Flagged className="h-auto w-full max-w-xs md:max-w-sm" />
          </div>
        </div>
      </div>
      <FullWidthDivider className="-bottom-px" />
    </div>
  );
}
