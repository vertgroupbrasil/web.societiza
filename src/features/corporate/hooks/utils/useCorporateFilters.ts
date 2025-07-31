'use client';

import { useMemo } from 'react';
import {
  useCorporateFiltersContext,
  Process,
  calculateUrgency,
} from '@corporate/index';

export const useCorporateFilters = () => {
  const {
    filters,
    setBusinessFilter,
    removeBusinessFilter,
    resetBusinessFilters,
    hasActiveFilters,
    activeFiltersCount,
    getActiveFiltersLabels,
  } = useCorporateFiltersContext();

  // Função para filtrar processos - CORRIGIDA
  const applyFilters = useMemo(() => {
    return (processes: Process[]): Process[] => {

      return processes.filter((process) => {
        // Filtro de busca global - CORRIGIDO
        if (filters.searchTerm && filters.searchTerm.trim() !== '') {
          const searchLower = filters.searchTerm.toLowerCase().trim();
          const matchesSearch =
            process.nome.toLowerCase().includes(searchLower) ||
            process.contabilidade?.nome?.toLowerCase().includes(searchLower) ||
            process.tipo_processo.descricao.toLowerCase().includes(searchLower); // CORREÇÃO: tipo_processo em vez de tipoprocesso

          if (!matchesSearch) {
            return false;
          }
        }

        // Filtro por tipo de processo - CORRIGIDO
        if (filters.processType && filters.processType !== '') {
          // Mapear valores do filtro para descrições reais
          const processTypeMap: { [key: string]: string } = {
            abertura: 'Abertura de empresa',
            alteracao_com_regin: 'Alteração contratual com regin',
            alteracao_sem_regin_baixa: 'Alteração contratual sem regin/baixa ',
          };

          const expectedType =
            processTypeMap[filters.processType] || filters.processType;

          if (process.tipo_processo.descricao !== expectedType) {
            return false;
          }
        }

        // Filtro por urgência - CORRIGIDO
        if (filters.urgency && filters.urgency !== '') {
          const processUrgency = calculateUrgency(process.expire_at);
          if (processUrgency !== filters.urgency) {
            return false;
          }
        }

        if (filters.accounting && filters.accounting !== '') {
          if (process.contabilidade.nome !== filters.accounting) {
            return false;
          }
        }

        // Filtro por intervalo de datas
        if (filters.dateRange?.start || filters.dateRange?.end) {
          const expireDate = new Date(process.expire_at);

          if (filters.dateRange.start && expireDate < filters.dateRange.start) {
            return false;
          }

          if (filters.dateRange.end && expireDate > filters.dateRange.end) {
            return false;
          }
        }

        return true;
      });
    };
  }, [filters]);

  // Função para obter estatísticas dos filtros aplicados
  const getFilterStats = useMemo(() => {
    return (processes: Process[]) => {
      const filtered = applyFilters(processes);

      return {
        total: processes.length,
        filtered: filtered.length,
        hidden: processes.length - filtered.length,
        byUrgency: {
          normal: filtered.filter(
            (p) => calculateUrgency(p.expire_at) === 'normal',
          ).length,
          warning: filtered.filter(
            (p) => calculateUrgency(p.expire_at) === 'warning',
          ).length,
          urgent: filtered.filter(
            (p) => calculateUrgency(p.expire_at) === 'urgent',
          ).length,
          critical: filtered.filter(
            (p) => calculateUrgency(p.expire_at) === 'critical',
          ).length,
        },
        byProcessType: {
          abertura: filtered.filter(
            (p) => p.tipo_processo.descricao === 'Abertura',
          ).length,
          alteracao: filtered.filter(
            (p) => p.tipo_processo.descricao === 'Alteração',
          ).length,
          baixa: filtered.filter((p) => p.tipo_processo.descricao === 'Baixa')
            .length,
        },
      };
    };
  }, [applyFilters]);

  return {
    // Estados principais
    filters,
    hasActiveFilters,
    activeFiltersCount,

    // Funções principais de filtro
    applyFilters,
    setBusinessFilter,
    removeBusinessFilter,
    resetBusinessFilters,

    // Funções utilitárias
    getFilterStats,
    getActiveFiltersLabels,
    calculateUrgency,

    // Aliases para compatibilidade
    searchValue: filters.searchTerm,
    globalSearch: filters.searchTerm,
  };
};
