import { z } from 'zod';

export const fieldTypeEnum = z.enum([
  'Text',
  'Boolean',
  'Integer',
  'Select',
  'Date',
]);

export const workflowTemplateFieldSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  fieldType: fieldTypeEnum,
  options: z.array(z.string()).nullable(),
  order: z.coerce.number(),
});

export const createFieldSchemaDTO = z
  .object({
    label: z
      .string()
      .trim()
      .min(1, 'Label é obrigatório')
      .max(150, 'Label deve ter no máximo 150 caracteres'),
    fieldType: fieldTypeEnum,
    options: z.array(z.string()).nullable(),
    order: z.coerce.number().min(1, 'Ordem deve ser pelo menos 1'),
  })
  .refine(
    (data) => {
      if (data.fieldType === 'Select') {
        return data.options !== null && data.options.length > 0;
      }
      return true;
    },
    {
      message: 'Campos do tipo Select precisam de pelo menos uma opção',
      path: ['options'],
    },
  )
  .refine(
    (data) => {
      if (data.fieldType !== 'Select') {
        return data.options === null;
      }
      return true;
    },
    {
      message: 'Apenas campos do tipo Select podem ter opções',
      path: ['options'],
    },
  );

export const updateFieldSchemaDTO = createFieldSchemaDTO;
