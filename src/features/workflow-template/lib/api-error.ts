import axios from 'axios';

type ErrorPayload = {
  message?: string;
  detail?: string;
  errors?: Array<{ field?: string; error?: string }>;
};

export function getApiErrorMessage(
  error: unknown,
  fallback: string,
) {
  if (axios.isAxiosError<ErrorPayload>(error)) {
    const data = error.response?.data;
    const validationMessage = data?.errors
      ?.map((item) => item.error)
      .filter(Boolean)
      .join(' ');

    return (
      validationMessage ||
      data?.message ||
      data?.detail ||
      error.message ||
      fallback
    );
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
