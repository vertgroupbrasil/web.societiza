'use client';
import { Board, CorporateProvider } from '@workflow/index';

export default function CorporatePage() {
  return (
    <div className="h-full w-full">
      <CorporateProvider>
        <Board />
      </CorporateProvider>
    </div>
  );
}
