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
} from '@flowtec/components/ui/shadcnui/sidebar';
import {
  TrendingUpIcon,
  type TrendingUpIconHandle,
} from '../icons/trending-up';
import { CctvIcon } from '../icons/cctv';
import { IdCardIcon } from '../icons/id-card';
import { ScanTextIcon } from '../icons/scan-text';
import { ClipboardCheckIcon } from '../icons/clipboard-check';
import { CircleHelpIcon } from '../icons/circle-help';
import { SettingsGearIcon } from '../icons/settings-gear';
import { FilePenLineIcon } from '../icons/file-pen-line';
import Logo from '@flowtec/components/logo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeSwitcher } from '../kiboui/theme-switcher';
import React from 'react';
import Logout from '@flowtec/features/auth/components/ui/logout-button';

type NavItem = {
  title: string;
  url: string;
  icon: any;
};

type Section = {
  title: string;
  items: NavItem[];
};

// Estrutura de dados atualizada com seções
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
    {
      title: 'Suporte',
      items: [
        {
          title: 'Configurações',
          icon: SettingsGearIcon,
          url: '/dashboard/configuracoes/',
        },
        {
          title: 'Ajuda',
          icon: CircleHelpIcon,
          url: '/dashboard/ajuda/',
        },
      ],
    },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const iconRefs = React.useRef<Record<string, TrendingUpIconHandle | null>>(
    {},
  );

  // Function to check if a menu item is active
  const isItemActive = (itemUrl: string) => {
    // Exact match for root dashboard
    if (itemUrl === '/dashboard/' && pathname === '/dashboard') {
      return true;
    }
    // For other routes, check if pathname starts with the item URL
    if (
      itemUrl !== '/dashboard/' &&
      pathname.startsWith(itemUrl.replace(/\/$/, ''))
    ) {
      return true;
    }
    return false;
  };

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader className="p-6 !pb-2">
        <Link href="/" className="flex">
          <Logo />
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
                    // handlers no container inteiro
                    onMouseEnter={() =>
                      iconRefs.current[item.title]?.startAnimation?.()
                    }
                    onMouseLeave={() =>
                      iconRefs.current[item.title]?.stopAnimation?.()
                    }
                  >
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link
                        href={item.url}
                        className="flex items-center gap-2 font-medium"
                      >
                        <ItemIcon
                          size={20}
                          className="inline-flex items-center justify-center"
                          // registra a instância na iconRefs
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
        <div className="p-2 flex items-center justify-center">
          <ThemeSwitcher />
        </div>
        <div className="w-full">
          <Logout />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
