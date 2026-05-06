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
import { useMyProfile } from '@societiza/features/identity-users/hooks/queries/useIdentityUserQueries';
import { getUserFullName } from '@societiza/features/identity-users/schemas/identity-user.schema';

// ── Navegação da Societiza ────────────────────────────────────────────────────

type Role = 'SystemAdmin' | 'AccountancyAdmin' | 'AccountancyEmployee';

function buildNavSections(role: Role | undefined): NavSection[] {
  const isSystemAdmin = role === 'SystemAdmin';
  const isOfficeUser =
    role === 'AccountancyAdmin' || role === 'AccountancyEmployee';

  const generalItems = [
    { title: 'Painel de controle', url: '/dashboard', icon: LayoutDashboard },
    { title: 'Societário', url: '/dashboard/societario', icon: Building2 },
    { title: 'Alvarás', url: '/dashboard/alvaras', icon: FileCheck2 },
    {
      title: 'Certificados digitais',
      url: '/dashboard/certificados-digitais',
      icon: ShieldCheck,
    },
    { title: 'Contratos', url: '/dashboard/contratos', icon: FileSignature },
  ];

  const sections: NavSection[] = [{ title: 'Geral', items: generalItems }];

  if (isSystemAdmin) {
    sections.push({
      title: 'Admin',
      items: [
        {
          title: 'Admin',
          url: '/dashboard/admin',
          icon: MonitorCheck,
        },
      ],
    });
  }

  // Seção "Escritório" (Minha Contabilidade + membros + plano) é para os
  // perfis vinculados a uma contabilidade. SystemAdmin não tem accountancy_id
  // e não acessa /me — então não vê esta seção.
  if (isOfficeUser) {
    sections.push({
      title: 'Escritório',
      items: [
        {
          title: 'Configurações',
          url: '/dashboard/configuracoes/escritorio',
          icon: Settings,
        },
        {
          title: 'Membros',
          url: '/dashboard/configuracoes/membros',
          icon: Users,
        },
        {
          title: 'Plano',
          url: '/dashboard/configuracoes/plano',
          icon: CreditCard,
        },
      ],
    });
  }

  sections.push({
    title: 'Suporte',
    items: [
      {
        title: 'Preferências',
        url: '/dashboard/configuracoes/preferencias',
        icon: SlidersHorizontal,
      },
      { title: 'Ajuda', url: '/dashboard/ajuda', icon: HelpCircle },
    ],
  });

  return sections;
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const currentUser = useCurrentUser();
  const { data: profile } = useMyProfile(!!currentUser);

  // Fallback enquanto o token não está disponível (ex: primeiro render SSR)
  const user = profile
    ? {
        name: getUserFullName(profile),
        email: profile.email,
        initials: `${profile.firstName[0] ?? ''}${profile.lastName[0] ?? ''}`,
      }
    : (currentUser ?? {
        name: 'Usuário',
        email: '',
        initials: 'U',
      });

  const navSections = React.useMemo(
    () => buildNavSections(profile?.role ?? currentUser?.role),
    [currentUser?.role, profile?.role],
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* ── Header: escritório / team switcher ── */}
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      {/* ── Navegação principal ── */}
      <SidebarContent>
        <NavMain sections={navSections} />
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
