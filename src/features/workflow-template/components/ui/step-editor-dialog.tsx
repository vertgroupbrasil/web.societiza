'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Dialog,
  DialogContent,
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
import { createStepSchemaDTO } from '../../schemas/step.schema';
import type {
  CreateStepDTO,
  WorkflowTemplateStep,
} from '../../server/types/template.types';

interface StepEditorDialogProps {
  trigger?: React.ReactNode;
  step?: WorkflowTemplateStep;
  defaultOrder?: number;
  onSubmit: (data: CreateStepDTO) => void;
  isLoading?: boolean;
}

export function StepEditorDialog({
  trigger,
  step,
  defaultOrder = 1,
  onSubmit,
  isLoading = false,
}: StepEditorDialogProps) {
  const [open, setOpen] = useState(false);
  const isEditing = !!step;

  const form = useForm<CreateStepDTO>({
    resolver: zodResolver(createStepSchemaDTO),
    defaultValues: {
      title: step?.title || '',
      description: step?.description || '',
      order: step?.order || defaultOrder,
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
    setOpen(false);
    if (!isEditing) {
      form.reset({
        title: '',
        description: '',
        order: defaultOrder,
      });
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button type="button" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Nova Etapa
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Etapa' : 'Adicionar Etapa'}
          </DialogTitle>
        </DialogHeader>
        <Separator />

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Coleta de Dados"
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
                      placeholder="Descreva o que acontece nesta etapa..."
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

            <FormField
              control={form.control}
              name="order"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Ordem *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      error={fieldState.error?.message}
                      {...field}
                      onChange={(value) => field.onChange(Number(value))}
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
              <Button type="submit" loading={isLoading} disabled={isLoading}>
                {isEditing ? 'Salvar' : 'Adicionar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
