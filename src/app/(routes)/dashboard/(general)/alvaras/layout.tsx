import React from 'react';
import type { Metadata } from 'next';
import '@societiza/app/globals.css';

export const metadata: Metadata = {
  title: 'Societiza - Alvarás',
  description: 'O futuro contábil em uma plataforma só.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main>{children}</main>;
}
