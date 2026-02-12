import React from 'react';
import type { Metadata } from 'next';
import '@flowtec/app/globals.css';
import Sidebar from '@flowtec/features/dashboard/components/sidebar';

export const metadata: Metadata = {
  title: 'meu societário - Dashboard',
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
        <Sidebar children={children} />
      </div>
    </main>
  );
}
