// lib/zod-portuguese.ts
import { z } from 'zod';

// Custom error map for Portuguese translations
const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      if (issue.expected === 'string') {
        return { message: 'Este campo deve ser um texto' };
      }
      if (issue.expected === 'number') {
        return { message: 'Este campo deve ser um número' };
      }
      if (issue.expected === 'boolean') {
        return { message: 'Este campo deve ser verdadeiro ou falso' };
      }
      return { message: `Tipo inválido. Esperado ${issue.expected}, recebido ${issue.received}` };

    case z.ZodIssueCode.invalid_literal:
      return { message: `Valor literal inválido. Esperado ${JSON.stringify(issue.expected)}` };

    case z.ZodIssueCode.unrecognized_keys:
      return { message: `Chave(s) não reconhecida(s) no objeto: ${issue.keys.map(k => `'${k}'`).join(', ')}` };

    case z.ZodIssueCode.invalid_union:
      return { message: 'Valor inválido' };

    case z.ZodIssueCode.invalid_enum_value:
      return { message: `Valor inválido. Esperado ${issue.options.map(o => `'${o}'`).join(' | ')}, recebido '${issue.received}'` };

    case z.ZodIssueCode.invalid_arguments:
      return { message: 'Argumentos de função inválidos' };

    case z.ZodIssueCode.invalid_return_type:
      return { message: 'Tipo de retorno de função inválido' };

    case z.ZodIssueCode.invalid_date:
      return { message: 'Data inválida' };

    case z.ZodIssueCode.invalid_string:
      if (issue.validation !== 'regex') {
        return { message: `${issue.validation} inválido` };
      }
      return { message: 'Formato inválido' };

    case z.ZodIssueCode.too_small:
      if (issue.type === 'array') {
        return { message: `Array deve conter ${issue.exact ? 'exatamente' : 'pelo menos'} ${issue.minimum} elemento(s)` };
      }
      if (issue.type === 'string') {
        return { message: `String deve conter ${issue.exact ? 'exatamente' : 'pelo menos'} ${issue.minimum} caractere(s)` };
      }
      if (issue.type === 'number') {
        return { message: `Número deve ser ${issue.exact ? 'exatamente' : 'maior ou igual a'} ${issue.minimum}` };
      }
      if (issue.type === 'date') {
        return { message: `Data deve ser ${issue.exact ? 'exatamente' : 'maior ou igual a'} ${new Date(Number(issue.minimum))}` };
      }
      return { message: 'Valor muito pequeno' };

    case z.ZodIssueCode.too_big:
      if (issue.type === 'array') {
        return { message: `Array deve conter ${issue.exact ? 'exatamente' : 'no máximo'} ${issue.maximum} elemento(s)` };
      }
      if (issue.type === 'string') {
        return { message: `String deve conter ${issue.exact ? 'exatamente' : 'no máximo'} ${issue.maximum} caractere(s)` };
      }
      if (issue.type === 'number') {
        return { message: `Número deve ser ${issue.exact ? 'exatamente' : 'menor ou igual a'} ${issue.maximum}` };
      }
      if (issue.type === 'bigint') {
        return { message: `BigInt deve ser ${issue.exact ? 'exatamente' : 'menor ou igual a'} ${issue.maximum}` };
      }
      if (issue.type === 'date') {
        return { message: `Data deve ser ${issue.exact ? 'exatamente' : 'menor ou igual a'} ${new Date(Number(issue.maximum))}` };
      }
      return { message: 'Valor muito grande' };

    case z.ZodIssueCode.invalid_intersection_types:
      return { message: 'Resultados de intersecção não puderam ser mesclados' };

    case z.ZodIssueCode.not_multiple_of:
      return { message: `Número deve ser múltiplo de ${issue.multipleOf}` };

    case z.ZodIssueCode.not_finite:
      return { message: 'Número deve ser finito' };

    case z.ZodIssueCode.custom:
      return { message: ctx.defaultError };

    default:
      return { message: ctx.defaultError };
  }
};

// Set the custom error map globally
z.setErrorMap(customErrorMap);

// Export z for use throughout the app
export { z };

// Common Portuguese validation messages for specific validations
export const portugueseMessages = {
  required: 'Este campo é obrigatório',
  email: 'Digite um email válido',
  minLength: (min: number) => `Deve ter pelo menos ${min} caracteres`,
  maxLength: (max: number) => `Deve ter no máximo ${max} caracteres`,
  min: (min: number) => `Deve ser pelo menos ${min}`,
  max: (max: number) => `Deve ser no máximo ${max}`,
  phone: 'Digite um telefone válido',
  cpf: 'Digite um CPF válido',
  cnpj: 'Digite um CNPJ válido',
  cep: 'Digite um CEP válido',
  url: 'Digite uma URL válida',
  password: 'A senha deve ter pelo menos 8 caracteres, incluindo pelo menos uma letra maiúscula, uma minúscula e um número',
};

// Helper function for custom messages
export const customMessage = (message: string) => ({ message });
