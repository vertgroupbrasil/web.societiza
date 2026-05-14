'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from 'react';

// Types
interface CorporateFiltersState {
  searchTerm: string;
  processType: string;
  urgency: string;
  accounting: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  isFiltering: boolean;
}

type CorporateFiltersAction =
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_PROCESS_TYPE'; payload: string }
  | { type: 'SET_URGENCY'; payload: string }
  | { type: 'SET_ACCOUNTING'; payload: string }
  | {
      type: 'SET_DATE_RANGE';
      payload: { start: Date | null; end: Date | null };
    }
  | {
      type: 'SET_BUSINESS_FILTER';
      payload: { key: keyof CorporateFiltersState; value: any };
    }
  | { type: 'REMOVE_BUSINESS_FILTER'; payload: keyof CorporateFiltersState }
  | { type: 'RESET_BUSINESS_FILTERS' }
  | { type: 'SET_IS_FILTERING'; payload: boolean };

// Initial State
const initialState: CorporateFiltersState = {
  searchTerm: '',
  processType: '',
  urgency: '',
  accounting: '',
  dateRange: {
    start: null,
    end: null,
  },
  isFiltering: false,
};

// Reducer
const filtersReducer = (
  state: CorporateFiltersState,
  action: CorporateFiltersAction,
): CorporateFiltersState => {
  switch (action.type) {
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };

    case 'SET_PROCESS_TYPE':
      return { ...state, processType: action.payload };

    case 'SET_URGENCY':
      return { ...state, urgency: action.payload };

    case 'SET_ACCOUNTING':
      return { ...state, accounting: action.payload };

    case 'SET_DATE_RANGE':
      return { ...state, dateRange: action.payload };

    case 'SET_BUSINESS_FILTER':
      return { ...state, [action.payload.key]: action.payload.value };

    case 'REMOVE_BUSINESS_FILTER':
      const newState = { ...state };
      if (action.payload === 'dateRange') {
        newState.dateRange = { start: null, end: null };
      } else {
        (newState as any)[action.payload] = '';
      }
      return newState;

    case 'RESET_BUSINESS_FILTERS':
      return {
        ...initialState,
        isFiltering: state.isFiltering,
      };

    case 'SET_IS_FILTERING':
      return { ...state, isFiltering: action.payload };

    default:
      return state;
  }
};

// Context
interface CorporateFiltersContextType {
  filters: CorporateFiltersState;
  isFiltering: boolean;
  hasActiveFilters: boolean;
  activeFiltersCount: number;
  setSearchTerm: (term: string) => void;
  setProcessType: (type: string) => void;
  setUrgency: (urgency: string) => void;
  setAccounting: (accounting: string) => void;
  setDateRange: (range: { start: Date | null; end: Date | null }) => void;
  setBusinessFilter: (key: keyof CorporateFiltersState, value: any) => void;
  removeBusinessFilter: (key: keyof CorporateFiltersState) => void;
  resetBusinessFilters: () => void;
  setIsFiltering: (isFiltering: boolean) => void;
  applyFilters: (data: any[]) => any[];
  getActiveFiltersLabels: () => Array<{
    key: string;
    label: string;
    value: string;
  }>;
}

const CorporateFiltersContext = createContext<
  CorporateFiltersContextType | undefined
>(undefined);

