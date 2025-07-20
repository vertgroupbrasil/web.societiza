'use client';

import * as React from 'react';
import { format, isValid, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@flowtec/lib/utils';
import {
  Calendar,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@shadcn/index';

interface DatePickerProps {
  value?: Date | undefined;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

const DEFAULT_MIN_DATE = new Date(1900, 0, 1);
const DEFAULT_MAX_DATE = new Date(2035, 11, 31);

const isDateValid = (date: Date | undefined): date is Date => {
  if (!date) return false;
  if (!isValid(date)) return false;
  if (isBefore(date, DEFAULT_MIN_DATE)) return false;
  if (isAfter(date, DEFAULT_MAX_DATE)) return false;
  return true;
};

const formatDateSafely = (date: Date | undefined): string | null => {
  if (!isDateValid(date)) return null;

  try {
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  } catch (error) {
    return null;
  }
};

export function DatePicker({
  value,
  onChange,
  placeholder = 'Selecione uma data',
  className,
  disabled = false,
  minDate = DEFAULT_MIN_DATE,
  maxDate = DEFAULT_MAX_DATE,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value);

  React.useEffect(() => {
    if (isDateValid(value)) {
      setDate(value);
    } else if (value) {
      setDate(undefined);
    }
  }, [value]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setDate(undefined);
      onChange?.(null);
      return;
    }

    if (!isDateValid(selectedDate)) {
      return;
    }

    setDate(selectedDate);
    onChange?.(selectedDate);
  };

  const formattedDate = formatDateSafely(date);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formattedDate ? (
            <span>{formattedDate}</span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          locale={ptBR}
          captionLayout="dropdown"
          fromMonth={minDate}
          toMonth={maxDate}
          disabled={(date) => !isDateValid(date)}
        />
      </PopoverContent>
    </Popover>
  );
}
