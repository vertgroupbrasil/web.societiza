'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CorporateDrawer,
  FiltersDialog,
  SearchBar,
  useCorporateFilters,
  Column,
  useCorporateBoard,
} from '@workflow/index';
import {
  useWorkflowTemplateById,
  useWorkflowTemplates,
} from '@workflow-template/hooks/queries/use-workflow-template-queries';
import { useCreateDraftFromTemplate } from '@workflow-template/hooks/mutations/use-template-mutations';
import ProcessDialog from './ui/ProcessDialog';
import { useAccountancies } from '@accountancy/hooks/queries/useAccountancyQueries';
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shadcn/index';
import { FilePenLine, Layers } from 'lucide-react';
import Link from 'next/link';

export function Board() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filters, applyFilters } = useCorporateFilters();
  const { processTypes, stages, processes } = useCorporateBoard();
  const { data: accounties } = useAccountancies();
  const { data: templates } = useWorkflowTemplates();
  const createDraft = useCreateDraftFromTemplate();

  const templateIdFromUrl = searchParams.get('templateId') ?? '';
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    templateIdFromUrl,
  );

  useEffect(() => {
    if (templateIdFromUrl && templateIdFromUrl !== selectedTemplateId) {
      setSelectedTemplateId(templateIdFromUrl);
    }
  }, [selectedTemplateId, templateIdFromUrl]);

  const activeTemplates = useMemo(
    () =>
      (templates ?? []).filter(
        (template) => template.status === 'Active' && !template.sourceTemplateId,
      ),
    [templates],
  );

  const activeTemplateId = useMemo(() => {
    if (
      selectedTemplateId &&
      activeTemplates.some((template) => template.id === selectedTemplateId)
    ) {
      return selectedTemplateId;
    }

    return activeTemplates[0]?.id ?? '';
  }, [activeTemplates, selectedTemplateId]);

  const { data: templateDetail, isLoading: templateLoading } =
    useWorkflowTemplateById(activeTemplateId);

  const draftForActiveTemplate = useMemo(
    () =>
      (templates ?? []).find(
        (template) =>
          template.status === 'Draft' &&
          template.sourceTemplateId === activeTemplateId,
      ) ?? null,
    [activeTemplateId, templates],
  );

  const templateColumns = useMemo(() => {
    if (!templateDetail?.steps) return [];
    return [...templateDetail.steps].sort((a, b) => a.order - b.order);
  }, [templateDetail?.steps]);

  const columnsWithProcesses = useMemo(() => {
    if (templateColumns.length === 0) return [];

    const allProcesses = processes.flatMap((etapa) => etapa.processos || []);
    const filtered = applyFilters(allProcesses);

    return templateColumns.map((step) => {
      const stepProcesses = filtered.filter(
        (process) =>
          process.etapa?.nome?.toLowerCase() === step.title.toLowerCase() ||
          process.etapa?.id === step.id,
      );

      return {
        id: step.id,
        nome: step.title,
        ordem: step.order,
        processos: stepProcesses,
      };
    });
  }, [applyFilters, processes, templateColumns]);

  const displayColumns = useMemo(() => {
    if (columnsWithProcesses.length > 0) return columnsWithProcesses;

    const allProcesses = processes.flatMap((etapa) => etapa.processos || []);
    const filtered = applyFilters(allProcesses);

    return processes.map((stage) => ({
      ...stage,
      processos: (stage.processos || []).filter((process) =>
        filtered.some((candidate) => candidate.id === process.id),
      ),
    }));
  }, [applyFilters, columnsWithProcesses, processes]);

  const filteredProcesses = useMemo(() => {
    const allProcesses = processes.flatMap((etapa) => etapa.processos || []);
    return applyFilters(allProcesses);
  }, [applyFilters, processes]);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some((value) => {
      if (typeof value === 'string') return value !== '';
      if (typeof value === 'object' && value !== null) {
        return value.start !== null || value.end !== null;
      }
      return false;
    });
  }, [filters]);

  const processTypesFormatted = useMemo(() => {
    if (Array.isArray(processTypes)) {
      return { tipo_processo: processTypes };
    }
    return processTypes;
  }, [processTypes]);

  const stagesFormatted = useMemo(() => {
    if (Array.isArray(stages)) {
      return { etapas: stages };
    }
    return stages;
  }, [stages]);

  const handleEditWorkflow = async () => {
    if (!activeTemplateId) return;

    const params = new URLSearchParams({
      mode: 'edit',
      returnTo: `/dashboard/societario/workflow?templateId=${activeTemplateId}`,
    });

    if (draftForActiveTemplate) {
      router.push(`/dashboard/societario/templates/${draftForActiveTemplate.id}?${params.toString()}`);
      return;
    }

    const result = await createDraft.mutateAsync(activeTemplateId);
    router.push(`/dashboard/societario/templates/${result.id}?${params.toString()}`);
  };

  return (
    <>
      <div className="flex h-full w-full flex-col overflow-hidden">
        <div className="sticky top-0 z-40 w-full flex-shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="w-full max-w-full space-y-4 overflow-hidden px-4 py-4">
            <div className="flex w-full min-w-0 items-start justify-between gap-4">
              <div className="min-w-0 flex-1 overflow-hidden">
                <h2 className="truncate text-2xl font-semibold text-foreground sm:text-3xl">
                  Societário
                </h2>
                {draftForActiveTemplate && (
                  <p className="mt-1 truncate text-xs text-primary sm:text-sm">
                    Existe um rascunho pendente pronto para continuar edição.
                  </p>
                )}
              </div>

              <div className="flex flex-shrink-0 items-center gap-2">
                {activeTemplates.length > 1 && (
                  <Select
                    value={activeTemplateId}
                    onValueChange={(value) => {
                      setSelectedTemplateId(value);
                      router.replace(`/dashboard/societario/workflow?templateId=${value}`);
                    }}
                  >
                    <SelectTrigger className="w-56">
                      <Layers className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Workflow" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {templateDetail && (
                  <Button
                    variant={draftForActiveTemplate ? 'default' : 'outline'}
                    size="icon"
                    onClick={handleEditWorkflow}
                    disabled={createDraft.isPending}
                    loading={createDraft.isPending}
                    aria-label={draftForActiveTemplate ? 'Continuar edição' : 'Editar workflow'}
                    title={draftForActiveTemplate ? 'Continuar edição' : 'Editar workflow'}
                  >
                    <FilePenLine className="h-4 w-4" />
                  </Button>
                )}

                <ProcessDialog
                  {...(accounties && { accounties })}
                  processTypes={processTypesFormatted}
                  stages={stagesFormatted}
                />
              </div>
            </div>

            <div className="flex w-full min-w-0 flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
              <div className="min-w-0 flex-1 max-w-full sm:max-w-md">
                <SearchBar placeholder="Buscar por nome, contabilidade..." />
              </div>
              <div className="flex flex-shrink-0 items-center gap-2">
                <FiltersDialog accounties={accounties} />
              </div>
            </div>
          </div>
        </div>

        <div className="relative min-h-0 flex-1 w-full">
          <div className="absolute inset-0 overflow-x-auto">
            {templateLoading ? (
              <div className="flex h-full w-max min-w-full gap-6 p-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-full w-80 flex-shrink-0">
                    <div className="h-full animate-pulse rounded-lg bg-muted" />
                  </div>
                ))}
              </div>
            ) : displayColumns.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="space-y-2 text-center">
                  <Layers className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    Nenhum template ativo.{' '}
                    <Link
                      href="/dashboard/societario"
                      className="text-primary hover:underline"
                    >
                      Escolha ou crie um template
                    </Link>{' '}
                    para começar.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex h-full w-max min-w-full gap-6 p-4">
                {displayColumns.map((column) => (
                  <div key={column.id} className="h-full w-80 flex-shrink-0">
                    <Column
                      stage={{
                        id: column.id,
                        nome: column.nome,
                        ordem: column.ordem,
                      }}
                      processes={column.processos || []}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="w-full flex-shrink-0 overflow-hidden border-t bg-background/95 backdrop-blur">
            <div className="max-w-full px-4 py-2">
              <div className="truncate text-center text-xs text-muted-foreground sm:text-sm">
                Mostrando <span className="font-bold">{filteredProcesses.length}</span>{' '}
                <span className="font-medium">processos</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <CorporateDrawer />
    </>
  );
}
