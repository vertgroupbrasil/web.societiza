'use client';

import { Board, CorporateProvider } from '@workflow/index';

export default function CorporateWorkflowPage() {
  return (
    <div className="h-full w-full">
      <CorporateProvider>
        <Board />
      </CorporateProvider>
    </div>
  );
}
