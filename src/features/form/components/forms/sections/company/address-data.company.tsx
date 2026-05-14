'use client';

import { FieldPath, UseFormReturn } from 'react-hook-form';
import {
  Input,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shadcn/index';
import { CompanyData, maskCEP, UFs } from '@form/index';

interface Props {
  form: UseFormReturn<CompanyData>;
  hasFieldError: (fieldName: FieldPath<CompanyData>) => boolean; // ✅ Corrigido
}

export const AddressSection = ({ form, hasFieldError }: Props) => (
  <Card>
    <CardHeader>
      <CardTitle>Endereço da Empresa</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <FormField
        control={form.control}
        name="endereco.cep"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CEP *</FormLabel>
            <FormControl>
              <Input
                placeholder="00000-000"
                value={maskCEP(field.value || '')}
                onChange={(value: string) => {
                  const cleanValue = value.replace(/\D/g, '');
                  field.onChange(cleanValue);
                }}
                className={
                  hasFieldError('endereco.cep')
                    ? 'border-red-500 bg-red-50'
                    : ''
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="endereco.rua"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rua *</FormLabel>
            <FormControl>
              <Input
                placeholder="Nome da rua"
                {...field}
                className={
                  hasFieldError('endereco.rua')
                    ? 'border-red-500 bg-red-50'
                    : ''
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="endereco.numero"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="123"
                  value={field.value || ''}
                  onChange={(value: string) => field.onChange(Number(value))}
                  className={
                    hasFieldError('endereco.numero')
                      ? 'border-red-500 bg-red-50'
                      : ''
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endereco.bairro"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nome do bairro"
                  {...field}
                  className={
                    hasFieldError('endereco.bairro')
                      ? 'border-red-500 bg-red-50'
                      : ''
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="endereco.complemento"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Complemento (Opcional)</FormLabel>
            <FormControl>
              <Input placeholder="Apartamento, sala, etc." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="endereco.municipio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Município *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nome do município"
                  {...field}
                  className={
                    hasFieldError('endereco.municipio')
                      ? 'border-red-500 bg-red-50'
                      : ''
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endereco.uf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>UF *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <FormControl>
                  <SelectTrigger
                    className={
                      hasFieldError('endereco.uf')
                        ? 'border-red-500 bg-red-50'
                        : ''
                    }
                  >
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {UFs.map((uf) => (
                    <SelectItem key={uf} value={uf}>
                      {uf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </CardContent>
  </Card>
);
