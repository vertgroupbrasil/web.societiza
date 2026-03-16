import { AppSidebar } from '@societiza/components/ui/shadcnui/app-sidebar';

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@societiza/components/ui/shadcnui/sidebar';

export default function Sidebar({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '19rem',
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <SidebarTrigger className="-ml-1" />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
