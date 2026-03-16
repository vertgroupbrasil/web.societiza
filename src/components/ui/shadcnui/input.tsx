'use client';
import * as React from 'react';
import IMask from 'imask';
import { cn } from '@societiza/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';
import { Info } from 'lucide-react';

// Tipos de máscara predefinidos
export type MaskType =
  | 'cpf'
  | 'cnpj'
  | 'phone'
  | 'cellphone'
  | 'cep'
  | 'currency'
  | 'date'
  | 'time'
  | 'credit-card'
  | 'custom';

export interface InputProps
  extends Omit<React.ComponentProps<'input'>, 'onChange'> {
  error?: string | undefined;
  icon?: React.ElementType;
  info?: string;

  mask?: MaskType;
  maskOptions?: any; // Para opções customizadas do IMask
  onChange?: (value: string, unmaskedValue: string, event?: Event) => void;
}

// Configurações de máscara predefinidas
const getMaskConfig = (maskType: MaskType, customOptions?: any): any => {
  const configs = {
    cpf: {
      mask: '000.000.000-00',
    },
    cnpj: {
      mask: '00.000.000/0000-00',
    },
    phone: {
      mask: '(00) 0000-0000',
    },
    cellphone: {
      mask: [{ mask: '(00) 0000-0000' }, { mask: '(00) 00000-0000' }],
    },
    cep: {
      mask: '00000-000',
    },
    currency: {
      mask: 'R$ num',
      blocks: {
        num: {
          mask: Number,
          scale: 2,
          thousandsSeparator: '.',
          padFractionalZeros: true,
          normalizeZeros: true,
          radix: ',',
          mapToRadix: ['.'],
        },
      },
    },
    date: {
      mask: Date,
      pattern: 'd{/}m{/}Y',
      blocks: {
        d: { mask: IMask.MaskedRange, from: 1, to: 31 },
        m: { mask: IMask.MaskedRange, from: 1, to: 12 },
        Y: { mask: IMask.MaskedRange, from: 1900, to: 2100 },
      },
      format: (date: Date) => {
        return [
          String(date.getDate()).padStart(2, '0'),
          String(date.getMonth() + 1).padStart(2, '0'),
          date.getFullYear(),
        ].join('/');
      },
      parse: (str: string) => {
        const [day, month, year] = str.split('/').map(Number);
        return new Date(year, month - 1, day);
      },
    },
    time: {
      mask: 'HH:MM',
      blocks: {
        HH: { mask: IMask.MaskedRange, from: 0, to: 23 },
        MM: { mask: IMask.MaskedRange, from: 0, to: 59 },
      },
    },
    'credit-card': {
      mask: '0000 0000 0000 0000',
    },
    custom: customOptions || {},
  };

  return configs[maskType] || customOptions;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      error,
      icon: Icon,
      info,

      placeholder,
      mask,
      maskOptions,
      onChange,
      value,
      defaultValue,
      ...props
    },
    ref,
  ) => {
    const [showError, setShowError] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const maskRef = React.useRef<any>(null);

    // Combina as refs
    React.useImperativeHandle(ref, () => inputRef.current!);

    React.useEffect(() => {
      if (error) {
        setShowError(true);
        const timer = setTimeout(() => setShowError(false), 500);
        return () => clearTimeout(timer);
      }
    }, [error]);

    // Configura a máscara
    React.useEffect(() => {
      if (mask && inputRef.current) {
        const maskConfig = getMaskConfig(mask, maskOptions);

        // Destroy previous mask if exists
        if (maskRef.current) {
          maskRef.current.destroy();
        }

        // Create new mask
        maskRef.current = IMask(inputRef.current, maskConfig);

        // Handle change events
        if (onChange) {
          maskRef.current.on('accept', () => {
            const maskedValue = maskRef.current.value;
            const unmaskedValue = maskRef.current.unmaskedValue;
            onChange(maskedValue, unmaskedValue);
          });
        }

        // Set initial value if provided
        if (value !== undefined) {
          maskRef.current.value = value;
        } else if (defaultValue !== undefined) {
          maskRef.current.value = defaultValue;
        }

        return () => {
          if (maskRef.current) {
            maskRef.current.destroy();
          }
        };
      }
    }, [mask, maskOptions, onChange, value]);

    // Update mask value when value prop changes
    React.useEffect(() => {
      if (maskRef.current && value !== undefined) {
        if (maskRef.current.value !== value) {
          maskRef.current.value = value;
        }
      }
    }, [value]);

    // Handle regular onChange for non-masked inputs
    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!mask && onChange) {
          onChange(e.target.value, e.target.value, e.nativeEvent);
        }
      },
      [mask, onChange],
    );

    return (
      <div className="w-full">
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {error ? (
                <Icon className="h-4 w-4 text-destructive" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
            </div>
          )}
          <input
            type={type}
            data-slot="input"
            className={cn(
              'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
              'bg-transparent dark:bg-input/30',
              'border',
              'border-input',
              'flex h-9 w-full min-w-0 rounded-md py-1 text-base shadow-xs transition-[color,box-shadow,border-color] outline-none',
              'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
              'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
              'md:text-sm',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
              // Icon spacing
              Icon ? 'pl-10 pr-3' : 'px-3',
              // Error states
              error && [
                'border-destructive',
                'focus-visible:border-destructive focus-visible:ring-destructive/20',
                'text-destructive',
                showError && 'animate-shake',
              ],
              className,
            )}
            ref={inputRef}
            aria-invalid={error ? 'true' : 'false'}
            placeholder={placeholder}
            onChange={handleChange}
            value={value ?? ''}
            defaultValue={defaultValue}
            {...props}
          />
          {info && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{info}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
        {error && (
          <div className="mt-1 animate-slide-down">
            <p className="text-sm text-destructive font-medium">{error}</p>
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
