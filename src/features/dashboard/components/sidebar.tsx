import { AppSidebar } from "@flowtec/components/ui/shadcnui/app-sidebar";
import { Separator } from "@flowtec/components/ui/shadcnui/separator";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@flowtec/components/ui/shadcnui/sidebar";


export default function Sidebar({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