// Provider
export const CorporateFiltersProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(filtersReducer, initialState);

  const setSearchTerm = useCallback((term: string) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  }, []);

  const setProcessType = useCallback((type: string) => {
    dispatch({ type: 'SET_PROCESS_TYPE', payload: type });
  }, []);

  const setUrgency = useCallback((urgency: string) => {
    dispatch({ type: 'SET_URGENCY', payload: urgency });
  }, []);

  const setAccounting = useCallback((accounting: string) => {
    dispatch({ type: 'SET_ACCOUNTING', payload: accounting });
  }, []);

  const setDateRange = useCallback(
    (range: { start: Date | null; end: Date | null }) => {
      dispatch({ type: 'SET_DATE_RANGE', payload: range });
    },
    [],
  );

  const setBusinessFilter = useCallback(
    (key: keyof CorporateFiltersState, value: any) => {
      dispatch({ type: 'SET_BUSINESS_FILTER', payload: { key, value } });
    },
    [],
  );

  const removeBusinessFilter = useCallback(
    (key: keyof CorporateFiltersState) => {
      dispatch({ type: 'REMOVE_BUSINESS_FILTER', payload: key });
    },
    [],
  );

  const resetBusinessFilters = useCallback(() => {
    dispatch({ type: 'RESET_BUSINESS_FILTERS' });
  }, []);

  const setIsFiltering = useCallback((isFiltering: boolean) => {
    dispatch({ type: 'SET_IS_FILTERING', payload: isFiltering });
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      state.searchTerm !== '' ||
      state.processType !== '' ||
      state.urgency !== '' ||
      state.accounting !== '' ||
      state.dateRange.start !== null ||
      state.dateRange.end !== null
    );
  }, [state]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (state.searchTerm !== '') count++;
    if (state.processType !== '') count++;
    if (state.urgency !== '') count++;
    if (state.accounting !== '') count++;
    if (state.dateRange.start !== null || state.dateRange.end !== null) count++;
    return count;
  }, [state]);

  // CORREÇÃO PRINCIPAL: Função applyFilters corrigida
  const applyFilters = useCallback(
    (data: any[]) => {
      if (!data || !Array.isArray(data)) return [];

      return data.filter((item) => {
        // Filtro de busca
        if (state.searchTerm) {
          const searchLower = state.searchTerm.toLowerCase();
          const matchesSearch =
            item.nome?.toLowerCase().includes(searchLower) ||
            item.contabilidade?.nome?.toLowerCase().includes(searchLower);
          if (!matchesSearch) return false;
        }

        // CORREÇÃO: Filtro de tipo de processo
        if (state.processType && state.processType !== '') {
          const processTypeMap: { [key: string]: string } = {
            abertura: 'Abertura de empresa',
            alteracao_com_regin: 'Alteração contratual com regin',
            alteracao_sem_regin_baixa: 'Alteração contratual sem regin/baixa ',
          };

          const expectedType =
            processTypeMap[state.processType] || state.processType;
          if (item.tipo_processo?.descricao !== expectedType) return false;
        }

        // CORREÇÃO: Filtro de urgência
        if (state.urgency && state.urgency !== '') {
          const calculateUrgency = (expireDate: Date) => {
            const now = new Date();
            const expire = new Date(expireDate);
            const diffTime = expire.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 0) return 'critical';
            if (diffDays <= 7) return 'urgent';
            if (diffDays <= 15) return 'warning';
            return 'normal';
          };

          const itemUrgency = calculateUrgency(item.expire_at);
          if (itemUrgency !== state.urgency) return false;
        }

        // Filtro de contabilidade
        if (state.accounting && state.accounting !== '' && item.contabilidade?.id !== state.accounting) {
          return false;
        }

        // Filtro de data
        if (state.dateRange.start || state.dateRange.end) {
          const itemDate = new Date(item.created_at);

          if (state.dateRange.start) {
            const startDate = new Date(state.dateRange.start);
            if (itemDate < startDate) return false;
          }

          if (state.dateRange.end) {
            const endDate = new Date(state.dateRange.end);
            if (itemDate > endDate) return false;
          }
        }

        return true;
      });
    },
    [state],
  );

  const getActiveFiltersLabels = useCallback(() => {
    const labels: Array<{ key: string; label: string; value: string }> = [];

    if (state.searchTerm) {
      labels.push({
        key: 'searchTerm',
        label: 'Busca',
        value: state.searchTerm,
      });
    }

    if (state.processType) {
      const typeLabels: { [key: string]: string } = {
        abertura: 'Abertura de empresa',
        alteracao_com_regin: 'Alteração contratual com regin',
        alteracao_sem_regin_baixa: 'Alteração contratual sem regin/baixa ',
      };
      labels.push({
        key: 'processType',
        label: 'Tipo',
        value: typeLabels[state.processType] || state.processType,
      });
    }

    if (state.urgency) {
      const urgencyLabels: { [key: string]: string } = {
        normal: 'Normal',
        warning: 'Atenção',
        urgent: 'Urgente',
        critical: 'Crítico',
      };
      labels.push({
        key: 'urgency',
        label: 'Urgência',
        value: urgencyLabels[state.urgency] || state.urgency,
      });
    }

    if (state.accounting) {
      labels.push({
        key: 'accounting',
        label: 'Contabilidade',
        value: state.accounting,
      });
    }

    if (state.dateRange.start || state.dateRange.end) {
      const startStr = state.dateRange.start?.toLocaleDateString('pt-BR') || '';
      const endStr = state.dateRange.end?.toLocaleDateString('pt-BR') || '';
      labels.push({
        key: 'dateRange',
        label: 'Período',
        value: `${startStr} - ${endStr}`,
      });
    }

    return labels;
  }, [state]);

  const contextValue = useMemo(
    () => ({
      filters: state,
      isFiltering: state.isFiltering,
      hasActiveFilters,
      activeFiltersCount,
      setSearchTerm,
      setProcessType,
      setUrgency,
      setAccounting,
      setDateRange,
      setBusinessFilter,
      removeBusinessFilter,
      resetBusinessFilters,
      setIsFiltering,
      applyFilters,
      getActiveFiltersLabels,
    }),
    [
      state,
      hasActiveFilters,
      activeFiltersCount,
      setSearchTerm,
      setProcessType,
      setUrgency,
      setAccounting,
      setDateRange,
      setBusinessFilter,
      removeBusinessFilter,
      resetBusinessFilters,
      setIsFiltering,
      applyFilters,
      getActiveFiltersLabels,
    ],
  );

  return (
    <CorporateFiltersContext.Provider value={contextValue}>
      {children}
    </CorporateFiltersContext.Provider>
  );
};

export const useCorporateFiltersContext = (): CorporateFiltersContextType => {
  const context = useContext(CorporateFiltersContext);
  if (!context) {
    throw new Error(
      'useCorporateFilters must be used within a CorporateFiltersProvider',
    );
  }
  return context;
};
