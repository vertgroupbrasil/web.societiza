'use client';

import { useState } from 'react';
import { Button } from '@shadcn/index';
import { Link2, Copy, Check } from 'lucide-react';
import { cn } from '@societiza/lib/utils';

interface InviteByLinkCardProps {
  inviteUrl: string;
  onGenerate?: () => void;
  isGenerating?: boolean;
  className?: string;
}

export function InviteByLinkCard({
  inviteUrl,
  onGenerate,
  isGenerating = false,
  className,
}: InviteByLinkCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        'rounded-lg border bg-muted/40 p-4 flex flex-col gap-3',
        className,
      )}
    >
      <div className="flex items-center gap-2 text-sm font-medium">
        <Link2 className="h-4 w-4 text-muted-foreground" />
        <span>Link de convite</span>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Qualquer pessoa com este link pode entrar no escritório como membro. O
        link não expira.
      </p>

      <div className="flex items-center gap-2">
        <div className="flex-1 bg-background border rounded-md px-3 py-2 text-xs text-muted-foreground truncate font-mono">
          {inviteUrl}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5"
          onClick={handleCopy}
          aria-label="Copiar link de convite"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              Copiado
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copiar
            </>
          )}
        </Button>
      </div>

      {onGenerate && (
        <Button
          variant="ghost"
          size="sm"
          className="w-fit text-xs text-muted-foreground h-auto p-0 hover:text-foreground"
          onClick={onGenerate}
          disabled={isGenerating}
        >
          Gerar novo link
        </Button>
      )}
    </div>
  );
}
