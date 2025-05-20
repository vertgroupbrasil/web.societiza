

import { ZodError } from 'zod';
import { HttpError } from './HttpErrors';
import { ValidationError } from './ApiErrors'; // Importe o caminho correto para suas classes de erro

/**
 * ParsedError<T> representa as mensagens de erro mapeadas por campo e a mensagem global.
 */
export interface ParsedError<T extends object> {
  fieldErrors: Partial<Record<keyof T, string>>;
  globalError: string | undefined;
  statusCode: number | undefined;
  errorCode: string | undefined;
}

/**
 * parseError converte um erro genérico, ZodError, ou HttpError em um objeto com mensagens de erro.
 * @param err Erro lançado por Server Action, validação Zod, ou API.
 * @returns {ParsedError<T>} Objeto contendo fieldErrors, globalError, statusCode e errorCode.
 */
export function parseError<T extends object>(err: unknown): ParsedError<T> {
  // Caso 1: Se for um erro de validação Zod
  if (err instanceof ZodError) {
    const flat = err.flatten().fieldErrors;
    const fieldErrors: ParsedError<T>['fieldErrors'] = {};
    
    for (const key in flat) {
      if (flat[key] && flat[key]![0]) {
        fieldErrors[key as keyof T] = flat[key]![0];
      }
    }
    
    return { 
      fieldErrors,
      globalError: undefined,
      statusCode: 400, // Bad Request para erros de validação
      errorCode: 'VALIDATION_ERROR'
    };
  }
  
  // Caso 2: Se for um HttpError personalizado (incluindo ValidationError e outros)
  if (err instanceof HttpError) {
    // Se for especificamente um ValidationError, ele tem fieldErrors
    if (err instanceof ValidationError && err.details) {
      const fieldErrors: ParsedError<T>['fieldErrors'] = {};
      
      // Convertemos o Record<string, string> para Partial<Record<keyof T, string>>
      for (const key in err.details) {
        fieldErrors[key as keyof T] = err.details[key];
      }
      
      return {
        fieldErrors,
        globalError: err.message,
        statusCode: err.status,
        errorCode: err.code
      };
    }
    
    // Para outros HttpErrors, usamos apenas a mensagem global
    return {
      fieldErrors: {},
      globalError: err.message,
      statusCode: err.status,
      errorCode: err.code
    };
  }
  
  // Caso 3: Para qualquer outro erro, definimos uma mensagem global
  const message = err instanceof Error ? err.message : String(err);
  return { 
    fieldErrors: {}, 
    globalError: message,
    statusCode: 500, // Internal Server Error como padrão
    errorCode: 'UNKNOWN_ERROR'
  };
}

/**
 * Formata uma mensagem de erro para exibição ao usuário
 * @param error O objeto de erro parseado
 * @returns Uma string formatada para exibição
 */
export function formatErrorMessage<T extends object>(error: ParsedError<T>): string {
  if (error.globalError) {
    return error.globalError;
  }
  
  const fieldMessages = Object.values(error.fieldErrors).filter(Boolean);
  if (fieldMessages.length > 0) {
    return fieldMessages.join('. ');
  }
  
  return 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
}

/**
 * Hook para tratamento simplificado de erros em formulários
 * @param err O erro capturado
 * @param setError Função do react-hook-form para definir erros
 * @param setGlobalError Função setState para definir erro global
 */
// src/handlers/error.ts
import { FieldValues, Path, UseFormSetError } from 'react-hook-form'

export function handleFormError<T extends FieldValues>(
  err: unknown,
  setError: UseFormSetError<T>,
  setGlobalError?: (msg?: string) => void
): { globalError?: string } {
  let globalError: string | undefined = 'Ocorreu um erro inesperado.'

  // Exemplo: erro da API com mensagens por campo
  if (
    err &&
    typeof err === 'object' &&
    'response' in err &&
    (err as any).response?.data
  ) {
    const data = (err as any).response.data

    if (data?.errors) {
      Object.entries(data.errors).forEach(([key, value]) => {
        setError(key as Path<T>, { message: value as string })
      })
    }

    if (data?.message) {
      globalError = data.message
    }
  }

  setGlobalError?.(globalError)

  return {
    ...(globalError ? { globalError } : {})
  }}
