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
} from '@shadcn/index';
import { CompanyData, maskPhone } from '@form/index';

interface Props {
  form: UseFormReturn<CompanyData>;
  hasFieldError: (fieldName: FieldPath<CompanyData>) => boolean; // ✅ Corrigido
  hasArrayFieldError: (fieldName: string, index: number) => boolean;
}

export const BasicDataSection = ({
  form,
  hasFieldError,
  hasArrayFieldError,
}: Props) => (
  <Card>
    <CardHeader>
      <CardTitle>Dados Básicos da Empresa</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <FormField
        control={form.control}
        name="opcoes_nome_empresa"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Opções de Nome da Empresa (3 opções) *</FormLabel>
            <div className="space-y-3">
              {[0, 1, 2].map((index) => (
                <FormControl key={index}>
                  <Input
                    placeholder={`Opção ${index + 1}`}
                    value={field.value?.[index] || ''}
                    onChange={(value: string) => {
                      const newValue = [...(field.value || [])];
                      newValue[index] = value;
                      field.onChange(newValue);
                    }}
                    className={
                      hasArrayFieldError('opcoes_nome_empresa', index)
                        ? 'border-red-500 bg-red-50'
                        : ''
                    }
                  />
                </FormControl>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nome_fantasia"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome Fantasia *</FormLabel>
            <FormControl>
              <Input
                placeholder="Digite o nome fantasia"
                {...field}
                className={
                  hasFieldError('nome_fantasia')
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
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email *</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="exemplo@email.com"
                {...field}
                className={
                  hasFieldError('email') ? 'border-red-500 bg-red-50' : ''
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="telefone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone *</FormLabel>
            <FormControl>
              <Input
                placeholder="(47) 99999-9999"
                value={maskPhone(field.value || '')}
                onChange={(value: string) => {
                  const cleanValue = value.replace(/\D/g, '');
                  field.onChange(cleanValue);
                }}
                className={
                  hasFieldError('telefone') ? 'border-red-500 bg-red-50' : ''
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </CardContent>
  </Card>
);
