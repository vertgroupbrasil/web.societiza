import React from 'react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import type { Metadata } from 'next';
import { Funnel_Sans } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { QueryProvider } from '@societiza/providers/query-provider';
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@societiza/components/ui/shadcnui';

const funnelSans = Funnel_Sans({
  subsets: ['latin'],
  variable: '--font-funnel-sans',
});

export const metadata: Metadata = {
  title: 'Societiza',
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
          <body className={`${funnelSans.variable} antialiased font-sans`}>
            <NextTopLoader
              color="#FF5500"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              shadow={false}
              crawl={true}
              easing="ease"
              speed={200}
            />
            <ThemeProvider
              attribute="class"
              forcedTheme="light"
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
