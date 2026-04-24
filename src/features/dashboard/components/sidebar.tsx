'use client';

import { usePathname } from 'next/navigation';

import { AppSidebar } from '@societiza/components/ui/shadcnui/app-sidebar';
import { SettingsSidebar } from '@societiza/components/ui/shadcnui/settings-sidebar';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@societiza/components/ui/shadcnui/sidebar';
import { Separator } from '@societiza/components/ui/shadcnui/separator';
import { DashboardBreadcrumbs } from './dashboard-breadcrumbs';

export default function Sidebar({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isSettingsArea = pathname.startsWith('/dashboard/configuracoes');

  return (
    <SidebarProvider
      style={
        isSettingsArea
          ? ({ '--sidebar-width': '18rem' } as React.CSSProperties)
          : undefined
      }
    >
      {isSettingsArea ? <SettingsSidebar /> : <AppSidebar />}
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <div className="min-w-0 flex-1">
            <DashboardBreadcrumbs />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
