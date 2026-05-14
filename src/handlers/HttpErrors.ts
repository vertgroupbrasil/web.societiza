export class HttpError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly details?: any;

  constructor(status: number, message: string, code: string, details?: any) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
