'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@shadcn/index';
import { WORKFLOW_PROCESS_FIELD_TYPE_LABELS } from '../constants';
import { parseFieldOptions } from '../lib';
import type {
  FillWorkflowProcessStepFieldParams,
  FillWorkflowProcessTaskFieldParams,
  WorkflowProcessStepField,
  WorkflowProcessTaskField,
} from '../server/types';

type WorkflowProcessFieldEditorProps = {
  field: WorkflowProcessStepField | WorkflowProcessTaskField;
  editable: boolean;
  isSaving: boolean;
  onSave: (
    value:
      | FillWorkflowProcessStepFieldParams
      | FillWorkflowProcessTaskFieldParams,
  ) => void;
  payloadBase: Omit<FillWorkflowProcessStepFieldParams, 'value'> &
    Partial<Pick<FillWorkflowProcessTaskFieldParams, 'taskInstanceId'>>;
};

export function WorkflowProcessFieldEditor({
  field,
  editable,
  isSaving,
  onSave,
  payloadBase,
}: WorkflowProcessFieldEditorProps) {
  const [value, setValue] = useState(field.value ?? '');
  const options = parseFieldOptions(field.options);
  const hasChanged = value !== (field.value ?? '');

  useEffect(() => {
    setValue(field.value ?? '');
  }, [field.id, field.value]);

  const handleSave = () => {
    onSave({
      ...payloadBase,
      value,
    });
  };

  return (
    <div className="rounded-lg border bg-background p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">
            {field.label}
            {field.isRequired ? (
              <span className="ml-1 text-destructive">*</span>
            ) : null}
          </p>
          <p className="text-xs text-muted-foreground">
            {WORKFLOW_PROCESS_FIELD_TYPE_LABELS[field.fieldType]}
          </p>
        </div>
      </div>

      <div className="flex items-end gap-2">
        <div className="flex-1">
          {field.fieldType === 'Text' ? (
            <Textarea
              value={value}
              onChange={(event) => setValue(event.target.value)}
              disabled={!editable}
              placeholder="Informe o valor"
            />
          ) : null}

          {field.fieldType === 'Integer' ? (
            <Input
              type="number"
              value={value}
              onChange={(nextValue) => setValue(nextValue)}
              disabled={!editable}
              placeholder="0"
            />
          ) : null}

          {field.fieldType === 'Date' ? (
            <Input
              type="date"
              value={value}
              onChange={(nextValue) => setValue(nextValue)}
              disabled={!editable}
            />
          ) : null}

          {field.fieldType === 'Boolean' ? (
            <label className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
              <Checkbox
                checked={value === 'true'}
                disabled={!editable}
                onCheckedChange={(checked) =>
                  setValue(checked === true ? 'true' : 'false')
                }
              />
              Marcado
            </label>
          ) : null}

          {field.fieldType === 'Select' ? (
            <Select value={value} onValueChange={setValue} disabled={!editable}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
        </div>

        <Button
          type="button"
          size="sm"
          disabled={!editable || !hasChanged || isSaving}
          onClick={handleSave}
        >
          Salvar
        </Button>
      </div>
    </div>
  );
}
