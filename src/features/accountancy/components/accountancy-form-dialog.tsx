'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Separator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shadcn/index';
import { Plus, Pencil } from 'lucide-react';
import {
  accountancyFormSchema,
  formToPayload,
  type AccountancyDetail,
  type AccountancyFormInput,
  type AccountancyFormOutput,
} from '../schemas/accountancy.schema';
import {
  useCreateAccountancy,
  useUpdateAccountancy,
} from '../hooks/mutations/useAccountancyMutations';
import { BRAZILIAN_UFS } from '../constants/ufs.constants';
import {
  displayCEP,
  displayCNPJ,
  displayPhone,
} from '../lib/accountancy.formatters';

interface AccountancyFormDialogProps {
  accountancy?: AccountancyDetail;
  trigger?: React.ReactNode;
  onSuccess?: (id: string) => void;
}

export function AccountancyFormDialog({
  accountancy,
  trigger,
  onSuccess,
}: AccountancyFormDialogProps) {
  const [open, setOpen] = useState(false);
  const isEditing = !!accountancy;

  const createAccountancy = useCreateAccountancy();
  const updateAccountancy = useUpdateAccountancy();

  const form = useForm<AccountancyFormInput, unknown, AccountancyFormOutput>({
    resolver: zodResolver(accountancyFormSchema),
    defaultValues: {
      cnpj: accountancy ? displayCNPJ(accountancy.cnpj) : '',
      legalName: accountancy?.legalName ?? '',
      tradeName: accountancy?.tradeName ?? '',
      address: accountancy?.address ?? '',
      city: accountancy?.city ?? '',
      state: accountancy?.state ?? '',
      postalCode: accountancy ? displayCEP(accountancy.postalCode) : '',
      phone: accountancy ? displayPhone(accountancy.phone) : '',
      email: accountancy?.email ?? '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        cnpj: accountancy ? displayCNPJ(accountancy.cnpj) : '',
        legalName: accountancy?.legalName ?? '',
        tradeName: accountancy?.tradeName ?? '',
        address: accountancy?.address ?? '',
        city: accountancy?.city ?? '',
        state: accountancy?.state ?? '',
        postalCode: accountancy ? displayCEP(accountancy.postalCode) : '',
        phone: accountancy ? displayPhone(accountancy.phone) : '',
        email: accountancy?.email ?? '',
      });
    }
  }, [open, accountancy, form]);

  const handleSubmit = form.handleSubmit(async (data) => {
    // `data` aqui é o output do schema (transforms aplicados — dígitos puros, UF upper).
    const payload = formToPayload(data);

    try {
      if (isEditing && accountancy) {
        await updateAccountancy.mutateAsync({ id: accountancy.id, payload });
      } else {
        const { id } = await createAccountancy.mutateAsync(payload);
        onSuccess?.(id);
      }
      setOpen(false);
    } catch (error) {
      const status =
        (error as { response?: { status?: number; data?: unknown } })?.response
          ?.status;
      const data =
        (error as { response?: { data?: { type?: string; errors?: { code: string; message: string }[] } } })
          ?.response?.data;

      if (status === 409 && data?.type === 'CNPJAlreadyExists') {
        form.setError('cnpj', {
          message: 'CNPJ já cadastrado',
        });
        return;
      }

      if (status === 400 && Array.isArray(data?.errors)) {
        for (const err of data.errors) {
          const code = err.code ?? '';
          if (code.startsWith('CNPJ')) {
            form.setError('cnpj', { message: 'CNPJ inválido' });
          } else if (code.startsWith('Legal name')) {
            form.setError('legalName', { message: err.message });
          } else if (code.startsWith('Trade name')) {
            form.setError('tradeName', { message: err.message });
          } else if (code.startsWith('Address')) {
            form.setError('address', { message: err.message });
          } else if (code.startsWith('City')) {
            form.setError('city', { message: err.message });
          } else if (code.startsWith('State')) {
            form.setError('state', { message: err.message });
          } else if (code.startsWith('Postal code')) {
            form.setError('postalCode', { message: err.message });
          } else if (code.startsWith('Phone')) {
            form.setError('phone', { message: err.message });
          } else if (code.startsWith('Email')) {
            form.setError('email', { message: err.message });
          }
        }
      }
    }
  });

  const isPending = createAccountancy.isPending || updateAccountancy.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ??
          (isEditing ? (
            <Button type="button" variant="ghost" size="icon">
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Button>
          ) : (
            <Button type="button">
              <Plus className="h-4 w-4 mr-2" />
              Nova Contabilidade
            </Button>
          ))}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Contabilidade' : 'Nova Contabilidade'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Altere os dados da contabilidade.'
              : 'Preencha os dados para cadastrar a contabilidade no sistema.'}
          </DialogDescription>
        </DialogHeader>
        <Separator />

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="cnpj"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>CNPJ *</FormLabel>
                  <FormControl>
                    <Input
                      mask="cnpj"
                      placeholder="12.345.678/0001-95"
                      error={fieldState.error?.message}
                      value={field.value}
                      onChange={(masked) => field.onChange(masked)}
                      onBlur={field.onBlur}
                      name={field.name}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
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

            <FormField
              control={form.control}
              name="address"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Endereço *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Rua A, 123"
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
                    <Select
                      value={field.value ?? ''}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger
                          aria-invalid={!!fieldState.error}
                          className="w-full"
                        >
                          <SelectValue placeholder="UF" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BRAZILIAN_UFS.map((uf) => (
                          <SelectItem key={uf.value} value={uf.value}>
                            {uf.value} — {uf.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error?.message && (
                      <p className="text-xs text-destructive mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
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
                        mask="cep"
                        placeholder="01310-100"
                        error={fieldState.error?.message}
                        value={field.value}
                        onChange={(masked) => field.onChange(masked)}
                        onBlur={field.onBlur}
                        name={field.name}
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
                        mask="cellphone"
                        placeholder="(11) 99999-8888"
                        error={fieldState.error?.message}
                        value={field.value}
                        onChange={(masked) => field.onChange(masked)}
                        onBlur={field.onBlur}
                        name={field.name}
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
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="contato@exemplo.com"
                      error={fieldState.error?.message}
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" loading={isPending} disabled={isPending}>
                {isEditing ? 'Salvar' : 'Cadastrar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
