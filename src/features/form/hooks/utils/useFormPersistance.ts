'use client';

import { useEffect, useCallback } from 'react';
import { FormState } from '@form/index';

type FormDispatch = React.Dispatch<{ type: string; payload: any }>;

export const useFormPersistence = (
  state: FormState,
  dispatch: FormDispatch,
  processoId: string,
) => {
  const STORAGE_KEY = `form_draft_${processoId}`;

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedState = JSON.parse(saved);
        dispatch({ type: 'RESTORE_STATE', payload: parsedState });
      }
    } catch (error) {
      console.warn('Failed to restore form state from localStorage:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [processoId, STORAGE_KEY, dispatch]);

  // Save to localStorage on state change
  useEffect(() => {
    if (Object.keys(state.formData).length > 0) {
      try {
        const stateToSave = {
          ...state,
          lastSaved: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (error) {
        console.warn('Failed to save form state to localStorage:', error);
      }
    }
  }, [state, STORAGE_KEY]);

  // Clear localStorage on successful submission
  const clearPersistedState = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear persisted state:', error);
    }
  }, [STORAGE_KEY]);

  return { clearPersistedState };
};
