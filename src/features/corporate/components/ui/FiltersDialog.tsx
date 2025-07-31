'use client';

import React, { useState, useEffect } from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label,
  Separator,
} from '@shadcn/index';
import { DateRangePicker } from '@flowtec/components/ui/date-range-picker';
import { useCorporateFiltersContext } from '@corporate/index';
import { Accounties } from '@flowtec/features/management/schemas/management.schema';

interface FiltersDialogProps {
  accounties?: Accounties;
}

export function FiltersDialog({ accounties }: FiltersDialogProps) {
  const {
    filters,
    hasActiveFilters,
    activeFiltersCount,
    setBusinessFilter,
    removeBusinessFilter,
    resetBusinessFilters,
    getActiveFiltersLabels,
  } = useCorporateFiltersContext();

  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [selectKey, setSelectKey] = useState(0); // Para forçar re-render dos selects

  // Sincroniza filtros locais com o estado global
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Helper para conversão de valores vazios
  const getSelectValue = (value: string) => {
    return value === '' ? 'all' : value;
  };

  // Handler para alteração de filtros locais
  const handleLocalFilterChange = (key: string, value: any) => {
    setLocalFilters((prev: any) => ({
      ...prev,
      [key]: value === 'all' ? '' : value,
    }));
  };

  // Handler específico para date range
  const handleDateRangeChange = (dateRange: DateRange | undefined) => {
    setLocalFilters((prev: any) => ({
      ...prev,
      dateRange: {
        start: dateRange?.from || null,
        end: dateRange?.to || null,
      },
    }));
  };

  // Aplicar filtros
  const handleApplyFilters = () => {
    // Aplica cada filtro individualmente para garantir mapeamento correto
    Object.entries(localFilters).forEach(([key, value]) => {
      // Skip dateRange (tratado separadamente)
      if (key === 'dateRange') return;

      // Converte 'all' para '' antes de aplicar
      const finalValue = value === 'all' ? '' : value;

      if (finalValue !== undefined) {
        setBusinessFilter(key as keyof typeof filters, finalValue);
      }
    });

    // Trata dateRange separadamente
    if (localFilters.dateRange) {
      setBusinessFilter('dateRange', localFilters.dateRange);
    }

    setIsOpen(false);
  };

  // Reset filtros
  const handleResetFilters = () => {
    resetBusinessFilters();
    setLocalFilters({
      searchTerm: '',
      processType: '',
      urgency: '',
      accounting: '',
      dateRange: { start: null, end: null },
      isFiltering: false,
    });
    setSelectKey((prev) => prev + 1); // Força re-render dos selects
  };

  // Converte dateRange para formato do DateRangePicker
  const getDateRange = (): DateRange | undefined => {
    const { start, end } = localFilters?.dateRange || {};
    if (!start && !end) return undefined;

    return {
      from: start ? new Date(start) : undefined,
      to: end ? new Date(end) : undefined,
    };
  };

  // Obter labels para filtros ativos
  const activeLabels = getActiveFiltersLabels();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge
              variant="outline"
              className="ml-2 h-5 w-5 p-0 text-xs rounded-full"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filtros de Processo</DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="space-y-4">
          {/* Filtros Ativos */}
          {hasActiveFilters && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Filtros Ativos</Label>
              <div className="flex flex-wrap gap-2">
                {activeLabels.map((label: any) => (
                  <Badge
                    key={label.key}
                    variant="secondary"
                    className="text-xs cursor-pointer hover:bg-muted-foreground/20"
                    onClick={() => removeBusinessFilter(label.key as any)}
                  >
                    {label.label}: {String(label.value)}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 grid-rows-3 w-full gap-2">
            {/* 1) “Tipo de Processo” ocupa col-span-2 (toda a largura) */}
            <div className="space-y-3 col-span-2">
              <Label htmlFor="process-type">Tipo de Processo</Label>
              <Select
                key={`processType-${selectKey}`}
                value={getSelectValue(localFilters?.processType || '')}
                onValueChange={(value) =>
                  handleLocalFilterChange('processType', value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="abertura">Abertura de empresa</SelectItem>
                  <SelectItem value="alteracao_com_regin">
                    Alteração C/ Regin
                  </SelectItem>
                  <SelectItem value="alteracao_sem_regin_baixa">
                    Alteração S/ Regin/Baixa
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 col-span-2">
              <Label htmlFor="process-type">Contabilidade</Label>

              <Select
                key={`accounting-${selectKey}`}
                value={getSelectValue(localFilters.accounting)}
                onValueChange={(value) =>
                  handleLocalFilterChange('accounting', value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a contabilidade" />
                </SelectTrigger>
                <SelectContent>
                  {(accounties?.results?.empresas ?? []).map((a) => (
                    <SelectItem key={a.id} value={a.nome}>
                      {a.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 2) “Urgência” ocupa apenas a primeira coluna da segunda linha */}
            <div className="space-y-3 col-span-2">
              <Label htmlFor="urgency">Urgência</Label>
              <Select
                key={`urgency-${selectKey}`}
                value={getSelectValue(localFilters?.urgency || '')}
                onValueChange={(value) =>
                  handleLocalFilterChange('urgency', value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a urgência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="warning">Atenção</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                  <SelectItem value="critical">Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 4) “Intervalo de Datas” ocupa col-span-2 (toda a largura) */}
            <div className="space-y-3 col-span-2">
              <Label>Expira entre</Label>
              <DateRangePicker
                dateRange={getDateRange()}
                onDateRangeChange={handleDateRangeChange}
                placeholder="Selecione o período"
                className="w-full"
              />
            </div>
          </div>

          <Separator />

          {/* Ações */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="flex-1"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Limpar
            </Button>
            <Button size="sm" onClick={handleApplyFilters} className="flex-1">
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
