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
    console.log('🔍 useDebouncedAutoSave - enabled:', enabled);

    if (!enabled) {
      console.log('⏭️ Auto-save desabilitado');
      return;
    }

    console.log('✅ Auto-save habilitado');

    const subscription = form.watch((value) => {
      console.log('👀 Hook detectou mudança');

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        console.log('💾 Hook executando save');
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
