import React from 'react';

interface FieldErrorProps {
  message?: string;
}

export function FieldError({ message }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p className="text-red-600 text-sm mt-1">{message}</p>
  );
}

interface GlobalErrorProps {
  message?: string;
}

export function GlobalError({ message }: GlobalErrorProps) {
  if (!message) return null;
  return (
    <div className="bg-red-100 text-red-800 p-2 mb-4 rounded">
      {message}
    </div>
  );
}
