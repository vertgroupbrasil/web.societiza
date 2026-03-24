import { z } from 'zod';

export const fieldTypeEnum = z.enum(['Text', 'Select']);

export const workflowTemplateFieldSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  fieldType: fieldTypeEnum,
  options: z.array(z.string()).nullable(),
});

export const createFieldSchemaDTO = z
  .object({
    label: z.string().min(1, 'Label é obrigatório'),
    fieldType: fieldTypeEnum,
    options: z.array(z.string()).nullable(),
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
  );

export const updateFieldSchemaDTO = createFieldSchemaDTO;
