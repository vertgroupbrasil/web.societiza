'use client';

import React, { useEffect, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shadcn/index';
import {
  ChevronDown,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
  Type,
  X,
} from 'lucide-react';
import { FIELD_TYPE_LABELS } from '../../constants/template.constants';
import type {
  UpdateFieldDTO,
  WorkflowTemplateField,
} from '../../server/types/template.types';

interface TemplateFieldEditorProps {
  field: WorkflowTemplateField;
  disabled?: boolean;
  sortable?: boolean;
  isOver?: boolean;
  onRemove: () => void;
  onUpdate: (data: UpdateFieldDTO) => void;
}

export function TemplateFieldEditor({
  field,
  disabled = false,
  sortable = false,
  isOver = false,
  onRemove,
  onUpdate,
}: TemplateFieldEditorProps) {
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [labelDraft, setLabelDraft] = useState(field.label);
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [optionDraft, setOptionDraft] = useState('');
  const dnd = useSortable({
    id: field.id,
    disabled: disabled || !sortable,
  });

  useEffect(() => {
    setLabelDraft(field.label);
  }, [field.id, field.label]);

  const style = {
    transform: CSS.Transform.toString(dnd.transform),
    transition: dnd.transition,
  };

  const commitLabel = () => {
    const nextLabel = labelDraft.trim();

    if (!nextLabel) {
      setLabelDraft(field.label);
      setIsEditingLabel(false);
      return;
    }

    if (nextLabel !== field.label) {
      onUpdate({
        label: nextLabel,
        fieldType: field.fieldType,
        options: field.options,
        order: field.order,
      });
    }

    setIsEditingLabel(false);
  };

  const handleAddOption = () => {
    const nextOption = optionDraft.trim();

    if (!nextOption) {
      setOptionDraft('');
      setIsAddingOption(false);
      return;
    }

    onUpdate({
      label: field.label,
      fieldType: field.fieldType,
      options: [...(field.options ?? []), nextOption],
      order: field.order,
    });

    setOptionDraft('');
    setIsAddingOption(false);
  };

  const handleRemoveOption = (option: string) => {
    onUpdate({
      label: field.label,
      fieldType: field.fieldType,
      options: (field.options ?? []).filter((item) => item !== option),
      order: field.order,
    });
  };

  return (
    <div
      ref={dnd.setNodeRef}
      style={style}
      className={[
        'rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm transition-colors hover:border-border',
        dnd.isDragging && 'z-20 rotate-[1deg] border-primary/50 shadow-xl',
        isOver && !dnd.isDragging && 'border-primary/60 ring-2 ring-primary/20',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 gap-3">
          {sortable && !disabled && (
            <button
              type="button"
              className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              {...dnd.attributes}
              {...dnd.listeners}
            >
              <GripVertical className="h-4 w-4" />
            </button>
          )}

          <div className="min-w-0 flex-1 space-y-2">
          {isEditingLabel ? (
            <Input
              autoFocus
              value={labelDraft}
              onChange={(value) => setLabelDraft(value)}
              onBlur={commitLabel}
              onKeyDown={(event) => {
                if (event.key === 'Enter') commitLabel();
                if (event.key === 'Escape') {
                  setLabelDraft(field.label);
                  setIsEditingLabel(false);
                }
              }}
              className="h-8"
              disabled={disabled}
            />
          ) : (
            <div className="space-y-1">
              <Label className="text-sm font-medium leading-none text-foreground">
                {field.label}
              </Label>
              <p className="text-xs text-muted-foreground">
                {FIELD_TYPE_LABELS[field.fieldType]}
              </p>
            </div>
          )}
          </div>
        </div>

        {!disabled && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsEditingLabel(true)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              onClick={onRemove}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {field.fieldType === 'Text' ? (
          <Input
            disabled
            placeholder={`${field.label}...`}
            className="pointer-events-none opacity-70"
          />
        ) : (
          <div className="space-y-3">
            <Select disabled>
              <SelectTrigger className="pointer-events-none opacity-70">
                <SelectValue placeholder="Selecionar..." />
              </SelectTrigger>
              <SelectContent>
                {(field.options ?? []).map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex flex-wrap gap-2">
              {(field.options ?? []).map((option) => (
                <span
                  key={option}
                  className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
                >
                  {option}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(option)}
                      className="transition-colors hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}

              {!disabled &&
                (isAddingOption ? (
                  <Input
                    autoFocus
                    value={optionDraft}
                    onChange={(value) => setOptionDraft(value)}
                    onBlur={handleAddOption}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') handleAddOption();
                      if (event.key === 'Escape') {
                        setOptionDraft('');
                        setIsAddingOption(false);
                      }
                    }}
                    className="h-8 w-32"
                    placeholder="Nova opção"
                  />
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-full border-dashed"
                    onClick={() => setIsAddingOption(true)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Opção
                  </Button>
                ))}
            </div>
          </div>
        )}
      </div>

      {!disabled && (
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          {field.fieldType === 'Text' ? (
            <Type className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
          Esse campo aparece durante a execução desta etapa.
        </div>
      )}
    </div>
  );
}
