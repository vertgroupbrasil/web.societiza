'use client';

import * as React from 'react';
import Image from 'next/image';
import { Building2, ChevronsUpDown, UserPlus } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@societiza/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@societiza/components/ui/shadcnui/sidebar';
import { Skeleton } from '@societiza/components/ui/shadcnui/skeleton';
import { useOffices } from '@societiza/features/accountancy-offices/hooks/queries/useOfficeQueries';
import { useSetActiveOffice } from '@societiza/features/accountancy-offices/hooks/mutations/useOfficeMutations';
import {
  PLAN_COLORS,
  PLAN_LABELS,
} from '@societiza/features/accountancy-offices/constants/plans.constants';
import { InvitePeopleDialog } from '@societiza/features/accountancy-offices/components/InvitePeopleDialog';
import type { Office } from '@societiza/features/accountancy-offices/schemas/office.schema';
import { useCurrentUser } from '@societiza/hooks/useCurrentUser';
import { useMyProfile } from '@societiza/features/identity-users/hooks/queries/useIdentityUserQueries';

function officeInitials(office: Office): string {
  const name = office.tradeName ?? office.legalName;
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function OfficeLogo({ office }: { office: Office }) {
  const initials = officeInitials(office);
  const colors = PLAN_COLORS[office.plan];

  if (office.profilePhotoUrl) {
    return (
      <Image
        src={office.profilePhotoUrl}
        alt={office.tradeName ?? office.legalName}
        width={32}
        height={32}
        className="size-full object-cover rounded-md"
      />
    );
  }

  return (
    <span
      className="text-[10px] font-bold leading-none"
      style={{ color: colors.text }}
    >
      {initials}
    </span>
  );
}

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const currentUser = useCurrentUser();
  const { data: profile } = useMyProfile(!!currentUser);
  const { data: offices, isLoading, isError } = useOffices();
  const setActiveOffice = useSetActiveOffice();
  const [activeOfficeId, setActiveOfficeId] = React.useState<string>();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [inviteOpen, setInviteOpen] = React.useState(false);

  const activeOffice =
    offices?.find((o) => o.id === activeOfficeId) ?? offices?.[0];

  React.useEffect(() => {
    if (!activeOfficeId && offices?.[0]) {
      setActiveOfficeId(offices[0].id);
    }
  }, [activeOfficeId, offices]);

  const handleSwitch = (officeId: string) => {
    setActiveOfficeId(officeId);
    setActiveOffice.mutate(officeId);
  };

  const canInviteForActiveOffice =
    profile?.role === 'AccountancyAdmin' &&
    profile.accountancyId === activeOffice?.id;

  const handleOpenInvite = () => {
    setDropdownOpen(false);
    window.setTimeout(() => setInviteOpen(true), 0);
  };

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <Skeleton className="size-8 rounded-lg" />
            <div className="grid flex-1 gap-1">
              <Skeleton className="h-3 w-24 rounded" />
              <Skeleton className="h-2.5 w-16 rounded" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (isError || !offices || !activeOffice) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg border bg-muted">
              <Building2 className="size-4 text-muted-foreground" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                Escritório indisponível
              </span>
              <span className="truncate text-xs text-muted-foreground">
                Dados não carregados
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                {/* Avatar do escritório ativo */}
                <div
                  className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden shrink-0"
                  style={{
                    background: PLAN_COLORS[activeOffice.plan].bg,
                    border: `1px solid ${PLAN_COLORS[activeOffice.plan].border}`,
                  }}
                >
                  <OfficeLogo office={activeOffice} />
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeOffice.tradeName ?? activeOffice.legalName}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Plano {PLAN_LABELS[activeOffice.plan]}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? 'bottom' : 'right'}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Escritórios
              </DropdownMenuLabel>

              {offices.map((office) => {
                const isActive = office.id === activeOfficeId;
                return (
                  <DropdownMenuItem
                    key={office.id}
                    onClick={() => handleSwitch(office.id)}
                    className="gap-2 p-2"
                  >
                    <div
                      className="flex size-6 items-center justify-center rounded-md overflow-hidden shrink-0"
                      style={{
                        background: PLAN_COLORS[office.plan].bg,
                        border: `1px solid ${PLAN_COLORS[office.plan].border}`,
                      }}
                    >
                      <OfficeLogo office={office} />
                    </div>
                    <span className="flex-1 truncate">
                      {office.tradeName ?? office.legalName}
                    </span>
                    {isActive && (
                      <span className="size-1.5 rounded-full bg-primary shrink-0" />
                    )}
                  </DropdownMenuItem>
                );
              })}

              {canInviteForActiveOffice ? (
                <>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="gap-2 p-2 text-muted-foreground"
                    onSelect={(event) => {
                      event.preventDefault();
                      handleOpenInvite();
                    }}
                  >
                    <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                      <UserPlus />
                    </div>
                    Convidar pessoas
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <InvitePeopleDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        officeId={activeOffice.id}
        officeName={activeOffice.tradeName ?? activeOffice.legalName}
      />
    </>
  );
}
