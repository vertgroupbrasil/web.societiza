'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from 'react';

import { Process } from '@corporate/index';

// ===== TYPES =====
export interface CorporateUIState {
  selectedProcessId: string | null; // ✅ Apenas ID
  drawerOpen: boolean;
  alertDialogOpen: boolean;
  pendingStageAdvance: Process | null;
}

// ===== ACTIONS =====
export type CorporateUIAction =
  | { type: 'SET_SELECTED_PROCESS_ID'; payload: string | null }
  | { type: 'SET_DRAWER_OPEN'; payload: boolean }
  | { type: 'SET_ALERT_DIALOG'; payload: boolean }
  | { type: 'SET_PENDING_STAGE_ADVANCE'; payload: Process | null }
  | { type: 'CLOSE_DRAWER' }
  | { type: 'FETCH_AND_SELECT_PROCESS'; payload: string };

// ===== INITIAL STATE =====
const initialState: CorporateUIState = {
  selectedProcessId: null, // ✅ Inicializado como null
  drawerOpen: false,
  alertDialogOpen: false,
  pendingStageAdvance: null,
};

// ===== REDUCER =====
const corporateUIReducer = (
  state: CorporateUIState,
  action: CorporateUIAction,
): CorporateUIState => {
  switch (action.type) {
    case 'SET_SELECTED_PROCESS_ID':
      return {
        ...state,
        selectedProcessId: action.payload,
      };

    case 'CLOSE_DRAWER':
      return {
        ...state,
        selectedProcessId: null, // ✅ Limpa o ID também
        drawerOpen: false,
        alertDialogOpen: false,
        pendingStageAdvance: null,
      };

    case 'SET_DRAWER_OPEN':
      return {
        ...state,
        drawerOpen: action.payload,
        ...(action.payload === false && {
          selectedProcessId: null, // ✅ Limpa o ID quando fecha drawer
          alertDialogOpen: false,
          pendingStageAdvance: null,
        }),
      };

    case 'SET_ALERT_DIALOG':
      return {
        ...state,
        alertDialogOpen: action.payload,
      };

    case 'SET_PENDING_STAGE_ADVANCE':
      return {
        ...state,
        pendingStageAdvance: action.payload,
      };

    case 'FETCH_AND_SELECT_PROCESS':
      return {
        ...state,
        selectedProcessId: action.payload,
        drawerOpen: true,
      };

    default:
      return state;
  }
};

// ===== CONTEXT TYPE =====
export interface CorporateUIContextType {
  // State
  state: CorporateUIState;

  // Properties
  selectedProcessId: string | null; // ✅ Adicionado na interface
  drawerOpen: boolean;
  alertDialogOpen: boolean;
  pendingStageAdvance: Process | null;

  // Functions
  setSelectedProcessId: (id: string | null) => void; // ✅ Adicionado
  fetchAndSelectProcess: (processId: string) => void; // ✅ Adicionado
  setDrawerOpen: (open: boolean) => void;
  setAlertDialogOpen: (open: boolean) => void;
  setPendingStageAdvance: (process: Process | null) => void;
  closeProcessDrawer: () => void;
}

// ===== CONTEXT =====
const CorporateUIContext = createContext<CorporateUIContextType | undefined>(
  undefined,
);

// ===== PROVIDER =====
export const CorporateUIProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(corporateUIReducer, initialState);

  // ===== FUNCTIONS =====
  const setSelectedProcessId = useCallback((id: string | null) => {
    dispatch({ type: 'SET_SELECTED_PROCESS_ID', payload: id });
  }, []);

  const setDrawerOpen = useCallback((open: boolean) => {
    dispatch({ type: 'SET_DRAWER_OPEN', payload: open });
  }, []);

  const setAlertDialogOpen = useCallback((open: boolean) => {
    dispatch({ type: 'SET_ALERT_DIALOG', payload: open });
  }, []);

  const setPendingStageAdvance = useCallback((process: Process | null) => {
    dispatch({ type: 'SET_PENDING_STAGE_ADVANCE', payload: process });
  }, []);

  const closeProcessDrawer = useCallback(() => {
    dispatch({ type: 'CLOSE_DRAWER' });
  }, []);

  // ✅ Função principal para buscar e selecionar processo
  const fetchAndSelectProcess = useCallback((processId: string) => {
    dispatch({ type: 'FETCH_AND_SELECT_PROCESS', payload: processId });
  }, []);

  // ===== CONTEXT VALUE =====
  const contextValue: CorporateUIContextType = useMemo(
    () => ({
      // State
      state,

      // Properties
      selectedProcessId: state.selectedProcessId, // ✅ Agora está na interface
      drawerOpen: state.drawerOpen,
      alertDialogOpen: state.alertDialogOpen,
      pendingStageAdvance: state.pendingStageAdvance,

      // Functions
      setSelectedProcessId, // ✅ Adicionado
      fetchAndSelectProcess, // ✅ Agora está na interface
      setDrawerOpen,
      setAlertDialogOpen,
      setPendingStageAdvance,
      closeProcessDrawer,
    }),
    [
      state,
      setSelectedProcessId,
      fetchAndSelectProcess,
      setDrawerOpen,
      setAlertDialogOpen,
      setPendingStageAdvance,
      closeProcessDrawer,
    ],
  );

  return (
    <CorporateUIContext.Provider value={contextValue}>
      {children}
    </CorporateUIContext.Provider>
  );
};

// ===== HOOK =====
export const useCorporateUIContext = (): CorporateUIContextType => {
  const context = useContext(CorporateUIContext);
  if (!context) {
    throw new Error('useCorporateUI must be used within a CorporateUIProvider');
  }
  return context;
};
