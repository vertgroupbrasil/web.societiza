'use client';
import { useState, useCallback } from 'react';
import { UseFormReturn, FieldPath } from 'react-hook-form';
import { PartnersData } from '@form/index';

interface UsePartnersFormValidationProps {
  form: UseFormReturn<PartnersData>;
}

export const usePartnersFormValidation = ({
  form,
}: UsePartnersFormValidationProps) => {
  const [showFieldErrors, setShowFieldErrors] = useState(false);
  const [validationAttempts, setValidationAttempts] = useState(0);

  const hasFieldError = useCallback(
    (fieldName: FieldPath<PartnersData>) => {
      if (!showFieldErrors) return false;

      const fieldState = form.getFieldState(fieldName);
      const formState = form.formState;

      return !!(
        fieldState.error &&
        (fieldState.isTouched || formState.isSubmitted)
      );
    },
    [form, showFieldErrors],
  );

  const hasArrayFieldError = useCallback(
    (arrayName: string, index: number, fieldName: string) => {
      if (!showFieldErrors) return false;

      const errors = form.formState.errors as any;
      const fieldError = errors[arrayName]?.[index]?.[fieldName];

      return !!fieldError;
    },
    [form.formState.errors, showFieldErrors],
  );

  const validateForm = useCallback(async () => {
    const isValid = await form.trigger();

    if (!isValid) {
      const errors = form.formState.errors;

      return {
        isValid: false,
        errors,
        firstErrorField: null,
      };
    }

    return {
      isValid: true,
      errors: [],
      firstErrorField: null,
    };
  }, [form]);

  const validatePartner = useCallback(
    async (index: number) => {
      const isValid = await form.trigger(`socios.${index}`);
      return isValid;
    },
    [form],
  );

  return {
    showFieldErrors,
    setShowFieldErrors,
    validationAttempts,
    setValidationAttempts,
    hasFieldError,
    hasArrayFieldError,
    validateForm,
    validatePartner,
  };
};
