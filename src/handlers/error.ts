import { ZodError } from 'zod';

/**
 * ParsedError<T> representa as mensagens de erro mapeadas por campo e a mensagem global.
 */
export interface ParsedError<T extends object> {
  fieldErrors: Partial<Record<keyof T, string>>;
  globalError?: string;
}

/**
 * parseError converte um erro genérico ou ZodError em um objeto com mensagens de erro.
 * @param err Erro lançado pela Server Action ou validação Zod.
 * @returns {ParsedError<T>} Objeto contendo fieldErrors e globalError.
 */
export function parseError<T extends object>(err: unknown): ParsedError<T> {
  // Se for um erro de validação Zod, extraímos mensagens de cada campo
  if (err instanceof ZodError) {
    const flat = err.flatten().fieldErrors;
    const fieldErrors: ParsedError<T>['fieldErrors'] = {};
    for (const key in flat) {
      if (flat[key] && flat[key]![0]) {
        fieldErrors[key as keyof T] = flat[key]![0];
      }
    }
    return { fieldErrors };
  }

  // Para qualquer outro erro, definimos uma mensagem global
  const message = err instanceof Error ? err.message : String(err);
  return { fieldErrors: {}, globalError: message };
}
