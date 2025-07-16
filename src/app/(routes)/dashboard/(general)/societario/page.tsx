'use client';
import { Board, CorporateProvider } from '@corporate/index';

export default function CorporatePage() {
  return (
    <div className="h-full w-full">
      <CorporateProvider>
        <Board />
      </CorporateProvider>
    </div>
  );
}
