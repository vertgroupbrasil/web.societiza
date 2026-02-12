'use client';

import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
} from '@shadcn/index';
import { PartnersData } from '@form/index';

interface Props {
  form: UseFormReturn<PartnersData>;
  hasArrayFieldError: (
    arrayName: string,
    index: number,
    fieldName: string,
  ) => boolean;
  partnerIndex: number;
}

const TIPOS_ADMINISTRADOR = [
  { value: 'conjunto', label: 'Em conjunto' },
  { value: 'isoladamente', label: 'Isoladamente' },
  { value: 'nao_aplica', label: 'Não se aplica' },
];

export const AdministratorSection = ({
  form,
  hasArrayFieldError,
  partnerIndex,
}: Props) => {
  const watchAdministrador = form.watch(`socios.${partnerIndex}.administrador`);

  return (
    <div className="space-y-6">
      <h4 className="font-medium text-lg">Administração da Empresa</h4>

      <FormField
        control={form.control}
        name={`socios.${partnerIndex}.administrador`}
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>É administrador da empresa</FormLabel>
            </div>
          </FormItem>
        )}
      />

      {watchAdministrador && (
        <FormField
          control={form.control}
          name={`socios.${partnerIndex}.tipo_administrador`}
          rules={{
            required: {
              value: watchAdministrador,
              message: 'Tipo de administrador é obrigatório',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Administrador *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <FormControl>
                  <SelectTrigger
                    className={
                      hasArrayFieldError(
                        'socios',
                        partnerIndex,
                        'tipo_administrador',
                      )
                        ? 'border-red-500 bg-red-50'
                        : ''
                    }
                  >
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TIPOS_ADMINISTRADOR.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};
