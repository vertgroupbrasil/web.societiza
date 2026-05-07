'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Button,
  Input,
  Textarea,
} from '@shadcn/index';
import { ArrowLeft, FilePenLine, Layers, Rocket, Save } from 'lucide-react';
import { toast } from 'sonner';
import {
  useTemplateDraftBySource,
  useWorkflowTemplateById,
} from '../hooks/queries/use-workflow-template-queries';
import {
  useCreateDraftFromTemplate,
  usePublishTemplate,
  useUpdateTemplate,
} from '../hooks/mutations/use-template-mutations';
import { getDuplicateStepTitleError } from '../lib/template-validation';
import { TemplateKanban } from './template-kanban';

interface TemplateBuilderProps {
  templateId: string;
}

type TemplateViewMode = 'view' | 'edit';

export function TemplateBuilder({ templateId }: TemplateBuilderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: template, isLoading } = useWorkflowTemplateById(templateId);
  const [viewModeState, setViewModeState] = useState<TemplateViewMode>('view');

  const [nameDraft, setNameDraft] = useState('');
  const [descriptionDraft, setDescriptionDraft] = useState('');

  const updateTemplate = useUpdateTemplate();
  const createDraft = useCreateDraftFromTemplate();
  const publishTemplate = usePublishTemplate();

  const returnTo = searchParams.get('returnTo');
  const backHref = returnTo || '/dashboard/societario';
  const sourceTemplateId = template?.sourceTemplateId ?? undefined;
  const { draft: existingDraft } = useTemplateDraftBySource(
    template?.status === 'Active' ? template.id : sourceTemplateId,
  );

  useEffect(() => {
    if (!template) return;

    setNameDraft(template.name);
    setDescriptionDraft(template.description);
  }, [template]);

  useEffect(() => {
    const nextMode: TemplateViewMode =
      template?.status === 'Draft' && searchParams.get('mode') === 'edit'
        ? 'edit'
        : 'view';

    setViewModeState(nextMode);
  }, [searchParams, template?.status]);

  const isDerivedDraft = Boolean(template?.sourceTemplateId);
  const isDraft = template?.status === 'Draft';
  const isEditing = isDraft && viewModeState === 'edit';

  const hasTemplateChanges = useMemo(() => {
    if (!template) return false;

    return (
      nameDraft.trim() !== template.name ||
      descriptionDraft.trim() !== template.description
    );
  }, [descriptionDraft, nameDraft, template]);

  const setMode = (mode: TemplateViewMode) => {
    setViewModeState(mode);
    const params = new URLSearchParams(searchParams.toString());

    if (mode === 'edit') {
      params.set('mode', 'edit');
    } else {
      params.delete('mode');
    }

    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(nextUrl);
  };

  const handleBack = () => {
    if (isEditing) {
      if (returnTo) {
        router.push(returnTo);
        return;
      }

      setMode('view');
      return;
    }

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

  const handleSaveTemplate = async () => {
    const nextName = nameDraft.trim();
    const nextDescription = descriptionDraft.trim() || nextName || template.description;

    if (!nextName) {
      setNameDraft(template.name);
      setDescriptionDraft(template.description);
      return;
    }

    if (!hasTemplateChanges) {
      toast.success('Rascunho salvo.');
      return;
    }

    await updateTemplate.mutateAsync({
      templateId,
      data: {
        name: nextName,
        description: nextDescription,
      },
    });
  };

  const handleCreateDraft = async () => {
    const params = new URLSearchParams();

    params.set('mode', 'edit');
    if (returnTo) params.set('returnTo', returnTo);

    const suffix = `?${params.toString()}`;

    if (existingDraft?.id) {
      router.push(`/dashboard/societario/templates/${existingDraft.id}${suffix}`);
      return;
    }

    const result = await createDraft.mutateAsync(template.id);
    router.push(`/dashboard/societario/templates/${result.id}${suffix}`);
  };

  const handlePublish = async () => {
    const duplicateStepTitleError = getDuplicateStepTitleError(template.steps);

    if (duplicateStepTitleError) {
      toast.error(duplicateStepTitleError);
      return;
    }

    const result = await publishTemplate.mutateAsync(template.id);

    if (returnTo) {
      router.push(returnTo);
      return;
    }

    router.push(`/dashboard/societario/workflow?templateId=${result.id}`);
  };

  const workflowDescription =
    template.description || 'Monte o workflow e entre em edição só quando precisar ajustar a operação.';

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
                aria-label={isEditing ? 'Sair do modo de edição' : 'Voltar'}
                title={isEditing ? 'Sair do modo de edição' : 'Voltar'}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {template.status === 'Active' && !isDerivedDraft ? (
                <Button
                  variant={existingDraft ? 'default' : 'outline'}
                  size="icon"
                  onClick={handleCreateDraft}
                  disabled={createDraft.isPending}
                  loading={createDraft.isPending}
                  aria-label={existingDraft ? 'Continuar edição' : 'Editar workflow'}
                  title={existingDraft ? 'Continuar edição' : 'Editar workflow'}
                >
                  <FilePenLine className="h-4 w-4" />
                </Button>
              ) : (
                <>
                  {isEditing && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleSaveTemplate}
                      disabled={updateTemplate.isPending || !nameDraft.trim()}
                      loading={updateTemplate.isPending}
                      aria-label="Salvar rascunho"
                      title="Salvar rascunho"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  )}
                  {isDraft && (
                    <Button
                      onClick={handlePublish}
                      disabled={publishTemplate.isPending}
                      loading={publishTemplate.isPending}
                    >
                      <Rocket className="h-4 w-4" />
                      Publicar workflow
                    </Button>
                  )}
                  {!isEditing && (
                    <Button
                      size="icon"
                      onClick={() => setMode('edit')}
                      aria-label="Editar workflow"
                      title="Editar workflow"
                    >
                      <FilePenLine className="h-4 w-4" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          <div>
              {isEditing ? (
                <div className="rounded-[28px] border border-border/70 bg-accent/10 p-4">
                  <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        Nome do workflow
                      </p>
                      <Input
                        value={nameDraft}
                        onChange={(value) => setNameDraft(value)}
                        placeholder="Nome do workflow"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        Descrição
                      </p>
                      <Textarea
                        value={descriptionDraft}
                        onChange={(event) => setDescriptionDraft(event.target.value)}
                        rows={3}
                        placeholder="Resumo curto do propósito deste workflow."
                        className="min-h-24 resize-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
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
                    {isDerivedDraft
                      ? 'Rascunho pronto para edição.'
                      : template.status === 'Active'
                        ? 'Workflow em uso.'
                        : 'Rascunho salvo, pronto para publicar.'}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <TemplateKanban
          template={template}
          templateId={templateId}
          readOnly={!isEditing}
        />
      </div>
    </div>
  );
}
