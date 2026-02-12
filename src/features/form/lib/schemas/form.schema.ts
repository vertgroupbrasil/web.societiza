import z from 'zod';
import { _companyData } from './company.schema';
import { _partners } from './partner.schema';

const openingFormSchemaRaw = _companyData.merge(_partners);

const baseOpeningFormSchema = openingFormSchemaRaw
  .omit({ processo_id: true })
  .extend({ 
    id: z.string().uuid(), 
  });

// 3) agora sim, aplique os refinamentos
const refinedOpeningFormSchema = baseOpeningFormSchema
  .refine(
    (data) =>
      data.capital_integralizado || Boolean(data.data_integralizacao),
    {
      message:
        'Data de integralização é obrigatória quando capital não está integralizado',
      path: ['data_integralizacao'],
    },
  )
  .refine((data) => data.socios.length >= 1, {
    message: 'Deve haver pelo menos 1 sócio',
    path: ['socios'],
  })
  .refine(
    (data) =>
      data.socios.reduce((sum, s) => sum + s.qtd_cotas, 0) > 0,
    {
      message: 'Total de cotas deve ser maior que zero',
      path: ['socios'],
    },
  )
  .refine((data) => data.socios.some((s) => s.administrador), {
    message: 'Deve haver pelo menos 1 administrador',
    path: ['socios'],
  });

export const openingFormSchemaResponse = z.object({
  formulario: refinedOpeningFormSchema,
});