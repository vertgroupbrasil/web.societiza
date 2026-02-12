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
  DatePicker,
  Checkbox,
} from '@shadcn/index';
import { CompanyData, maskInscricaoImob, UFs } from '@form/index';

interface Props {
  form: UseFormReturn<CompanyData>;
  hasFieldError: (fieldName: FieldPath<CompanyData>) => boolean; // ✅ Corrigido
  watchCapitalIntegralizado: boolean;
  watchResponsabilidadeTecnica: boolean;
}

export const AdditionalInfoSection = ({
  form,
  hasFieldError,
  watchCapitalIntegralizado,
  watchResponsabilidadeTecnica,
}: Props) => (
  <Card>
    <CardHeader>
      <CardTitle>Informações Adicionais</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <FormField
        control={form.control}
        name="inscricao_imob"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Inscrição Imobiliária *</FormLabel>
            <FormControl>
              <Input
                placeholder="00-000-000.000-0"
                value={maskInscricaoImob(field.value || '')}
                onChange={(value: string) => {
                  const masked = maskInscricaoImob(value);
                  field.onChange(masked);
                }}
                className={
                  hasFieldError('inscricao_imob')
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
        name="val_capital_social"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valor do Capital Social *</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="1000"
                step="0.01"
                value={field.value || ''}
                onChange={(value: string) => field.onChange(Number(value))}
                className={
                  hasFieldError('val_capital_social')
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
        name="capital_integralizado"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Capital totalmente integralizado</FormLabel>
            </div>
          </FormItem>
        )}
      />

      {!watchCapitalIntegralizado && (
        <FormField
          control={form.control}
          name="data_integralizacao"
          rules={{
            required: {
              value: !watchCapitalIntegralizado,
              message:
                'Data de integralização é obrigatória quando o capital não está totalmente integralizado',
            },
            validate: {
              futureDate: (value?: string) => {
                if (!value) return true;

                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (selectedDate < today) {
                  return 'Data de integralização deve ser hoje ou no futuro';
                }

                return true;
              },
            },
          }}
          render={({ field }) => {
            const { value, onChange } = field;

            return (
              <FormItem>
                <FormLabel>Data de Integralização *</FormLabel>
                <FormControl>
                  <DatePicker
                    value={value ? new Date(value + 'T00:00:00') : undefined}
                    onChange={(date) => {
                      const dateString = date
                        ? date.toISOString().split('T')[0]
                        : '';
                      onChange(dateString);
                    }}
                    placeholder="Selecione a data"
                    className={
                      hasFieldError('data_integralizacao')
                        ? 'border-red-500 bg-red-50'
                        : ''
                    }
                    minDate={new Date()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      )}

      <FormField
        control={form.control}
        name="area_empresa"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Área da Empresa (m²) *</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="100"
                step="0.01"
                value={field.value || ''}
                onChange={(value: string) => field.onChange(Number(value))}
                className={
                  hasFieldError('area_empresa')
                    ? 'border-red-500 bg-red-50'
                    : ''
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="empresa_anexa_resid"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Empresa anexa à residência</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endereco_apenas_contato"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Endereço apenas para contato</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="info_adicionais.resp_tecnica"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Possui responsabilidade técnica</FormLabel>
              </div>
            </FormItem>
          )}
        />
      </div>

      {watchResponsabilidadeTecnica && (
        <div className="space-y-4 border-l-4 border-blue-500 pl-4">
          <h4 className="font-medium">Dados do Responsável Técnico</h4>

          <FormField
            control={form.control}
            name="info_adicionais.nome_responsavel"
            rules={{
              required: {
                value: watchResponsabilidadeTecnica,
                message:
                  'Nome do responsável é obrigatório quando há responsabilidade técnica',
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Responsável *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nome completo"
                    {...field}
                    className={
                      hasFieldError('info_adicionais.nome_responsavel')
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
            name="info_adicionais.nmr_carteira_profissional"
            rules={{
              required: {
                value: watchResponsabilidadeTecnica,
                message:
                  'Número da carteira é obrigatório quando há responsabilidade técnica',
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número da Carteira Profissional *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="000000"
                    {...field}
                    className={
                      hasFieldError('info_adicionais.nmr_carteira_profissional')
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
              name="info_adicionais.uf"
              rules={{
                required: {
                  value: watchResponsabilidadeTecnica,
                  message:
                    'UF da carteira é obrigatória quando há responsabilidade técnica',
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UF da Carteira *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={
                          hasFieldError('info_adicionais.uf')
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

            <FormField
              control={form.control}
              name="info_adicionais.area_resp"
              rules={{
                required: {
                  value: watchResponsabilidadeTecnica,
                  message:
                    'Área de responsabilidade é obrigatória quando há responsabilidade técnica',
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Área de Responsabilidade*</FormLabel>
                  <FormControl>
                    <Input
                      type="string"
                      placeholder="Informática"
                      step="0.01"
                      value={field.value || ''}
                      onChange={(value: string) => field.onChange(value)}
                      className={
                        hasFieldError('info_adicionais.area_resp')
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
        </div>
      )}
    </CardContent>
  </Card>
);
