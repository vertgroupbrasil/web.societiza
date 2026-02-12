// components/FormRenderer.tsx
'use client';

import { FORM_STEPS, useOpeningForm } from '@form/index';
import { Progress, Card, CardContent } from '@shadcn/index';
import { CheckCircle, Circle } from 'lucide-react';

export const FormRenderer = () => {
  const { currentStep, canNavigateToStep, goToStep } = useOpeningForm();

  const currentStepConfig = FORM_STEPS[currentStep];
  const progress = ((currentStep + 1) / FORM_STEPS.length) * 100;

  if (!currentStepConfig) {
    return <div>Erro: Step não encontrado</div>;
  }

  const StepComponent = currentStepConfig.component;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Progress Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso do Formulário</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Steps */}
            <div className="flex justify-between">
              {FORM_STEPS.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
                const canAccess = canNavigateToStep(index);

                return (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center space-y-2 ${
                      canAccess
                        ? 'cursor-pointer'
                        : 'cursor-not-allowed opacity-50'
                    }`}
                    onClick={() => canAccess && goToStep(index)}
                  >
                    <div
                      className={`
                      flex items-center justify-center w-10 h-10 rounded-full border-2 
                      ${
                        isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : isCurrent
                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                            : 'border-gray-300 text-gray-400'
                      }
                    `}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </div>
                    <div className="text-center flex items-center flex-col">
                      <p
                        className={`text-sm font-medium ${
                          isCurrent
                            ? 'text-blue-600'
                            : isCompleted
                              ? 'text-green-600'
                              : 'text-gray-500'
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <div className="min-h-[600px]">
        <StepComponent />
      </div>
    </div>
  );
};
