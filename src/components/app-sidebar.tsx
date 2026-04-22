'use client';

import * as React from 'react';
import {
  LayoutDashboard,
  MonitorCheck,
  Building2,
  FileCheck2,
  ShieldCheck,
  FileSignature,
  Settings,
  Users,
  CreditCard,
  HelpCircle,
  SlidersHorizontal,
} from 'lucide-react';

import { NavMain, type NavSection } from '@societiza/components/nav-main';
import { NavUser } from '@societiza/components/nav-user';
import { TeamSwitcher } from '@societiza/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from '@societiza/components/ui/sidebar';
import { useCurrentUser } from '@societiza/hooks/useCurrentUser';

// ── Navegação da Societiza ────────────────────────────────────────────────────

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Geral',
    items: [
      { title: 'Painel de controle', url: '/dashboard', icon: LayoutDashboard },
      { title: 'Gerenciamento', url: '/dashboard/gerenciamento', icon: MonitorCheck },
      { title: 'Societário', url: '/dashboard/societario', icon: Building2 },
      { title: 'Alvarás', url: '/dashboard/alvaras', icon: FileCheck2 },
      { title: 'Certificados digitais', url: '/dashboard/certificados-digitais', icon: ShieldCheck },
      { title: 'Contratos', url: '/dashboard/contratos', icon: FileSignature },
    ],
  },
  {
    title: 'Escritório',
    items: [
      { title: 'Configurações', url: '/dashboard/escritorio/configuracoes', icon: Settings },
      { title: 'Membros', url: '/dashboard/escritorio/membros', icon: Users },
      { title: 'Plano', url: '/dashboard/escritorio/plano', icon: CreditCard },
    ],
  },
  {
    title: 'Suporte',
    items: [
      { title: 'Preferências', url: '/dashboard/configuracoes', icon: SlidersHorizontal },
      { title: 'Ajuda', url: '/dashboard/ajuda', icon: HelpCircle },
    ],
  },
];

// ── Sidebar ───────────────────────────────────────────────────────────────────

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const currentUser = useCurrentUser();

  // Fallback enquanto o token não está disponível (ex: primeiro render SSR)
  const user = currentUser ?? {
    name: 'Usuário',
    email: '',
    initials: 'U',
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* ── Header: escritório / team switcher ── */}
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      {/* ── Navegação principal ── */}
      <SidebarContent>
        <NavMain sections={NAV_SECTIONS} />
      </SidebarContent>

      <SidebarSeparator />

      {/* ── Footer: usuário logado ── */}
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
