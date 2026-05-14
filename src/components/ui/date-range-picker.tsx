'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { cn } from '@societiza/lib/utils';
import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@shadcn/index';

interface DateRangePickerProps {
  /**
   * The selected date range.
   * CORREÇÃO: Tipo explícito com undefined
   */
  dateRange?: DateRange | undefined;
  /**
   * Event handler called when the date range changes.
   */
  onDateRangeChange?: (dateRange: DateRange | undefined) => void;
  /**
   * Placeholder text for the trigger button.
   */
  placeholder?: string;
  /**
   * Additional CSS classes.
   */
  className?: string;
  /**
   * Whether the component is disabled.
   */
  disabled?: boolean;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  placeholder = 'Selecione o período',
  className,
  disabled = false,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) {
      return placeholder;
    }

    if (range.from && !range.to) {
      return range.from.toLocaleDateString('pt-BR');
    }

    if (range.from && range.to) {
      return `${range.from.toLocaleDateString('pt-BR')} - ${range.to.toLocaleDateString('pt-BR')}`;
    }

    return placeholder;
  };

  // CORREÇÃO: Garantir que defaultMonth seja sempre Date válido
  const getDefaultMonth = (): Date => {
    // Prioridade: dateRange.from, dateRange.to, ou data atual
    if (dateRange?.from) {
      return dateRange.from;
    }
    if (dateRange?.to) {
      return dateRange.to;
    }
    return new Date();
  };

  // CORREÇÃO: Props do Calendar com tipos corretos
  const calendarProps = {
    initialFocus: true,
    mode: 'range' as const,
    defaultMonth: getDefaultMonth(), // Sempre Date válido
    selected: dateRange,
    onSelect: (range: DateRange | undefined) => {
      onDateRangeChange?.(range);
      // Fecha o popover quando ambas as datas são selecionadas
      if (range?.from && range?.to) {
        setIsOpen(false);
      }
    },
    numberOfMonths: 2,
    // CORREÇÃO: Remove disabled se for boolean simples
    ...(disabled && { disabled: true }),
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !dateRange?.from && 'text-muted-foreground',
              disabled && 'opacity-50 cursor-not-allowed',
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange(dateRange)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar {...calendarProps} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
