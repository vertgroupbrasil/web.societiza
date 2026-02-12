'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  CorporateFormData,
  FORM_STEPS,
  FormState,
  OpeningForm,
  defaultCompanyData,
} from '@form/index';

interface FormContextValue extends FormState {
  updateStepData: (stepData: Partial<CorporateFormData>) => void;
  updateFromApiResponse: (response: OpeningForm) => void;
  goToStep: (step: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  canNavigateToStep: (step: number) => boolean;
  processoId: string;
  isDataLoaded: boolean;
  createdFormId: string | null;
  setCreatedFormId: (formId: string | null) => void;
  setIsSubmitting: (submitting: boolean) => void;
}

interface FormAction {
  type:
    | 'UPDATE_STEP_DATA'
    | 'SET_CURRENT_STEP'
    | 'RESTORE_STATE'
    | 'UPDATE_FROM_API'
    | 'SET_DATA_LOADED';
  payload: any;
}

const FormContext = createContext<FormContextValue | null>(null);

// --- Reducer ---
const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'UPDATE_STEP_DATA':
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    case 'RESTORE_STATE':
      return {
        ...state,
        formData: action.payload.formData,
        currentStep: action.payload.currentStep,
      };
    case 'UPDATE_FROM_API':
      return { ...state, formData: action.payload };
    case 'SET_DATA_LOADED':
      return { ...state, isDataLoaded: action.payload };
    default:
      return state;
  }
};

// ✅ Estado inicial sempre igual no server e client
const getInitialState = (
  processoId: string,
): FormState & { isDataLoaded: boolean } => ({
  currentStep: 0,
  formData: {
    companyData: { ...defaultCompanyData, processo_id: processoId },
  },
  isSubmitting: false,
  isCompleted: false,
  errors: {},
  isDataLoaded: false,
});

interface FormProviderProps {
  children: ReactNode;
  processoId: string;
  initialStep?: number;
}

