'use client';

import { UseFormReturn } from 'react-hook-form';
import {
  Input,
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
} from '@shadcn/index';
import { PartnersData, maskCEP, UFs } from '@form/index';

interface Props {
  form: UseFormReturn<PartnersData>;
  hasArrayFieldError: (arrayName: string, index: number, fieldName: string) => boolean;
  partnerIndex: number;
}

export const AddressPartnerSection = ({ form, hasArrayFieldError, partnerIndex }: Props) => (
  <div className="space-y-6">
    <h4 className="font-medium text-lg">Endereço</h4>
    
    <FormField
      control={form.control}
      name={`socios.${partnerIndex}.endereco.cep`}
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
              className={hasArrayFieldError('socios', partnerIndex, 'endereco.cep') ? 'border-red-500 bg-red-50' : ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name={`socios.${partnerIndex}.endereco.rua`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Rua *</FormLabel>
          <FormControl>
            <Input
              placeholder="Nome da rua"
              {...field}
              className={hasArrayFieldError('socios', partnerIndex, 'endereco.rua') ? 'border-red-500 bg-red-50' : ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name={`socios.${partnerIndex}.endereco.numero`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número *</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="123"
                value={field.value || ''}
                onChange={(value: string) => field.onChange(Number(value))}
                className={hasArrayFieldError('socios', partnerIndex, 'endereco.numero') ? 'border-red-500 bg-red-50' : ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`socios.${partnerIndex}.endereco.bairro`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bairro *</FormLabel>
            <FormControl>
              <Input
                placeholder="Nome do bairro"
                {...field}
                className={hasArrayFieldError('socios', partnerIndex, 'endereco.bairro') ? 'border-red-500 bg-red-50' : ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>

    <FormField
      control={form.control}
      name={`socios.${partnerIndex}.endereco.complemento`}
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
        name={`socios.${partnerIndex}.endereco.municipio`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Município *</FormLabel>
            <FormControl>
              <Input
                placeholder="Nome do município"
                {...field}
                className={hasArrayFieldError('socios', partnerIndex, 'endereco.municipio') ? 'border-red-500 bg-red-50' : ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`socios.${partnerIndex}.endereco.uf`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>UF *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <FormControl>
                <SelectTrigger className={hasArrayFieldError('socios', partnerIndex, 'endereco.uf') ? 'border-red-500 bg-red-50' : ''}>
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
  </div>
);