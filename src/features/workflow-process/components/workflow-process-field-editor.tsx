'use client';

import {
  Checkbox,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@shadcn/index';
import { parseFieldOptions } from '../lib';
import type {
  WorkflowProcessStepField,
  WorkflowProcessTaskField,
} from '../server/types';

type WorkflowProcessFieldEditorProps = {
  field: WorkflowProcessStepField | WorkflowProcessTaskField;
  value: string;
  editable: boolean;
  isSaving: boolean;
  onChange: (value: string) => void;
};

export function WorkflowProcessFieldEditor({
  field,
  value,
  editable,
  isSaving,
  onChange,
}: WorkflowProcessFieldEditorProps) {
  const options = parseFieldOptions(field.options);
  const disabled = !editable || isSaving;

  return (
    <div className="space-y-1">
      <p className="text-sm font-medium">
        {field.label}
        {field.isRequired ? (
          <span className="ml-1 text-destructive">*</span>
        ) : null}
      </p>

      {field.fieldType === 'Text' && (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Informe o valor"
          rows={2}
        />
      )}

      {field.fieldType === 'Integer' && (
        <Input
          type="number"
          value={value}
          onChange={(v) => onChange(v)}
          disabled={disabled}
          placeholder="0"
        />
      )}

      {field.fieldType === 'Date' && (
        <Input
          type="date"
          value={value}
          onChange={(v) => onChange(v)}
          disabled={disabled}
        />
      )}

      {field.fieldType === 'Boolean' && (
        <label className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer">
          <Checkbox
            checked={value === 'true'}
            disabled={disabled}
            onCheckedChange={(checked) =>
              onChange(checked === true ? 'true' : 'false')
            }
          />
          Marcado
        </label>
      )}

      {field.fieldType === 'Select' && (
        <Select value={value} onValueChange={onChange} disabled={disabled}>
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
      )}
    </div>
  );
}
