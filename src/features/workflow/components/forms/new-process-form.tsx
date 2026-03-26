'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsList,
  TabsTrigger,
  Separator,
} from '@shadcn/index';
import { Building } from 'lucide-react';
import {
  formatProcessType,
  ProcessTypes,
  Stages,
  useProcessForm,
} from '@workflow/index';
import type { Accountancy } from '@accountancy/schemas/accountancy.schema';

interface NewProcessFormProps {
  accounties: Accountancy[];
  processTypes: ProcessTypes;
  stages: Stages;
  onSuccess?: () => void;
}

export function NewProcessForm({
  accounties,
  processTypes,
  stages,
  onSuccess,
}: NewProcessFormProps) {
  const { form, onSubmit, isSubmitting, activeTab, setActiveTab } =
    useProcessForm({
      accounties,
      processTypes,
      stages,
      onSuccess,
    });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6 grid grid-cols-1 gap-2">
        {/* Nome da Empresa */}

        <div className="space-y-4 col-span-2">
          <FormLabel>Tipo de Processo *</FormLabel>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              {/* ✅ CORREÇÃO: Loop correto nos tipos de processo */}
              {processTypes.tipo_processo.map((processType) => (
                <TabsTrigger key={processType.id} value={processType.id}>
                  {formatProcessType(processType.descricao)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <FormField
            control={form.control}
            name="nome"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Nome da Empresa *</FormLabel>
                <FormControl>
                  <Input
                    error={fieldState.error?.message}
                    icon={Building}
                    placeholder="Razão Social da empresa"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Contabilidade */}
          <FormField
            control={form.control}
            name="contabilidade_id"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Contabilidade Responsável *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a contabilidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {accounties.map((accounting) => (
                      <SelectItem key={accounting.id} value={accounting.id}>
                        {accounting.tradeName ?? accounting.legalName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <p className="text-sm text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </FormItem>
            )}
          />
        </div>

        {/* Botões */}
        <div className="flex flex-col gap-3 col-span-2">
          <Separator />
          <Button
            loading={isSubmitting}
            variant="default"
            effect="shineHover"
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Criando Processo...' : 'Criar Novo Processo'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
