'use client';

import { usePathname } from 'next/navigation';

import { AppSidebar } from '@societiza/components/ui/shadcnui/app-sidebar';
import { SettingsSidebar } from '@societiza/components/ui/shadcnui/settings-sidebar';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@societiza/components/ui/shadcnui/sidebar';
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
        <header className="flex h-12 shrink-0 items-center gap-2 px-3">
          <SidebarTrigger />
          <div className="min-w-0 flex-1">
            <DashboardBreadcrumbs />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
