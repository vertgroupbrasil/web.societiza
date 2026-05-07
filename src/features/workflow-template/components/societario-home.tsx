'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  Button,
  Card,
  CardContent,
  CardHeader,
} from '@shadcn/index';
import { ArrowRight, FilePenLine, Layers } from 'lucide-react';
import { useWorkflowTemplates } from '../hooks/queries/use-workflow-template-queries';
import { CreateTemplateDialog } from './ui/create-template-dialog';
import type { WorkflowTemplateListItem } from '../server/types/template.types';

function TemplateSelectionCard({
  template,
}: {
  template: WorkflowTemplateListItem;
}) {
  const router = useRouter();
  const workflowHref = `/dashboard/societario/workflow?templateId=${template.id}`;

  return (
    <Card
      role="link"
      tabIndex={0}
      onClick={() => router.push(workflowHref)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          router.push(workflowHref);
        }
      }}
      className="group flex h-full cursor-pointer flex-col rounded-[28px] border border-border/70 bg-card/80 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <CardHeader className="space-y-4 pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-accent/20 text-primary">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                {template.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {template.description}
              </p>
            </div>
          </div>

          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </CardHeader>

      <CardContent className="mt-auto pt-0">
        <div className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
          <span>Abrir workflow</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  );
}

function DraftCard({ template }: { template: WorkflowTemplateListItem }) {
  return (
    <Card className="rounded-[24px] border border-border/70 bg-accent/10">
      <CardHeader className="pb-3">
        <h3 className="text-sm font-semibold text-foreground">{template.name}</h3>
        <p className="text-sm text-muted-foreground">{template.description}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <Button variant="outline" asChild>
          <Link
            href={`/dashboard/societario/templates/${template.id}?mode=edit&returnTo=/dashboard/societario`}
          >
            <FilePenLine className="h-4 w-4" />
            Continuar edição
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function SocietarioHome() {
  const { data: page, isLoading } = useWorkflowTemplates();
  const templates = page?.items;

  const activeTemplates =
    templates?.filter(
      (template) => template.status === 'Active' && !template.sourceTemplateId,
    ) ?? [];

  const draftTemplates =
    templates?.filter((template) => template.status === 'Draft') ?? [];

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="border-b bg-background/95 backdrop-blur">
        <div className="space-y-4 px-6 py-5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Societário</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Escolha seu workflow
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Selecione um template ativo para operar o workflow ou crie um do
                zero para começar uma estrutura nova.
              </p>
            </div>

          <CreateTemplateDialog />
        </div>
      </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-8 px-6 py-6">
          <section className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">
                Workflows ativos
              </h2>
              <p className="text-sm text-muted-foreground">
                Entre no workflow que está pronto para uso diário.
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-52 animate-pulse rounded-[28px] bg-muted" />
                ))}
              </div>
            ) : activeTemplates.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-border/70 bg-accent/10 px-6 py-10 text-center">
                <Layers className="mx-auto h-10 w-10 text-muted-foreground/60" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  Nenhum workflow ativo ainda
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Crie um template do zero e publique quando quiser começar a usar.
                </p>
                <div className="mt-6 flex justify-center">
                  <CreateTemplateDialog />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                {activeTemplates.map((template) => (
                  <TemplateSelectionCard key={template.id} template={template} />
                ))}
              </div>
            )}
          </section>

          {draftTemplates.length > 0 && (
            <section className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-foreground">
                  Rascunhos em andamento
                </h2>
                <p className="text-sm text-muted-foreground">
                  Continue de onde você parou.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                {draftTemplates.map((template) => (
                  <DraftCard key={template.id} template={template} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
