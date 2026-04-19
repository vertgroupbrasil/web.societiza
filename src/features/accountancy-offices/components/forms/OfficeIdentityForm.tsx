'use client';

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Separator,
} from '@shadcn/index';
import type { UseFormReturn } from 'react-hook-form';
import type { UpdateOfficeInput } from '../../schemas/office.schema';

interface OfficeIdentityFormProps {
  form: UseFormReturn<UpdateOfficeInput>;
  onSubmit: (data: UpdateOfficeInput) => void;
  isPending?: boolean;
}

export function OfficeIdentityForm({
  form,
  onSubmit,
  isPending = false,
}: OfficeIdentityFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Identidade
          </h3>

          {/* CNPJ */}
          <FormField
            control={form.control}
            name="cnpj"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>CNPJ *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="12.345.678/0001-99"
                    error={fieldState.error?.message}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Razão Social + Nome Fantasia */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="legalName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Razão Social *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contabilidade Exemplo LTDA"
                      error={fieldState.error?.message}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tradeName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Nome Fantasia</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contab Exemplo"
                      error={fieldState.error?.message}
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Endereço
          </h3>

          <FormField
            control={form.control}
            name="address"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Endereço *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Rua das Flores, 456, Sala 302"
                    error={fieldState.error?.message}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="city"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Cidade *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="São Paulo"
                        error={fieldState.error?.message}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="state"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>UF *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="SP"
                      maxLength={2}
                      error={fieldState.error?.message}
                      {...field}
                      onChange={(v) => field.onChange(v.toUpperCase())}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>CEP *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="01310-100"
                      error={fieldState.error?.message}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Telefone *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(11) 3344-5566"
                      error={fieldState.error?.message}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>E-mail do escritório</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="contato@escritorio.com.br"
                    error={fieldState.error?.message}
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" loading={isPending} disabled={isPending}>
            Salvar alterações
          </Button>
        </div>
      </form>
    </Form>
  );
}
