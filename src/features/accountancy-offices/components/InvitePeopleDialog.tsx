'use client';

import { useEffect, useState } from 'react';
import { Copy, Link2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shadcn/index';
import { useCreateInvitationLink } from '@societiza/features/identity-invitations/hooks/mutations/useIdentityInvitationMutations';
import type { CreateInvitationLinkResponse } from '@societiza/features/identity-invitations/schemas/identity-invitation.schema';

interface InvitePeopleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  officeId: string;
  officeName: string;
}

const MAX_USES_OPTIONS = ['1', '3', '5'] as const;

export function InvitePeopleDialog({
  open,
  onOpenChange,
  officeName,
}: InvitePeopleDialogProps) {
  const [maxUses, setMaxUses] = useState<(typeof MAX_USES_OPTIONS)[number]>(
    '1',
  );
  const [createdLink, setCreatedLink] =
    useState<CreateInvitationLinkResponse | null>(null);
  const createInvitationLink = useCreateInvitationLink();

  useEffect(() => {
    if (open) return;
    setMaxUses('1');
    setCreatedLink(null);
  }, [open]);

  const handleGenerateLink = () => {
    createInvitationLink.mutate(
      {
        targetRole: 'AccountancyEmployee',
        maxUses: Number.parseInt(maxUses, 10),
      },
      {
        onSuccess: setCreatedLink,
      },
    );
  };

  const handleCopy = async () => {
    if (!createdLink?.url) return;

    try {
      await navigator.clipboard.writeText(createdLink.url);
      toast.success('Link de convite copiado.');
    } catch {
      toast.error('Não foi possível copiar o link.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <UserPlus />
          </div>
          <DialogTitle>Convidar pessoas</DialogTitle>
          <DialogDescription>
            Gere um link para novos colaboradores entrarem em {officeName}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="invite-max-uses">
              Quantidade máxima de cadastros
            </label>
            <Select
              value={maxUses}
              onValueChange={(value) =>
                setMaxUses(value as (typeof MAX_USES_OPTIONS)[number])
              }
              disabled={createInvitationLink.isPending}
            >
              <SelectTrigger id="invite-max-uses" className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {MAX_USES_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option} cadastro{option === '1' ? '' : 's'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              O link cadastra usuários como Colaborador da Contabilidade.
            </p>
          </div>

          <Button
            type="button"
            onClick={handleGenerateLink}
            loading={createInvitationLink.isPending}
            disabled={createInvitationLink.isPending}
          >
            <Link2 data-icon="inline-start" />
            Gerar link
          </Button>

          <div className="grid gap-2 rounded-lg border bg-muted/40 p-3">
            <label className="text-sm font-medium" htmlFor="invite-url">
              Link de convite
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="invite-url"
                readOnly
                value={createdLink?.url ?? 'Gere um link para compartilhar'}
                className="font-mono text-xs"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleCopy}
                disabled={!createdLink?.url}
                className="shrink-0"
              >
                <Copy data-icon="inline-start" />
                Copiar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
