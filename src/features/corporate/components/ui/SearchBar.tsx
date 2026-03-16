'use client';

import React, { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@shadcn/index';
import { useCorporateFilters, useDebounce } from '@corporate/index';
import { cn } from '@societiza/lib/utils';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export function SearchBar({
  className,
  placeholder = 'Buscar processos...',
}: SearchBarProps) {
  const { filters, setBusinessFilter } = useCorporateFilters();
  const [localValue, setLocalValue] = useState(filters.searchTerm || '');

  // Debounce para evitar muitas chamadas durante digitação
  const debouncedSearch = useDebounce(localValue, 300);

  // Aplica o filtro quando o valor debounced muda
  React.useEffect(() => {
    if (debouncedSearch !== filters.searchTerm) {
      setBusinessFilter('searchTerm', debouncedSearch);
    }
  }, [debouncedSearch, filters.searchTerm, setBusinessFilter]);

  // Sincroniza valor local quando filtros externos mudam
  React.useEffect(() => {
    if (filters.searchTerm !== localValue) {
      setLocalValue(filters.searchTerm || '');
    }
  }, [filters.searchTerm]);

  const handleInputChange = useCallback((value: string) => {
    setLocalValue(value);
  }, []);

  const handleClear = useCallback(() => {
    setLocalValue('');
    setBusinessFilter('searchTerm', '');
  }, [setBusinessFilter]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClear();
      }
    },
    [handleClear],
  );

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        {/* Ícone de busca */}
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />

        {/* Input de busca */}
        <Input
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'pl-10 pr-10 bg-background/50 backdrop-blur-sm border-border/50',
            'focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20',
            'transition-all duration-200',
            localValue && 'pr-10',
          )}
          autoComplete="off"
          spellCheck="false"
        />

        {/* Botão de limpar */}
        {localValue && (
          <button
            onClick={handleClear}
            className={cn(
              'absolute right-3 top-1/2 transform -translate-y-1/2',
              'h-4 w-4 text-muted-foreground hover:text-foreground',
              'transition-colors duration-200',
              'rounded-sm hover:bg-muted/50 p-0.5 -m-0.5',
            )}
            type="button"
            aria-label="Limpar busca"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}
