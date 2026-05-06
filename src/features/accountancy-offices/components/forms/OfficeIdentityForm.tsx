'use client';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from '@shadcn/index';
import { FileText, Landmark, Save } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import type { UpdateOfficeInput } from '../../schemas/office.schema';

interface OfficeIdentityFormProps {
  form: UseFormReturn<UpdateOfficeInput>;
  onSubmit: (data: UpdateOfficeInput) => void;
  isPending?: boolean;
  /**
   * Quando true, todos os inputs ficam desabilitados e o botão de submit é
   * ocultado. Usado para AccountancyAdmin/Employee — spec accountancy-org
   * proíbe edição self-service dos dados cadastrais da contabilidade.
   */
  readOnly?: boolean;
}

export function OfficeIdentityForm({
  form,
  onSubmit,
  isPending = false,
  readOnly = false,
}: OfficeIdentityFormProps) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Identidade pública</CardTitle>
            </div>
            <CardDescription>
              Nome, descrição e presença visual do perfil do escritório.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="legalName"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Razão social *</FormLabel>
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
                    <FormLabel>Nome fantasia</FormLabel>
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
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Descrição do escritório</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Conte em poucas linhas como este escritório atua e o que ele entrega para os clientes."
                      aria-invalid={!!fieldState.error}
                      className="min-h-32"
                      disabled={readOnly}
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="profilePhotoUrl"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Foto do perfil</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://..."
                        error={fieldState.error?.message}
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bannerUrl"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Banner do perfil</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://..."
                        error={fieldState.error?.message}
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Landmark className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Dados legais e contato</CardTitle>
            </div>
            <CardDescription>
              Informações fiscais, endereço e canais de contato da entidade.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
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
                      disabled={readOnly}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

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
                      disabled={readOnly}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_96px]">
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                      disabled={readOnly}
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {!readOnly && (
          <div className="flex justify-end">
            <Button
              type="submit"
              loading={isPending}
              disabled={isPending}
              icon={Save}
              iconPlacement="left"
            >
              Salvar alterações
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
