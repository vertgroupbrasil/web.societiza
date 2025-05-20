

import { HttpError } from './HttpErrors'

// Erros já existentes
export class ValidationError extends HttpError {
  constructor(code: string, fieldErrors: Record<string, string>) {
    super(400, 'Validation failed', code, fieldErrors)
    this.name = 'ValidationError'
  }
}

export class UnauthorizedError extends HttpError {
  constructor() {
    super(401, 'Credenciais inválidas', 'UNAUTHORIZED')
    this.name = 'UnauthorizedError'
  }
}

// Novos erros

// Erro 400 - Bad Request (Requisição mal formada)
export class BadRequestError extends HttpError {
  constructor(message = 'Requisição inválida', code = 'BAD_REQUEST') {
    super(400, message, code)
    this.name = 'BadRequestError'
  }
}

// Erro 403 - Forbidden (Sem permissão)
export class ForbiddenError extends HttpError {
  constructor(message = 'Acesso negado', code = 'FORBIDDEN') {
    super(403, message, code)
    this.name = 'ForbiddenError'
  }
}

// Erro 404 - Not Found (Recurso não encontrado)
export class NotFoundError extends HttpError {
  constructor(resource = 'Recurso', code = 'NOT_FOUND') {
    super(404, `${resource} não encontrado`, code)
    this.name = 'NotFoundError'
  }
}

// Erro 409 - Conflict (Conflito de recursos)
export class ConflictError extends HttpError {
  constructor(message = 'Conflito de dados', code = 'CONFLICT') {
    super(409, message, code)
    this.name = 'ConflictError'
  }
}

// Erro 422 - Unprocessable Entity (Entidade não processável)
export class UnprocessableEntityError extends HttpError {
  constructor(message = 'Dados inválidos para processamento', code = 'UNPROCESSABLE_ENTITY', fieldErrors?: Record<string, string>) {
    super(422, message, code, fieldErrors)
    this.name = 'UnprocessableEntityError'
  }
}

// Erro 429 - Too Many Requests (Muitas requisições)
export class TooManyRequestsError extends HttpError {
  constructor(message = 'Muitas requisições. Tente novamente mais tarde', code = 'TOO_MANY_REQUESTS') {
    super(429, message, code)
    this.name = 'TooManyRequestsError'
  }
}

// Erro 500 - Internal Server Error (Erro interno do servidor)
export class InternalServerError extends HttpError {
  constructor(message = 'Erro interno do servidor', code = 'INTERNAL_SERVER_ERROR') {
    super(500, message, code)
    this.name = 'InternalServerError'
  }
}

// Erro 503 - Service Unavailable (Serviço indisponível)
export class ServiceUnavailableError extends HttpError {
  constructor(message = 'Serviço temporariamente indisponível', code = 'SERVICE_UNAVAILABLE') {
    super(503, message, code)
    this.name = 'ServiceUnavailableError'
  }
}

// Erros específicos da aplicação

// Erro para autenticação expirada
export class TokenExpiredError extends HttpError {
  constructor() {
    super(401, 'Sessão expirada. Faça login novamente', 'TOKEN_EXPIRED')
    this.name = 'TokenExpiredError'
  }
}

// Erro para limites excedidos
export class LimitExceededError extends HttpError {
  constructor(resource = 'Limite', code = 'LIMIT_EXCEEDED') {
    super(400, `${resource} excedido`, code)
    this.name = 'LimitExceededError'
  }
}

// Erro para dados duplicados
export class DuplicateError extends HttpError {
  constructor(resource = 'Recurso', code = 'DUPLICATE_ENTRY') {
    super(409, `${resource} já existe`, code)
    this.name = 'DuplicateError'
  }
}

// Erro para falhas de pagamento
export class PaymentError extends HttpError {
  constructor(message = 'Falha no processamento do pagamento', code = 'PAYMENT_FAILED') {
    super(402, message, code)
    this.name = 'PaymentError'
  }
}

// Erro para operação não suportada
export class NotSupportedError extends HttpError {
  constructor(operation = 'Operação', code = 'NOT_SUPPORTED') {
    super(405, `${operation} não suportada`, code)
    this.name = 'NotSupportedError'
  }
}

// Erro para dados inválidos
export class InvalidDataError extends HttpError {
  constructor(field = 'Dado', code = 'INVALID_DATA', fieldErrors?: Record<string, string>) {
    super(400, `${field} inválido`, code, fieldErrors)
    this.name = 'InvalidDataError'
  }
}

// Erro para quando um serviço externo falha
export class ExternalServiceError extends HttpError {
  constructor(service = 'Serviço externo', code = 'EXTERNAL_SERVICE_ERROR') {
    super(502, `Falha ao se comunicar com ${service}`, code)
    this.name = 'ExternalServiceError'
  }
}

// Função utilitária para criar o erro apropriado com base no status HTTP
export function createHttpError(status: number, message?: string, code?: string, fieldErrors?: Record<string, string>): HttpError {
  switch (status) {
    case 400:
      return new BadRequestError(message, code);
    case 401:
      return new UnauthorizedError();
    case 403:
      return new ForbiddenError(message, code);
    case 404:
      return new NotFoundError(message, code);
    case 409:
      return new ConflictError(message, code);
    case 422:
      return new UnprocessableEntityError(message, code, fieldErrors);
    case 429:
      return new TooManyRequestsError(message, code);
    case 500:
      return new InternalServerError(message, code);
    case 503:
      return new ServiceUnavailableError(message, code);
    default:
      return new HttpError(status, message || 'Erro desconhecido', code || 'UNKNOWN_ERROR', fieldErrors);
  }
}