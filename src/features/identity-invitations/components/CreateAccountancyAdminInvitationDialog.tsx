'use client';

import { useEffect, useState } from 'react';
import { Copy, Link2, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from '@shadcn/index';
import { useCreateInvitationLink } from '../hooks/mutations/useIdentityInvitationMutations';
import type { CreateInvitationLinkResponse } from '../schemas/identity-invitation.schema';

interface CreateAccountancyAdminInvitationDialogProps {
  accountancyId: string;
  accountancyName: string;
  trigger?: React.ReactNode;
}

export function CreateAccountancyAdminInvitationDialog({
  accountancyId,
  accountancyName,
  trigger,
}: CreateAccountancyAdminInvitationDialogProps) {
  const [open, setOpen] = useState(false);
  const [createdLink, setCreatedLink] =
    useState<CreateInvitationLinkResponse | null>(null);
  const createInvitationLink = useCreateInvitationLink();

  useEffect(() => {
    if (open) return;
    setCreatedLink(null);
  }, [open]);

  const handleGenerateLink = () => {
    createInvitationLink.mutate(
      {
        targetRole: 'AccountancyAdmin',
        accountancyId,
        maxUses: null,
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
      toast.success('Link de cadastro copiado.');
    } catch {
      toast.error('Não foi possível copiar o link.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button type="button" variant="outline" size="sm">
            <UserCog />
            Gerar link de administrador
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <UserCog />
          </div>
          <DialogTitle>Gerar link de administrador</DialogTitle>
          <DialogDescription>
            Crie o link para o Administrador da Contabilidade de{' '}
            {accountancyName}. Ele poderá convidar o restante da equipe depois.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
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
            <label className="text-sm font-medium" htmlFor="admin-invite-url">
              Link de cadastro
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="admin-invite-url"
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
