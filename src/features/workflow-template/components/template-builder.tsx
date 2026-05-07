'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@shadcn/index';
import { ArrowLeft, Layers, Trash2 } from 'lucide-react';
import { useCurrentUser } from '@societiza/hooks/useCurrentUser';
import { useMyProfile } from '@societiza/features/identity-users/hooks/queries/useIdentityUserQueries';
import { useWorkflowTemplateById } from '../hooks/queries/use-workflow-template-queries';
import {
  useActivateTemplate,
  useArchiveTemplate,
  useDeleteTemplate,
} from '../hooks/mutations/use-template-mutations';
import { canManageTemplates } from '../lib/template-permissions';
import { TemplateKanban } from './template-kanban';

interface TemplateBuilderProps {
  templateId: string;
}

export function TemplateBuilder({ templateId }: TemplateBuilderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentUser = useCurrentUser();
  const { data: profile } = useMyProfile(Boolean(currentUser));
  const role = profile?.role ?? currentUser?.role;
  const isAdmin = canManageTemplates(role);

  const { data: template, isLoading } = useWorkflowTemplateById(templateId);

  const activateTemplate = useActivateTemplate();
  const archiveTemplate = useArchiveTemplate();
  const deleteTemplate = useDeleteTemplate();

  const returnTo = searchParams.get('returnTo');
  const backHref = returnTo || '/dashboard/societario';

  const handleBack = () => {
    router.push(backHref);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
          <p className="mt-3 text-sm text-muted-foreground">
            Carregando workflow...
          </p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="space-y-2 text-center">
          <Layers className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            Template não encontrado.
          </p>
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  const workflowDescription =
    template.description || 'Monte o workflow e configure as etapas do processo.';

  const statusLabel =
    template.status === 'Active'
      ? 'Workflow em uso.'
      : template.status === 'Archived'
        ? 'Workflow arquivado.'
        : 'Rascunho salvo.';

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="space-y-5 px-4 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={handleBack}
                aria-label="Voltar"
                title="Voltar"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {isAdmin && template.status === 'Draft' && (
                <Button
                  onClick={() => activateTemplate.mutate(template.id)}
                  disabled={activateTemplate.isPending}
                  loading={activateTemplate.isPending}
                >
                  Ativar workflow
                </Button>
              )}
              {isAdmin && template.status === 'Active' && (
                <Button
                  variant="outline"
                  onClick={() => archiveTemplate.mutate(template.id)}
                  disabled={archiveTemplate.isPending}
                  loading={archiveTemplate.isPending}
                >
                  Arquivar
                </Button>
              )}
              {isAdmin && (template.status === 'Draft' || template.status === 'Archived') && (
                <Button
                  variant="outline"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => {
                    if (confirm('Tem certeza que deseja deletar este template? Esta ação não pode ser desfeita.')) {
                      deleteTemplate.mutate(template.id, {
                        onSuccess: () => router.push(backHref),
                      });
                    }
                  }}
                  disabled={deleteTemplate.isPending}
                  loading={deleteTemplate.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                  Deletar
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                {template.name}
              </h1>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                {workflowDescription}
              </p>
            </div>

            <div className="inline-flex items-center rounded-full border border-border/70 bg-accent/10 px-3 py-1 text-xs text-muted-foreground">
              {statusLabel}
            </div>
          </div>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <TemplateKanban
          template={template}
          templateId={templateId}
          readOnly={!isAdmin || template.status === 'Archived'}
        />
      </div>
    </div>
  );
}
