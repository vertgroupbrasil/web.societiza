'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from 'react';
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  PaginationState,
} from '@tanstack/react-table';

// ===== TYPES =====
export interface CorporateTableState {
  columnFilters: ColumnFiltersState;
  globalFilter: string;
  sorting: SortingState;
  columnVisibility: VisibilityState;
  pagination: PaginationState;
}

// ===== ACTIONS =====
export type CorporateTableAction =
  | { type: 'SET_COLUMN_FILTERS'; payload: ColumnFiltersState }
  | { type: 'SET_GLOBAL_FILTER'; payload: string }
  | { type: 'SET_SORTING'; payload: SortingState }
  | { type: 'SET_COLUMN_VISIBILITY'; payload: VisibilityState }
  | { type: 'SET_PAGINATION'; payload: PaginationState }
  | { type: 'RESET_TABLE_FILTERS' };

// ===== INITIAL STATE =====
const initialState: CorporateTableState = {
  columnFilters: [],
  globalFilter: '',
  sorting: [],
  columnVisibility: {},
  pagination: {
    pageIndex: 0,
    pageSize: 10,
  },
};

// ===== REDUCER =====
const corporateTableReducer = (
  state: CorporateTableState,
  action: CorporateTableAction,
): CorporateTableState => {
  switch (action.type) {
    case 'SET_COLUMN_FILTERS':
      return {
        ...state,
        columnFilters: action.payload,
      };

    case 'SET_GLOBAL_FILTER':
      return {
        ...state,
        globalFilter: action.payload,
      };

    case 'SET_SORTING':
      return {
        ...state,
        sorting: action.payload,
      };

    case 'SET_COLUMN_VISIBILITY':
      return {
        ...state,
        columnVisibility: action.payload,
      };

    case 'SET_PAGINATION':
      return {
        ...state,
        pagination: action.payload,
      };

    case 'RESET_TABLE_FILTERS':
      return {
        ...state,
        columnFilters: [],
        globalFilter: '',
        sorting: [],
      };

    default:
      return state;
  }
};

// ===== CONTEXT TYPE =====
export interface CorporateTableContextType {
  // State
  state: CorporateTableState;

  // Properties
  tableState: CorporateTableState;
  columnFilters: ColumnFiltersState;
  globalFilter: string;
  sorting: SortingState;
  columnVisibility: VisibilityState;
  pagination: PaginationState;

  // Functions
  setColumnFilters: (filters: ColumnFiltersState) => void;
  setGlobalFilter: (filter: string) => void;
  setSorting: (sorting: SortingState) => void;
  setColumnVisibility: (visibility: VisibilityState) => void;
  setPagination: (pagination: PaginationState) => void;
  resetTableFilters: () => void;

  // Alias Functions (for backward compatibility)
  setFilters: (filters: ColumnFiltersState) => void;
  resetFilter: (columnId: string) => void;
}

// ===== CONTEXT =====
const CorporateTableContext = createContext<
  CorporateTableContextType | undefined
>(undefined);

// ===== PROVIDER =====
export const CorporateTableProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(corporateTableReducer, initialState);

  // ===== FUNCTIONS =====
  const setColumnFilters = useCallback((filters: ColumnFiltersState) => {
    dispatch({ type: 'SET_COLUMN_FILTERS', payload: filters });
  }, []);

  const setGlobalFilter = useCallback((filter: string) => {
    dispatch({ type: 'SET_GLOBAL_FILTER', payload: filter });
  }, []);

  const setSorting = useCallback((sorting: SortingState) => {
    dispatch({ type: 'SET_SORTING', payload: sorting });
  }, []);

  const setColumnVisibility = useCallback((visibility: VisibilityState) => {
    dispatch({ type: 'SET_COLUMN_VISIBILITY', payload: visibility });
  }, []);

  const setPagination = useCallback((pagination: PaginationState) => {
    dispatch({ type: 'SET_PAGINATION', payload: pagination });
  }, []);

  const resetTableFilters = useCallback(() => {
    dispatch({ type: 'RESET_TABLE_FILTERS' });
  }, []);

  // ===== ALIAS FUNCTIONS =====
  const setFilters = useCallback(
    (filters: ColumnFiltersState) => {
      setColumnFilters(filters);
    },
    [setColumnFilters],
  );

  const resetFilter = useCallback(
    (columnId: string) => {
      const newFilters = state.columnFilters.filter(
        (filter) => filter.id !== columnId,
      );
      setColumnFilters(newFilters);
    },
    [state.columnFilters, setColumnFilters],
  );

  // ===== CONTEXT VALUE =====
  const contextValue: CorporateTableContextType = useMemo(
    () => ({
      // State
      state,

      // Properties
      tableState: state,
      columnFilters: state.columnFilters,
      globalFilter: state.globalFilter,
      sorting: state.sorting,
      columnVisibility: state.columnVisibility,
      pagination: state.pagination,

      // Functions
      setColumnFilters,
      setGlobalFilter,
      setSorting,
      setColumnVisibility,
      setPagination,
      resetTableFilters,

      // Alias Functions
      setFilters,
      resetFilter,
    }),
    [
      state,
      setColumnFilters,
      setGlobalFilter,
      setSorting,
      setColumnVisibility,
      setPagination,
      resetTableFilters,
      setFilters,
      resetFilter,
    ],
  );

  return (
    <CorporateTableContext.Provider value={contextValue}>
      {children}
    </CorporateTableContext.Provider>
  );
};

// ===== HOOK =====
export const useCorporateTableContext = (): CorporateTableContextType => {
  const context = useContext(CorporateTableContext);
  if (!context) {
    throw new Error(
      'useCorporateTable must be used within a CorporateTableProvider',
    );
  }
  return context;
};
