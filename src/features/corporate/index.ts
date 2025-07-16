// ====== COMPONENTES PRINCIPAIS ======
export * from './components/Board';
export * from './components/Column';
export * from './components/Card';
export * from './components/CorporateDrawer';

// ====== COMPONENTES UI ======
export * from './components/ui/ProgressBar';
export * from './components/ui/TaskItem';
export * from './components/ui/SearchBar';
export * from './components/ui/FiltersDialog';
// Note: FiltersDialog is missing 'ptBR' import from 'date-fns/locale'
export * from './components/ui/TaskChecklist';
export * from './components/forms/new-process-form';
export * from './components/forms/edit-process-form';

// ====== HOOKS DE QUERIES ======
export * from './hooks/queries/useCorporateQueries';

// Aliases for backward compatibility with component imports
export * from './hooks/queries/useCorporateQueries';
export * from './hooks/queries/useCorporateQueries';
export * from './hooks/queries/useCorporateQueries';

// ====== HOOKS DE MUTATIONS ======
export * from './hooks/mutations/useCorporateMutations';

export * from './hooks/forms/useProcessForm';
export * from './hooks/forms/useEditProcessForm';
// ====== HOOKS UTILITÁRIOS ======

export * from './hooks/utils/useTaskSequentialLogic';

export * from './hooks/utils/useCorporateFilters';
export * from './hooks/utils/useDebounce';

// ====== QUERY OPTIONS ======
export * from './hooks/queries/query-options';

// ====== SERVICES ======
export * from './server/services/corporate.service';

// ====== TIPOS DO SERVER ======
export * from './server/types/corporate.types';

// ====== SCHEMAS & TIPOS ======
export * from './schemas/process.schema';

export * from './schemas/stage.schema';

export * from './schemas/utils.schema';

// ====== CONSTANTES ======
export * from './constants/corporate.constants';

// Aliases for backward compatibility

export * from './contexts/ui/CorporateUIContext';
export * from './contexts/filters/CorporateFilterContext';
export * from './contexts/table/CorporateTableContext';
export * from './contexts/CorporateProvider';

export * from './utils/corporate.utils';
