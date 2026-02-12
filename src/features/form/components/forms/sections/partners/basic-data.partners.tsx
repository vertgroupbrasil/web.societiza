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
  DatePicker,
} from '@shadcn/index';
import { PartnersData, maskCPF, maskRG, UFs } from '@form/index';

interface Props {
  form: UseFormReturn<PartnersData>;
  hasArrayFieldError: (arrayName: string, index: number, fieldName: string) => boolean;
  partnerIndex: number;
}

const ESTADOS_CIVIS = [
  { value: 'solteiro', label: 'Solteiro(a)' },
  { value: 'casado', label: 'Casado(a)' },
  { value: 'separado', label: 'Separado(a)' },
  { value: 'divorciado', label: 'Divorciado(a)' },
  { value: 'viuvo', label: 'Viúvo(a)' },
];

const REGIMES_CASAMENTO = [
  { value: 'separacao_total', label: 'Separação Total' },
  { value: 'comunhao_parcial', label: 'Comunhão Parcial' },
  { value: 'comunhao_universal', label: 'Comunhão Universal' },
  { value: 'participacao_final', label: 'Participação Final' },
];

export const BasicPartnerSection = ({ form, hasArrayFieldError, partnerIndex }: Props) => {
  const watchEstadoCivil = form.watch(`socios.${partnerIndex}.estado_civil`);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name={`socios.${partnerIndex}.nome`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nome completo do sócio"
                  {...field}
                  className={hasArrayFieldError('socios', partnerIndex, 'nome') ? 'border-red-500 bg-red-50' : ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`socios.${partnerIndex}.nacionalidade`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nacionalidade *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Brasileira"
                  {...field}
                  className={hasArrayFieldError('socios', partnerIndex, 'nacionalidade') ? 'border-red-500 bg-red-50' : ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name={`socios.${partnerIndex}.data_nascimento`}
          render={({ field }) => {
            const { value, onChange } = field;
            
            return (
              <FormItem>
                <FormLabel>Data de Nascimento *</FormLabel>
                <FormControl>
                  <DatePicker
                    value={value ? new Date(value + 'T00:00:00') : undefined}
                    onChange={(date) => {
                      const dateString = date ? date.toISOString().split('T')[0] : '';
                      onChange(dateString);
                    }}
                    placeholder="Selecione a data"
                    className={hasArrayFieldError('socios', partnerIndex, 'data_nascimento') ? 'border-red-500 bg-red-50' : ''}
                    maxDate={new Date()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name={`socios.${partnerIndex}.profissao`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profissão *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Empresário"
                  {...field}
                  className={hasArrayFieldError('socios', partnerIndex, 'profissao') ? 'border-red-500 bg-red-50' : ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name={`socios.${partnerIndex}.estado_civil`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado Civil *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className={hasArrayFieldError('socios', partnerIndex, 'estado_civil') ? 'border-red-500 bg-red-50' : ''}>
                    <SelectValue placeholder="Selecione o estado civil" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ESTADOS_CIVIS.map((item) => (
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

        {watchEstadoCivil === 'casado' && (
          <FormField
            control={form.control}
            name={`socios.${partnerIndex}.regime_casamento`}
            rules={{
              required: {
                value: watchEstadoCivil === 'casado',
                message: 'Regime de casamento é obrigatório para casados'
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Regime de Casamento *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl>
                    <SelectTrigger className={hasArrayFieldError('socios', partnerIndex, 'regime_casamento') ? 'border-red-500 bg-red-50' : ''}>
                      <SelectValue placeholder="Selecione o regime" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {REGIMES_CASAMENTO.map((item) => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name={`socios.${partnerIndex}.cpf`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF *</FormLabel>
              <FormControl>
                <Input
                  placeholder="000.000.000-00"
                  value={maskCPF(field.value || '')}
                  onChange={(value: string) => {
                    const cleanValue = value.replace(/\D/g, '');
                    field.onChange(cleanValue);
                  }}
                  className={hasArrayFieldError('socios', partnerIndex, 'cpf') ? 'border-red-500 bg-red-50' : ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`socios.${partnerIndex}.qtd_cotas`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade de Cotas *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="1"
                  min="1"
                  value={field.value || ''}
                  onChange={(value: string) => field.onChange(Number(value))}
                  className={hasArrayFieldError('socios', partnerIndex, 'qtd_cotas') ? 'border-red-500 bg-red-50' : ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name={`socios.${partnerIndex}.rg`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>RG *</FormLabel>
              <FormControl>
                <Input
                  placeholder="00.000.000-0"
                  value={maskRG(field.value || '')}
                  onChange={(value: string) => field.onChange(value)}
                  className={hasArrayFieldError('socios', partnerIndex, 'rg') ? 'border-red-500 bg-red-50' : ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`socios.${partnerIndex}.orgao_expedidor`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Órgão Expedidor *</FormLabel>
              <FormControl>
                <Input
                  placeholder="SSP"
                  {...field}
                  className={hasArrayFieldError('socios', partnerIndex, 'orgao_expedidor') ? 'border-red-500 bg-red-50' : ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`socios.${partnerIndex}.uf`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>UF *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <FormControl>
                  <SelectTrigger className={hasArrayFieldError('socios', partnerIndex, 'uf') ? 'border-red-500 bg-red-50' : ''}>
                    <SelectValue placeholder="UF" />
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
};