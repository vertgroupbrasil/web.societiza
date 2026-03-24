'use client';

import React from 'react';
import {
  CorporateFiltersProvider,
  CorporateTableProvider,
  CorporateUIProvider,
} from '@workflow/contexts/index';

export const CorporateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <CorporateUIProvider>
      <CorporateFiltersProvider>
        <CorporateTableProvider>{children}</CorporateTableProvider>
      </CorporateFiltersProvider>
    </CorporateUIProvider>
  );
};

export default CorporateProvider;
