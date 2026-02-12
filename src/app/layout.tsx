import React from 'react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { QueryProvider } from '@flowtec/providers/query-provider';
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@flowtec/components/ui/shadcnui';

export const metadata: Metadata = {
  title: 'meu societário',
  description: 'O futuro contábil em uma plataforma só.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <NuqsAdapter>
        <html lang="pt-BR" suppressHydrationWarning>
          <body className={`antialiased`}>
            <NextTopLoader
              color="#007BFF"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              easing="ease"
              speed={200}
            />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider>{children}</TooltipProvider>
              <Toaster
                richColors
                position="top-center"
                toastOptions={{
                  classNames: {
                    toast: 'toast',
                    description: 'text-white',
                  },
                }}
              />
            </ThemeProvider>
          </body>
        </html>
        <ReactQueryDevtools initialIsOpen={false} />
      </NuqsAdapter>
    </QueryProvider>
  );
}
