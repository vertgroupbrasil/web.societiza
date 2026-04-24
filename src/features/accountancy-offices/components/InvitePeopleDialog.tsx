'use client';

import { type FormEvent, useState } from 'react';
import { Copy, Link2, Mail, Send, Sparkles, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
} from '@shadcn/index';
import { useInviteByEmail } from '../hooks/mutations/useOfficeMutations';
import { useOfficeInviteLink } from '../hooks/queries/useOfficeQueries';

interface InvitePeopleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  officeId: string;
  officeName: string;
}

export function InvitePeopleDialog({
  open,
  onOpenChange,
  officeId,
  officeName,
}: InvitePeopleDialogProps) {
  const [email, setEmail] = useState('');
  const inviteByEmail = useInviteByEmail(officeId);
  const { data: inviteLink, isLoading } = useOfficeInviteLink(officeId);

  const handleInvite = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    inviteByEmail.mutate(
      { email: trimmedEmail },
      {
        onSuccess: () => {
          setEmail('');
        },
      },
    );
  };

  const handleCopy = async () => {
    if (!inviteLink?.url) return;

    try {
      await navigator.clipboard.writeText(inviteLink.url);
      toast.success('Link de convite copiado.');
    } catch {
      toast.error('Não foi possível copiar o link.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-3xl">
        <div className="grid md:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-6 p-6 sm:p-8">
            <DialogHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <UserPlus />
              </div>
              <DialogTitle>Convidar pessoas para {officeName}</DialogTitle>
              <DialogDescription>
                Envie um convite direto por e-mail ou compartilhe o link com
                quem deve entrar no escritório.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleInvite} className="flex flex-col gap-3">
              <label className="text-sm font-medium" htmlFor="invite-email">
                E-mail do convidado
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="invite-email"
                  type="email"
                  value={email}
                  onChange={(value) => setEmail(value)}
                  placeholder="nome@empresa.com.br"
                  disabled={inviteByEmail.isPending}
                />
                <Button
                  type="submit"
                  disabled={!email.trim() || inviteByEmail.isPending}
                  loading={inviteByEmail.isPending}
                  className="shrink-0"
                >
                  <Send data-icon="inline-start" />
                  Enviar
                </Button>
              </div>
            </form>

            <div className="flex flex-col gap-2 rounded-lg border bg-muted/40 p-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Link2 />
                Link de convite
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  readOnly
                  value={isLoading ? 'Gerando link...' : inviteLink?.url ?? ''}
                  className="font-mono text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopy}
                  disabled={!inviteLink?.url}
                  className="shrink-0"
                >
                  <Copy data-icon="inline-start" />
                  Copiar
                </Button>
              </div>
            </div>
          </div>

          <div className="hidden min-h-[420px] flex-col justify-between bg-primary p-8 text-primary-foreground md:flex">
            <div className="flex items-center justify-between">
              <Sparkles />
              <span className="rounded-full border border-primary-foreground/30 px-3 py-1 text-xs">
                Equipe
              </span>
            </div>
            <div className="flex flex-col gap-5">
              <div className="rounded-2xl bg-primary-foreground p-5 text-primary shadow-lg">
                <p className="text-sm font-medium">Convite enviado</p>
                <p className="mt-3 text-2xl font-semibold leading-tight">
                  Novas pessoas entram no fluxo certo desde o primeiro acesso.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-primary-foreground/15 p-4">
                  <Mail />
                  <p className="mt-3 text-sm">E-mail direto</p>
                </div>
                <div className="rounded-xl bg-primary-foreground/15 p-4">
                  <Link2 />
                  <p className="mt-3 text-sm">Link compartilhável</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
