'use client';

import { useState, useEffect } from 'react';
import { Button } from '@shadcn/index';
import { toast } from 'sonner';
import { Send, ArrowLeft } from 'lucide-react';

import {
  useOpeningForm,
  useReviewFormValidation,
  CompanyReviewSection,
  PartnersReviewSection,
  FinishDialog,
} from '@form/index';

export const ReviewDataForm = () => {
  const {
    formData,
    submitFinalForm,
    isSubmittingFinalForm,
    goToPreviousStep,
    goToStep,
  } = useOpeningForm();

  const [hasValidated, setHasValidated] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const {
    validationErrors,
    validateAllData,
    getTotalQuotas,
    getAdministrators,
    isDataComplete,
  } = useReviewFormValidation({
    companyData: formData.companyData,
    partnersData: formData.partnersData,
  });

  const totalQuotas = getTotalQuotas();
  const administrators = getAdministrators();
  const hasCompanyErrors = validationErrors.some(
    (error) => error.includes('empresa') || error.includes('Empresa'),
  );
  const hasPartnersErrors = validationErrors.some((error) =>
    error.includes('Sócio'),
  );

  useEffect(() => {
    const performInitialValidation = async () => {
      if (isDataComplete && !hasValidated) {
        await validateAllData();
        setHasValidated(true);
      }
    };

    performInitialValidation();
  }, [isDataComplete, hasValidated, validateAllData]);

  const handleSubmitClick = async () => {
    if (!isDataComplete) {
      toast.error('Complete todos os dados antes de enviar');
      return;
    }

    const validation = await validateAllData();

    if (!validation.isValid) {
      toast.error(
        `Encontramos ${validation.errors.length} erro(s). Corrija-os antes de enviar.`,
      );
      return;
    }

    // ✅ Abrir dialog de confirmação
    setShowConfirmDialog(true);
  };

  // ✅ Handler para quando o usuário confirma no dialog
  const handleConfirmSubmit = async () => {
    try {
      await submitFinalForm();
      toast.success('Formulário enviado com sucesso! Redirecionando...');
      // O dialog será fechado automaticamente quando isSubmittingFinalForm mudar
    } catch (error) {
      toast.error('Erro ao enviar formulário. Tente novamente.');
      console.error('Submit error:', error);
    } finally {
      setShowConfirmDialog(false);
    }
  };

  // ✅ Handler para controlar abertura/fechamento do dialog
  const handleDialogOpenChange = (open: boolean) => {
    // Só permite fechar se não estiver enviando
    if (!isSubmittingFinalForm) {
      setShowConfirmDialog(open);
    }
  };

  const canSubmit =
    isDataComplete &&
    validationErrors.length === 0 &&
    hasValidated &&
    !isSubmittingFinalForm;

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Revisão Final do Formulário</h1>
        <p className="text-gray-600">
          Revise todos os dados antes de enviar. Você pode editar qualquer seção
          clicando no botão "Editar".
        </p>
      </div>

      {/* Seção da Empresa */}
      <CompanyReviewSection
        companyData={formData.companyData}
        onEdit={() => goToStep(0)}
        hasErrors={hasCompanyErrors}
      />

      {/* Seção dos Sócios */}
      <PartnersReviewSection
        partnersData={formData.partnersData}
        onEdit={() => goToStep(1)}
        hasErrors={hasPartnersErrors}
        totalQuotas={totalQuotas}
        administrators={administrators}
      />

      {/* Dialog de Confirmação */}
      <FinishDialog
        open={showConfirmDialog}
        onOpenChange={handleDialogOpenChange}
        onConfirm={handleConfirmSubmit}
        isLoading={isSubmittingFinalForm}
      />

      {/* Navegação */}
      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          onClick={goToPreviousStep}
          disabled={isSubmittingFinalForm}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="flex items-center space-x-4">
          {!canSubmit && (
            <p className="text-sm text-gray-500">
              {!isDataComplete &&
                'Complete todos os dados para habilitar o envio'}
              {isDataComplete &&
                validationErrors.length > 0 &&
                'Corrija os erros para habilitar o envio'}
              {isDataComplete &&
                validationErrors.length === 0 &&
                !hasValidated &&
                'Validando dados...'}
            </p>
          )}

          <Button
            type="button"
            onClick={handleSubmitClick}
            disabled={!canSubmit}
          >
            {isSubmittingFinalForm ? (
              'Enviando...'
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Finalizar e Enviar
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
