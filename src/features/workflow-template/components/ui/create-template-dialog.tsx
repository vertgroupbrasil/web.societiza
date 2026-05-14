'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Textarea,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Separator,
} from '@shadcn/index';
import { Plus } from 'lucide-react';
import { createTemplateSchemaDTO } from '../../schemas/template.schema';
import { useCreateTemplate } from '../../hooks/mutations/use-template-mutations';
import type { CreateTemplateDTO } from '../../server/types/template.types';

interface CreateTemplateDialogProps {
  trigger?: React.ReactNode;
}

export function CreateTemplateDialog({ trigger }: CreateTemplateDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const createTemplate = useCreateTemplate();

  const form = useForm<CreateTemplateDTO>({
    resolver: zodResolver(createTemplateSchemaDTO),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const result = await createTemplate.mutateAsync(data);
    setOpen(false);
    form.reset();
    router.push(
      `/dashboard/societario/templates/${result.id}?returnTo=${encodeURIComponent(pathname)}`,
    );
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button type="button">
            <Plus className="h-4 w-4 mr-2" />
            Criar template
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar novo template</DialogTitle>
          <DialogDescription>
            Defina o básico do workflow. Depois você entra no modo de edição
            quando quiser estruturar etapas, tarefas e campos.
          </DialogDescription>
        </DialogHeader>
        <Separator />

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Template Santa Catarina"
                      error={fieldState.error?.message}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Descrição *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o objetivo deste template..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  {fieldState.error && (
                    <p className="text-sm text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
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
              <Button
                type="submit"
                loading={createTemplate.isPending}
                disabled={createTemplate.isPending}
              >
                Criar template
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
