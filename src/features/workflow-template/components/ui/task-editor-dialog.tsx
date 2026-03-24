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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Separator,
  Checkbox,
  Label,
} from '@shadcn/index';
import { Plus } from 'lucide-react';
import { createTaskSchemaDTO } from '../../schemas/task.schema';
import { TASK_TYPE_OPTIONS } from '../../constants/template.constants';
import type {
  CreateTaskDTO,
  WorkflowTemplateTask,
} from '../../server/types/template.types';

interface TaskEditorDialogProps {
  trigger?: React.ReactNode;
  task?: WorkflowTemplateTask;
  defaultOrder?: number;
  onSubmit: (data: CreateTaskDTO) => void;
  isLoading?: boolean;
}

export function TaskEditorDialog({
  trigger,
  task,
  defaultOrder = 1,
  onSubmit,
  isLoading = false,
}: TaskEditorDialogProps) {
  const [open, setOpen] = useState(false);
  const isEditing = !!task;

  const form = useForm<CreateTaskDTO>({
    resolver: zodResolver(createTaskSchemaDTO),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      type: task?.type || 'Form',
      configuration: task?.configuration ?? '',
      order: task?.order || defaultOrder,
      isOptional: task?.isOptional || false,
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
    setOpen(false);
    if (!isEditing) {
      form.reset({
        title: '',
        description: '',
        type: 'Form',
        configuration: '',
        order: defaultOrder,
        isOptional: false,
      });
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button type="button" variant="outline" size="sm">
            <Plus className="h-3 w-3 mr-1" />
            Tarefa
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Tarefa' : 'Adicionar Tarefa'}
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
                      placeholder="Ex: Enviar formulário de cadastro"
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
                      placeholder="Descreva o que precisa ser feito..."
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TASK_TYPE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
            </div>

            <FormField
              control={form.control}
              name="isOptional"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label>Tarefa opcional</Label>
                  </div>
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
