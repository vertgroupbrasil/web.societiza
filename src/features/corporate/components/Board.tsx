'use client';

import React, { useMemo } from 'react';
import {
  CorporateDrawer,
  FiltersDialog,
  SearchBar,
  useCorporateFilters,
  Column,
  useCorporateBoard,
} from '@corporate/index';

import ProcessDialog from './ui/ProcessDialog';
import { useManagement } from '@flowtec/features/management/hooks/queries/useManagementQueries';

export function Board() {
  const { filters, applyFilters } = useCorporateFilters();
  const { processTypes, stages, processes } = useCorporateBoard();
  const { data: accounties } = useManagement();

  const filteredProcesses = useMemo(() => {
    const allProcesses = processes.flatMap((etapa) => etapa.processos || []);
    return applyFilters(allProcesses);
  }, [applyFilters, processes]);

  const stagesWithFilteredProcesses = useMemo(() => {
    return processes.map((stage) => ({
      ...stage,
      processos: (stage.processos || []).filter((processo) =>
        filteredProcesses.some((filtered) => filtered.id === processo.id),
      ),
    }));
  }, [processes, filteredProcesses]);

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
          <div className="w-full max-w-full px-4 py-4 space-y-4 overflow-hidden">
            <div className="flex items-center justify-between gap-4 w-full min-w-0">
              <div className="flex-1 min-w-0 overflow-hidden">
                <h2 className="text-2xl sm:text-3xl font-semibold text-foreground truncate">
                  Societário
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate"></p>
              </div>
              <div className="flex-shrink-0">
                <ProcessDialog
                  {...(accounties && { accounties })} // ✅ Só passa se não for undefined
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
              <div className="flex-shrink-0">
                <FiltersDialog accounties={accounties} />
              </div>
            </div>
          </div>
        </div>

        {/* ÁREA DO KANBAN - Container independente com scroll horizontal */}
        <div className="flex-1 min-h-0 w-full relative ">
          <div className="absolute inset-0 overflow-x-auto">
            <div className="flex gap-6 h-full w-max min-w-full p-4">
              {stagesWithFilteredProcesses.map((stage) => (
                <div key={stage.id} className="flex-shrink-0 w-80 h-full">
                  <Column stage={stage} processes={stage.processos || []} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER FIXO - Também fica dentro dos limites da viewport */}
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
