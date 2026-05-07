'use client';

import React, { useMemo, useState } from 'react';
import {
  CorporateDrawer,
  FiltersDialog,
  SearchBar,
  useCorporateFilters,
  Column,
  useCorporateBoard,
} from '@workflow/index';
import {
  useWorkflowTemplates,
  useWorkflowTemplateById,
} from '@workflow-template/hooks/queries/use-workflow-template-queries';
import ProcessDialog from './ui/ProcessDialog';
import { useAccountancies } from '@accountancy/hooks/queries/useAccountancyQueries';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shadcn/index';
import { Layers } from 'lucide-react';
import Link from 'next/link';

export function Board() {
  const { filters, applyFilters } = useCorporateFilters();
  const { processTypes, stages, processes } = useCorporateBoard();
  // useAccountancies retorna envelope paginado; o consumidor legado espera array.
  const { data: accountanciesPage } = useAccountancies();
  const accounties = accountanciesPage?.items;

  // Template-driven columns
  const { data: templatesPage } = useWorkflowTemplates();
  const templates = useMemo(
    () => templatesPage?.items ?? [],
    [templatesPage?.items],
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  // Auto-select first template when loaded
  const activeTemplateId = useMemo(() => {
    if (selectedTemplateId) return selectedTemplateId;
    if (templates.length > 0) return templates[0].id;
    return '';
  }, [selectedTemplateId, templates]);

  const { data: templateDetail, isLoading: templateLoading } =
    useWorkflowTemplateById(activeTemplateId);

  // Map template steps to kanban columns (sorted by order)
  const templateColumns = useMemo(() => {
    if (!templateDetail?.steps) return [];
    return [...templateDetail.steps].sort((a, b) => a.order - b.order);
  }, [templateDetail?.steps]);

  // Map old processes into template columns (by matching stage name → step title)
  const columnsWithProcesses = useMemo(() => {
    if (templateColumns.length === 0) return [];

    const allProcesses = processes.flatMap((etapa) => etapa.processos || []);
    const filtered = applyFilters(allProcesses);

    return templateColumns.map((step) => {
      // Match processes to columns: process.etapa.nome matches step.title
      const stepProcesses = filtered.filter(
        (p) =>
          p.etapa?.nome?.toLowerCase() === step.title.toLowerCase() ||
          p.etapa?.id === step.id,
      );

      return {
        id: step.id,
        nome: step.title,
        ordem: step.order,
        description: step.description,
        taskCount: step.tasks.length,
        fieldCount: step.fields.length,
        processos: stepProcesses,
      };
    });
  }, [templateColumns, processes, applyFilters]);

  // Fallback: use old stages if no template is available
  const displayColumns = useMemo(() => {
    if (columnsWithProcesses.length > 0) return columnsWithProcesses;

    // Fallback to old stage-based columns
    const allProcesses = processes.flatMap((etapa) => etapa.processos || []);
    const filtered = applyFilters(allProcesses);

    return processes.map((stage) => ({
      ...stage,
      processos: (stage.processos || []).filter((processo) =>
        filtered.some((f) => f.id === processo.id),
      ),
    }));
  }, [columnsWithProcesses, processes, applyFilters]);

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

  return (
    <>
      <div className="h-full w-full flex flex-col overflow-hidden">
        <div className="flex-shrink-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
          <div className="w-full max-w-full px-4 space-y-4 overflow-hidden">
            <div className="flex items-center justify-between gap-4 w-full min-w-0">
              <div className="flex-1 min-w-0 overflow-hidden">
                <h2 className="text-2xl sm:text-3xl font-semibold text-foreground truncate">
                  Societário
                </h2>
                {templateDetail && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
                    Template: {templateDetail.name}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Template Selector */}
                {templates.length > 1 && (
                  <Select
                    value={activeTemplateId}
                    onValueChange={setSelectedTemplateId}
                  >
                    <SelectTrigger className="w-48">
                      <Layers className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <ProcessDialog
                  {...(accounties && { accounties })}
                  processTypes={processTypesFormatted}
                  stages={stagesFormatted}
                />
              </div>
            </div>

            {/* Linha 2: busca + filtro */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full min-w-0">
              <div className="flex-1 max-w-full sm:max-w-md min-w-0">
                <SearchBar placeholder="Buscar por nome, contabilidade..." />
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <FiltersDialog accounties={accounties} />
                <Link
                  href="/dashboard/societario/templates"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                >
                  Gerenciar templates
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* AREA DO KANBAN */}
        <div className="flex-1 min-h-0 w-full relative">
          <div className="absolute inset-0 overflow-x-auto">
            {templateLoading ? (
              <div className="flex gap-6 h-full w-max min-w-full p-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-80 h-full">
                    <div className="animate-pulse bg-muted rounded-lg h-full" />
                  </div>
                ))}
              </div>
            ) : displayColumns.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-2">
                  <Layers className="h-12 w-12 text-muted-foreground/50 mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    Nenhum template ativo.{' '}
                    <Link
                      href="/dashboard/societario/templates"
                      className="text-primary hover:underline"
                    >
                      Crie um template
                    </Link>{' '}
                    para começar.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex gap-6 h-full w-max min-w-full p-4">
                {displayColumns.map((col) => (
                  <div key={col.id} className="flex-shrink-0 w-80 h-full">
                    <Column
                      stage={{
                        id: col.id,
                        nome: col.nome,
                        ordem: col.ordem,
                      }}
                      processes={col.processos || []}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER FIXO */}
        {hasActiveFilters && (
          <div className="flex-shrink-0 w-full border-t bg-background/95 backdrop-blur overflow-hidden">
            <div className="px-4 py-2 max-w-full">
              <div className="text-center text-xs sm:text-sm text-muted-foreground truncate">
                Mostrando{' '}
                <span className="font-bold">{filteredProcesses.length}</span>{' '}
                <span className="font-medium">processos</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Drawer (fora do fluxo principal) */}
      <CorporateDrawer />
    </>
  );
}
