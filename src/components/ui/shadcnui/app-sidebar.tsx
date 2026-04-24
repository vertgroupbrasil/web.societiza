'use client';

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
} from '@societiza/components/ui/shadcnui/sidebar';
import {
  TrendingUpIcon,
  type TrendingUpIconHandle,
} from '../icons/trending-up';
import { CctvIcon } from '../icons/cctv';
import { IdCardIcon } from '../icons/id-card';
import { ScanTextIcon } from '../icons/scan-text';
import { ClipboardCheckIcon } from '../icons/clipboard-check';
import { FilePenLineIcon } from '../icons/file-pen-line';
import LogoOrange from '@societiza/components/logo-orange';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { TeamSwitcher } from '@societiza/components/team-switcher';
import { NavUser } from '@societiza/components/nav-user';
import { useCurrentUser } from '@societiza/hooks/useCurrentUser';

type NavItem = {
  title: string;
  url: string;
  icon: any;
};

type Section = {
  title: string;
  items: NavItem[];
};

const data: { sections: Section[] } = {
  sections: [
    {
      title: 'Geral',
      items: [
        {
          title: 'Painel de controle',
          icon: TrendingUpIcon,
          url: '/dashboard/',
        },
        {
          title: 'Gerenciamento',
          icon: CctvIcon,
          url: '/dashboard/gerenciamento/',
        },
        {
          title: 'Societário',
          icon: IdCardIcon,
          url: '/dashboard/societario',
        },
        {
          title: 'Alvarás',
          icon: ClipboardCheckIcon,
          url: '/dashboard/alvaras/',
        },
        {
          title: 'Certificados digitais',
          icon: ScanTextIcon,
          url: '/dashboard/certificados-digitais/',
        },
        {
          title: 'Contratos',
          icon: FilePenLineIcon,
          url: '/dashboard/contratos/',
        },
      ],
    },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const iconRefs = React.useRef<Record<string, TrendingUpIconHandle | null>>({});
  const currentUser = useCurrentUser();

  const user = currentUser ?? {
    name: 'Usuário',
    email: '',
    initials: 'U',
  };

  const isItemActive = (itemUrl: string) => {
    if (itemUrl === '/dashboard/' && pathname === '/dashboard') return true;
    if (itemUrl !== '/dashboard/' && pathname.startsWith(itemUrl.replace(/\/$/, ''))) return true;
    return false;
  };

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader className="p-6 !pb-2">
        <Link href="/" className="flex">
          <LogoOrange />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {data.sections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarMenu className="gap-2">
              {section.items.map((item) => {
                const ItemIcon = item.icon as React.ForwardRefExoticComponent<
                  React.RefAttributes<TrendingUpIconHandle> & any
                >;
                const isActive = isItemActive(item.url);

                return (
                  <SidebarMenuItem
                    key={item.title}
                    onMouseEnter={() => iconRefs.current[item.title]?.startAnimation?.()}
                    onMouseLeave={() => iconRefs.current[item.title]?.stopAnimation?.()}
                  >
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url} className="flex items-center gap-2 font-medium">
                        <ItemIcon
                          size={20}
                          className="inline-flex items-center justify-center"
                          ref={(el: TrendingUpIconHandle | null) => {
                            iconRefs.current[item.title] = el;
                          }}
                        />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <TeamSwitcher />
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
