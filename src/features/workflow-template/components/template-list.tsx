'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@shadcn/index';
import { FileText, ArrowRight, Layers } from 'lucide-react';
import { useWorkflowTemplates } from '../hooks/queries/use-workflow-template-queries';
import { CreateTemplateDialog } from './ui/create-template-dialog';
import type { WorkflowTemplateListItem } from '../server/types/template.types';

function TemplateCard({ template }: { template: WorkflowTemplateListItem }) {
  const router = useRouter();

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group"
      onClick={() =>
        router.push(`/dashboard/gerenciamento/templates/${template.id}`)
      }
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm truncate">
                {template.name}
              </h3>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground line-clamp-2">
          {template.description}
        </p>
      </CardContent>
    </Card>
  );
}

export function TemplateList() {
  const { data: templates, isLoading } = useWorkflowTemplates();

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 border-b bg-background/95 backdrop-blur">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Templates de Workflow</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Gerencie os templates usados nos processos de abertura de
                empresa.
              </p>
            </div>
            <CreateTemplateDialog />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 rounded-lg bg-muted" />
                </div>
              ))}
            </div>
          ) : !templates || templates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Layers className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-1">
                Nenhum template criado
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Crie seu primeiro template para começar a configurar o workflow.
              </p>
              <CreateTemplateDialog />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