export const FormProvider = ({
  children,
  processoId,
  initialStep = 0,
}: FormProviderProps) => {
  const [state, dispatch] = useReducer(
    formReducer,
    getInitialState(processoId),
  );
  const [hasMounted, setHasMounted] = useState(false);
  const [createdFormId, setCreatedFormId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const STORAGE_KEY = `form_draft_${processoId}`;

  // ✅ PASSO 1: Marcar como montado
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // ✅ PASSO 2: Carregar localStorage após montagem
  useEffect(() => {
    if (!hasMounted) return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsedState = JSON.parse(saved);

        const formDataWithId = {
          ...parsedState.formData,
          companyData: {
            ...parsedState.formData?.companyData,
            processo_id: processoId,
          },
        };

        dispatch({
          type: 'RESTORE_STATE',
          payload: { ...parsedState, formData: formDataWithId },
        });
      }
    } finally {
      // ✅ IMPORTANTE: Sempre marcar como carregado, independente de ter dados ou não
      dispatch({ type: 'SET_DATA_LOADED', payload: true });
    }
  }, [hasMounted, processoId, STORAGE_KEY]);

  // ✅ PASSO 3: Auto-save CORRIGIDO
  useEffect(() => {
    if (!hasMounted || !state.isDataLoaded) {
      return;
    }

    // ✅ CORREÇÃO: Salvar se há dados significativos
    const companyDataKeys = Object.keys(state.formData.companyData || {});
    const hasSignificantData = companyDataKeys.length > 2; // Mais que processo_id + 1 campo preenchido

    if (!hasSignificantData) {
      return;
    }

    const dataToSave = {
      formData: state.formData,
      currentStep: state.currentStep,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));

    // ✅ Verificação: Confirmar que foi salvo
    setTimeout(() => {
      localStorage.getItem(STORAGE_KEY);
    }, 100);
  }, [
    state.formData,
    state.currentStep,
    hasMounted,
    state.isDataLoaded,
    STORAGE_KEY,
  ]);

  const updateStepData = useCallback((stepData: Partial<CorporateFormData>) => {
    dispatch({ type: 'UPDATE_STEP_DATA', payload: stepData });
  }, []);

  // ✅ validateStepData - Valida os dados de um step específico
  const validateStepData = useCallback(
    (stepIndex: number): boolean => {
      if (stepIndex < 0 || stepIndex >= FORM_STEPS.length) {
        return false;
      }

      const step = FORM_STEPS[stepIndex];

      switch (step.id) {
        case 'company':
          return validateCompanyData(state.formData.companyData);
        case 'partners':
          return validatePartnersData(state.formData.partnersData);
        case 'review':
          return (
            validateCompanyData(state.formData.companyData) &&
            validatePartnersData(state.formData.partnersData)
          );
        default:
          return true;
      }
    },
    [state.formData],
  );

  // ✅ canNavigateToStep - Verifica se pode navegar para um step específico
  const canNavigateToStep = useCallback(
    (targetStep: number): boolean => {
      // Não pode navegar para steps inválidos
      if (targetStep < 0 || targetStep >= FORM_STEPS.length) {
        return false;
      }

      // Sempre pode voltar para steps anteriores
      if (targetStep <= state.currentStep) {
        return true;
      }

      // Para avançar, precisa validar todos os steps anteriores
      for (let i = 0; i < targetStep; i++) {
        if (!validateStepData(i)) {
          return false;
        }
      }

      return true;
    },
    [state.currentStep, validateStepData],
  );

  // ✅ goToStep - Navega para um step específico
  const goToStep = useCallback(
    (targetStep: number) => {
      if (!canNavigateToStep(targetStep)) {
        return;
      }

      dispatch({ type: 'SET_CURRENT_STEP', payload: targetStep });

      // Atualiza a URL se necessário
      const step = FORM_STEPS[targetStep];
      if (step && step.path) {
        router.push(`/forms/${processoId}/fill?step=${step.path}`);
      }
    },
    [canNavigateToStep, processoId, router],
  );

  const updateFromApiResponse = useCallback(
    (response: OpeningForm) => {
      try {
        const formData = response.formulario;

        const extractedData: CorporateFormData = {
          companyData: {
            processo_id: processoId, // Usar o processoId do contexto/props
            opcoes_nome_empresa: formData.opcoes_nome_empresa || [],
            nome_fantasia: formData.nome_fantasia || '',
            endereco: {
              rua: formData.endereco?.rua || '',
              numero: formData.endereco?.numero || 0,
              bairro: formData.endereco?.bairro || '',
              cep: formData.endereco?.cep || '',
              municipio: formData.endereco?.municipio || '',
              uf: formData.endereco?.uf || '',
              complemento: formData.endereco?.complemento || '',
            },
            inscricao_imob: formData.inscricao_imob || '',
            telefone: formData.telefone || '',
            email: formData.email || '',
            val_capital_social: Number(formData.val_capital_social) || 0,
            capital_integralizado: formData.capital_integralizado || false,
            data_integralizacao: formData.data_integralizacao || '',
            empresa_anexa_resid: formData.empresa_anexa_resid || false,
            endereco_apenas_contato: formData.endereco_apenas_contato || false,
            area_empresa: Number(formData.area_empresa) || 0,
            info_adicionais: {
              resp_tecnica: formData.info_adicionais?.resp_tecnica || false,
              uf: formData.info_adicionais?.uf || '',
              nome_responsavel:
                formData.info_adicionais?.nome_responsavel || '',
              nmr_carteira_profissional:
                formData.info_adicionais?.nmr_carteira_profissional || '',
              area_resp: formData.info_adicionais?.area_resp || '',
            },
            // ✅ ID do formulário vem da API
            id: formData.id,
            created_at: formData.created_at,
            updated_at: formData.updated_at,
          },
          partnersData:
            formData.socios && formData.socios.length > 0
              ? {
                  socios: formData.socios.map((socio) => ({
                    nome: socio.nome || '',
                    nacionalidade: socio.nacionalidade || 'Brasileira',
                    data_nascimento: socio.data_nascimento || '',
                    estado_civil: socio.estado_civil || 'solteiro',
                    regime_casamento: socio.regime_casamento,
                    profissao: socio.profissao || '',
                    cpf: socio.cpf || '',
                    rg: socio.rg || '',
                    orgao_expedidor: socio.orgao_expedidor || '',
                    uf: socio.uf || '',
                    administrador: socio.administrador || false,
                    tipo_administrador: socio.tipo_administrador,
                    qtd_cotas: socio.qtd_cotas || 0,
                    endereco: socio.endereco || {
                      rua: '',
                      numero: 0,
                      bairro: '',
                      cep: '',
                      municipio: '',
                      uf: '',
                      complemento: '',
                    },
                  })),
                  // ✅ Usar ID do formulário da API, não processo_id
                  empresa_id: formData.id || processoId, // Fallback para processoId se não houver id
                }
              : undefined,
        };

        // ✅ Atualizar createdFormId se vier da API
        if (formData.id) {
          setCreatedFormId(formData.id);
        }

        dispatch({ type: 'UPDATE_FROM_API', payload: extractedData });
      } catch (error) {
        // Handle error silently
      }
    },
    [processoId, setCreatedFormId], // ✅ Adicionar setCreatedFormId às dependências
  );

  // ✅ Funções auxiliares de validação
  const validateCompanyData = (companyData?: any): boolean => {
    if (!companyData) return false;

    const requiredFields = [
      'nome_fantasia',
      'email',
      'telefone',
      'endereco.rua',
      'endereco.numero',
      'endereco.bairro',
      'endereco.cep',
      'endereco.municipio',
      'endereco.uf',
      'inscricao_imob',
      'val_capital_social',
      'area_empresa',
    ];

    return requiredFields.every((field) => {
      const fieldPath = field.split('.');
      let value = companyData;

      for (const path of fieldPath) {
        value = value?.[path];
      }

      return value !== undefined && value !== null && value !== '';
    });
  };

  const validatePartnersData = (partnersData?: any): boolean => {
    if (
      !partnersData ||
      !partnersData.socios ||
      partnersData.socios.length === 0
    ) {
      return false;
    }

    const totalParticipacao = partnersData.socios.reduce(
      (total: number, socio: any) => total + (Number(socio.participacao) || 0),
      0,
    );

    // Verifica se a participação total é 100%
    if (Math.abs(totalParticipacao - 100) > 0.01) {
      return false;
    }

    // Valida cada sócio
    return partnersData.socios.every((socio: any) => {
      const requiredFields = ['nome', 'cpf', 'data_nascimento', 'participacao'];

      return requiredFields.every((field) => {
        const value = socio[field];
        return value !== undefined && value !== null && value !== '';
      });
    });
  };

  const handleSetIsSubmitting = useCallback((submitting: boolean) => {
    setIsSubmitting(submitting);
  }, []);

  // ✅ Funções de navegação auxiliares
  const goToNextStep = useCallback(() => {
    const nextStep = state.currentStep + 1;
    if (nextStep < FORM_STEPS.length) {
      goToStep(nextStep);
    }
  }, [state.currentStep, goToStep]);

  const goToPreviousStep = useCallback(() => {
    const prevStep = state.currentStep - 1;
    if (prevStep >= 0) {
      goToStep(prevStep);
    }
  }, [state.currentStep, goToStep]);

  const contextValue: FormContextValue = {
    ...state,
    updateStepData,
    updateFromApiResponse,
    goToStep,
    goToPreviousStep,
    goToNextStep,
    canNavigateToStep,
    processoId,
    isDataLoaded: state.isDataLoaded,
    createdFormId,
    setCreatedFormId,
    isSubmitting,
    setIsSubmitting: handleSetIsSubmitting,
  };

  if (!hasMounted || !state.isDataLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="ml-4">
          {!hasMounted
            ? 'Carregando aplicação...'
            : 'Carregando dados salvos...'}
        </p>
      </div>
    );
  }

  return (
    <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within FormProvider');
  }
  return context;
};
