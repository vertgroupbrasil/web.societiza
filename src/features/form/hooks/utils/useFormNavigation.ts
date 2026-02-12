'use client';

import { useCallback } from 'react';
import { useFormContext, FORM_STEPS } from '@form/index';

export const useFormNavigation = () => {
  const { currentStep, formData, goToStep, canNavigateToStep } =
    useFormContext();

  const validateStep = useCallback(
    (stepIndex: number) => {
      const step = FORM_STEPS[stepIndex];
      if (!step.dataKey) return true;

      const stepData = formData[step.dataKey];
      return stepData && step.schema.safeParse(stepData).success;
    },
    [formData],
  );

  const goToNextStep = useCallback(() => {
    const nextStep = currentStep + 1;
    if (nextStep < FORM_STEPS.length && canNavigateToStep(nextStep)) {
      goToStep(nextStep);
    }
  }, [currentStep, canNavigateToStep, goToStep]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  const getCurrentStep = useCallback(() => {
    return FORM_STEPS[currentStep];
  }, [currentStep]);

  return {
    currentStep,
    canNavigateToStep,
    goToNextStep,
    goToStep,
    goToPreviousStep,
    validateStep,
    getCurrentStep,
    isLastStep: currentStep === FORM_STEPS.length - 1,
    isFirstStep: currentStep === 0,
    totalSteps: FORM_STEPS.length,
  };
};
