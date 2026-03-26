'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, TooltipProvider } from '@shadcn/index';
import { ArrowLeft, CheckCircle, Archive, Layers } from 'lucide-react';
import { useWorkflowTemplateById } from '../hooks/queries/use-workflow-template-queries';
import {
  useActivateTemplate,
  useArchiveTemplate,
} from '../hooks/mutations/use-template-mutations';
import { TemplateStatusBadge } from './ui/status-badge';
import { TemplateKanban } from './template-kanban';

interface TemplateBuilderProps {
  templateId: string;
}

export function TemplateBuilder({ templateId }: TemplateBuilderProps) {
  const router = useRouter();
  const { data: template, isLoading } = useWorkflowTemplateById(templateId);

  const activateTemplate = useActivateTemplate();
  const archiveTemplate = useArchiveTemplate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">
            Carregando template...
          </p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <Layers className="h-12 w-12 text-muted-foreground/50 mx-auto" />
          <p className="text-sm text-muted-foreground">
            Template não encontrado.
          </p>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/societario/templates')}
          >
            Voltar à lista
          </Button>
        </div>
      </div>
    );
  }

  const totalTasks = template.steps.reduce(
    (acc, step) => acc + step.tasks.length,
    0,
  );
  const totalFields = template.steps.reduce(
    (acc, step) =>
      acc +
      step.fields.length +
      step.tasks.reduce((taskAcc, task) => taskAcc + task.fields.length, 0),
    0,
  );

  return (
    <TooltipProvider>
      <div className="h-full w-full flex flex-col overflow-hidden">
        {/* Header fixo */}
        <div className="flex-shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
          <div className="px-4 py-4 space-y-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard/societario/templates')}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar
              </Button>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-xl font-bold truncate">
                    {template.name}
                  </h1>
                  <TemplateStatusBadge status={template.status} />
                </div>
                {template.description && (
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    {template.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground">
                  <span>v{template.version}</span>
                  <span>•</span>
                  <span>{template.steps.length} etapas</span>
                  <span>•</span>
                  <span>{totalTasks} tarefas</span>
                  <span>•</span>
                  <span>{totalFields} campos</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {template.status === 'Draft' && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => activateTemplate.mutate(templateId)}
                    disabled={activateTemplate.isPending}
                    loading={activateTemplate.isPending}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Ativar
                  </Button>
                )}
                {template.status === 'Active' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => archiveTemplate.mutate(templateId)}
                    disabled={archiveTemplate.isPending}
                    loading={archiveTemplate.isPending}
                  >
                    <Archive className="h-4 w-4 mr-1" />
                    Arquivar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Kanban WYSIWYG */}
        <div className="flex-1 min-h-0 w-full relative">
          {template.steps.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-3">
                <Layers className="h-12 w-12 text-muted-foreground/50 mx-auto" />
                <h3 className="text-lg font-medium">Nenhuma etapa criada</h3>
                <p className="text-sm text-muted-foreground">
                  Comece adicionando a primeira etapa do seu workflow.
                </p>
                <TemplateKanban template={template} templateId={templateId} />
              </div>
            </div>
          ) : (
            <TemplateKanban template={template} templateId={templateId} />
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
