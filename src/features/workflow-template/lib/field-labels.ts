import type {
  FieldType,
  WorkflowTemplateField,
} from '../server/types/template.types';

const FIELD_LABEL_PREFIX: Record<FieldType, string> = {
  Text: 'Campo de texto',
  Select: 'Campo de seleção',
  Boolean: 'Campo booleano',
  Integer: 'Campo numérico',
  Date: 'Campo de data',
};

export function getNextFieldLabel(
  fields: WorkflowTemplateField[],
  fieldType: FieldType,
) {
  const prefix = FIELD_LABEL_PREFIX[fieldType];
  const nextIndex =
    fields.filter((field) => field.fieldType === fieldType).length + 1;

  return `${prefix} ${nextIndex}`;
}
