'use client';

import React, { useState } from 'react';
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
} from '@shadcn/index';
import { Plus, Pencil } from 'lucide-react';
import {
  createAccountancyDTO,
  type Accountancy,
  type CreateAccountancyInput,
} from '../schemas/accountancy.schema';
import {
  useCreateAccountancy,
  useUpdateAccountancy,
} from '../hooks/mutations/useAccountancyMutations';

interface AccountancyFormDialogProps {
  accountancy?: Accountancy;
  trigger?: React.ReactNode;
}

export function AccountancyFormDialog({
  accountancy,
  trigger,
}: AccountancyFormDialogProps) {
  const [open, setOpen] = useState(false);
  const isEditing = !!accountancy;

  const createAccountancy = useCreateAccountancy();
  const updateAccountancy = useUpdateAccountancy();

  const form = useForm<CreateAccountancyInput>({
    resolver: zodResolver(createAccountancyDTO),
    defaultValues: {
      cnpj: accountancy?.cnpj ?? '',
      legalName: accountancy?.legalName ?? '',
      tradeName: accountancy?.tradeName ?? '',
      address: accountancy?.address ?? '',
      city: accountancy?.city ?? '',
      state: accountancy?.state ?? '',
      postalCode: accountancy?.postalCode ?? '',
      phone: accountancy?.phone ?? '',
      email: accountancy?.email ?? '',
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await (isEditing && accountancy
      ? updateAccountancy.mutateAsync({ id: accountancy.id, data })
      : createAccountancy.mutateAsync(data));
    setOpen(false);
    form.reset();
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
            {/* Row: CNPJ */}
            <FormField
              control={form.control}
              name="cnpj"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>CNPJ *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="12.345.678/0001-95"
                      error={fieldState.error?.message}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Row: legalName + tradeName */}
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
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Row: address */}
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

            {/* Row: city + state + postalCode */}
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
                        onChange={(value) =>
                          field.onChange(value.toUpperCase())
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Row: postalCode + phone */}
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
                        placeholder="(11) 99999-8888"
                        error={fieldState.error?.message}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Row: email */}
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
