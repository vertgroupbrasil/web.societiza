import React from 'react';
import type { Metadata } from 'next';
import '@societiza/app/globals.css';
import Sidebar from '@societiza/features/dashboard/components/sidebar';

export const metadata: Metadata = {
  title: 'Societiza - Dashboard',
  description: 'O futuro contábil em uma plataforma só.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Remover overflow-hidden do main para permitir scroll horizontal controlado
    <main className="h-screen w-screen">
      <div className="h-full w-full">
        <Sidebar>{children}</Sidebar>
      </div>
    </main>
  );
}
