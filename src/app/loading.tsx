'use client';
import { Spinner } from '@societiza/components/ui/kiboui/spinner';
export default function LoadingPage() {
  return (
    <main className="flex justify-center items-center h-screen">
      <Spinner />
    </main>
  );
}
