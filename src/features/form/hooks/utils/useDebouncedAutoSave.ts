'use client';
import { useEffect, useRef } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

interface UseDebouncedAutoSaveProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  saveFunction: (data: T) => void;
  debounceMs?: number;
  enabled: boolean; // ✅ Obrigatório para controle
}

export const useDebouncedAutoSave = <T extends FieldValues>({
  form,
  saveFunction,
  debounceMs = 1000,
  enabled,
}: UseDebouncedAutoSaveProps<T>) => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const subscription = form.watch((value) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        saveFunction(value as T);
      }, debounceMs);
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [form, saveFunction, debounceMs, enabled]);
};
