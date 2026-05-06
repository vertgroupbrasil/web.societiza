'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  Building2,
  CreditCard,
  SlidersHorizontal,
  User,
  Users,
} from 'lucide-react';

import { NavUser } from '@societiza/components/nav-user';
import { TeamSwitcher } from '@societiza/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@societiza/components/ui/shadcnui/sidebar';
import { useCurrentUser } from '@societiza/hooks/useCurrentUser';
import { useMyProfile } from '@societiza/features/identity-users/hooks/queries/useIdentityUserQueries';
import { getUserFullName } from '@societiza/features/identity-users/schemas/identity-user.schema';

type SettingsNavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

type SettingsNavSection = {
  title: string;
  items: SettingsNavItem[];
};

const SETTINGS_SECTIONS: SettingsNavSection[] = [
  {
    title: 'Conta',
    items: [
      {
        title: 'Perfil',
        url: '/dashboard/configuracoes/perfil',
        icon: User,
      },
      {
        title: 'Preferências',
        url: '/dashboard/configuracoes/preferencias',
        icon: SlidersHorizontal,
      },
    ],
  },
  {
    title: 'Escritório',
    items: [
      {
        title: 'Configuração do escritório',
        url: '/dashboard/configuracoes/escritorio',
        icon: Building2,
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
  },
];

function isSettingsItemActive(pathname: string, url: string) {
  const cleanUrl = url.replace(/\/$/, '');
  return pathname === cleanUrl || pathname.startsWith(`${cleanUrl}/`);
}

export function SettingsSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const currentUser = useCurrentUser();
  const { data: profile } = useMyProfile(!!currentUser);
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

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Voltar para o app">
                <Link href="/dashboard">
                  <ArrowLeft />
                  <span>Voltar para o app</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        {SETTINGS_SECTIONS.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isSettingsItemActive(pathname, item.url)}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
