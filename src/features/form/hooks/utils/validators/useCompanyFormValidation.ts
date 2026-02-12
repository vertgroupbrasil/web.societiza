
'use client';
import { useState, useCallback } from 'react';
import { FieldPath, UseFormReturn } from 'react-hook-form';
import {
  CompanyData,
  REQUIRED_FIELDS,
  getNestedValue,
  extractErrorDetails,
} from '@form/index';

interface UseCompanyFormValidationProps {
  form: UseFormReturn<CompanyData>;
}

export const useCompanyFormValidation = ({
  form,
}: UseCompanyFormValidationProps) => {
  const [showFieldErrors, setShowFieldErrors] = useState(false);
  const [validationAttempts, setValidationAttempts] = useState(0);

  const hasFieldError = useCallback(
    (fieldName: FieldPath<CompanyData>) => {
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
    (fieldName: string, index: number) => {
      if (!showFieldErrors) return false;

      const errors = form.formState.errors as any;
      const fieldError = errors[fieldName]?.[index];

      return !!fieldError;
    },
    [form.formState.errors, showFieldErrors],
  );

  const validateForm = useCallback(async () => {
    const isValid = await form.trigger();

    if (!isValid) {
      const errors = form.formState.errors;
      const errorDetails = extractErrorDetails(errors);

      return {
        isValid: false,
        errors: errorDetails,
        firstErrorField: errorDetails[0]?.field || null,
      };
    }

    return {
      isValid: true,
      errors: [],
      firstErrorField: null,
    };
  }, [form]);

  const checkRequiredFields = useCallback(() => {
    const values = form.getValues();
    const missingFields: string[] = [];

    REQUIRED_FIELDS.forEach(({ field, label }) => {
      const value = getNestedValue(values, field);
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        missingFields.push(label);
      }
    });

    return missingFields;
  }, [form]);

  return {
    showFieldErrors,
    setShowFieldErrors,
    validationAttempts,
    setValidationAttempts,
    hasFieldError,
    hasArrayFieldError,
    validateForm,
    checkRequiredFields,
  };
};