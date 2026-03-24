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
} from '@shadcn/index';
import { Plus, X } from 'lucide-react';
import { createFieldSchemaDTO } from '../../schemas/field.schema';
import { FIELD_TYPE_LABELS } from '../../constants/template.constants';
import type {
  CreateFieldDTO,
  WorkflowTemplateField,
  FieldType,
} from '../../server/types/template.types';

interface FieldEditorDialogProps {
  trigger?: React.ReactNode;
  field?: WorkflowTemplateField;
  onSubmit: (data: CreateFieldDTO) => void;
  isLoading?: boolean;
}

export function FieldEditorDialog({
  trigger,
  field,
  onSubmit,
  isLoading = false,
}: FieldEditorDialogProps) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<string[]>(field?.options || []);
  const [newOption, setNewOption] = useState('');

  const isEditing = !!field;

  const form = useForm<CreateFieldDTO>({
    resolver: zodResolver(createFieldSchemaDTO),
    defaultValues: {
      label: field?.label || '',
      fieldType: field?.fieldType || 'Text',
      options: field?.options || null,
    },
  });

  const fieldType = form.watch('fieldType');

  const handleAddOption = () => {
    const trimmed = newOption.trim();
    if (trimmed && !options.includes(trimmed)) {
      const updated = [...options, trimmed];
      setOptions(updated);
      form.setValue('options', updated, { shouldValidate: true });
      setNewOption('');
    }
  };

  const handleRemoveOption = (index: number) => {
    const updated = options.filter((_, i) => i !== index);
    setOptions(updated);
    form.setValue('options', updated.length > 0 ? updated : null, {
      shouldValidate: true,
    });
  };

  const handleFieldTypeChange = (value: FieldType) => {
    form.setValue('fieldType', value, { shouldValidate: true });
    if (value === 'Text') {
      setOptions([]);
      form.setValue('options', null, { shouldValidate: true });
    }
  };

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
    setOpen(false);
    if (!isEditing) {
      form.reset();
      setOptions([]);
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button type="button" variant="outline" size="sm">
            <Plus className="h-3 w-3 mr-1" />
            Campo
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Campo' : 'Adicionar Campo'}
          </DialogTitle>
        </DialogHeader>
        <Separator />

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field: formField, fieldState }) => (
                <FormItem>
                  <FormLabel>Label *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Nome Completo"
                      error={fieldState.error?.message}
                      {...formField}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fieldType"
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>Tipo do Campo *</FormLabel>
                  <Select
                    value={formField.value}
                    onValueChange={handleFieldTypeChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(
                        Object.entries(FIELD_TYPE_LABELS) as [
                          FieldType,
                          string,
                        ][]
                      ).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {fieldType === 'Select' && (
              <div className="space-y-3">
                <FormLabel>Opções *</FormLabel>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nova opção..."
                    value={newOption}
                    onChange={(value) => setNewOption(value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddOption();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddOption}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {options.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {options.map((opt, i) => (
                      <div
                        key={`${opt}-${i}`}
                        className="flex items-center gap-1 bg-muted rounded-md px-2 py-1 text-sm"
                      >
                        <span>{opt}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(i)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

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
