'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
} from '@shadcn/index';
import { ChevronsUpDown, Plus, Check } from 'lucide-react';
import { cn } from '@societiza/lib/utils';
import { PlanBadge } from './PlanBadge';
import type { Office } from '../../schemas/office.schema';

interface OfficeSwitcherProps {
  offices: Office[];
  activeOfficeId: string;
  onSwitch: (officeId: string) => void;
  onCreateOffice?: () => void;
  isSwitching?: boolean;
}

function getOfficeInitials(office: Office): string {
  const name = office.tradeName ?? office.legalName;
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export function OfficeSwitcher({
  offices,
  activeOfficeId,
  onSwitch,
  onCreateOffice,
  isSwitching = false,
}: OfficeSwitcherProps) {
  const activeOffice = offices.find((o) => o.id === activeOfficeId);

  if (!activeOffice) return null;

  const displayName = activeOffice.tradeName ?? activeOffice.legalName;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between px-2 py-1.5 h-auto hover:bg-sidebar-accent"
          disabled={isSwitching}
          aria-label="Trocar escritório"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="h-7 w-7 rounded-md shrink-0">
              <AvatarImage
                src={activeOffice.profilePhotoUrl ?? undefined}
                alt={displayName}
              />
              <AvatarFallback className="rounded-md text-xs font-semibold">
                {getOfficeInitials(activeOffice)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start min-w-0">
              <span className="text-sm font-semibold truncate leading-none">
                {displayName}
              </span>
              <span className="text-xs text-muted-foreground leading-none mt-0.5">
                {activeOffice.plan === 'Free' ? 'Plano Grátis' : `Plano ${activeOffice.plan}`}
              </span>
            </div>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
          Seus escritórios
        </DropdownMenuLabel>

        {offices.map((office) => {
          const name = office.tradeName ?? office.legalName;
          const isActive = office.id === activeOfficeId;

          return (
            <DropdownMenuItem
              key={office.id}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => !isActive && onSwitch(office.id)}
            >
              <Avatar className="h-6 w-6 rounded-md shrink-0">
                <AvatarImage
                  src={office.profilePhotoUrl ?? undefined}
                  alt={name}
                />
                <AvatarFallback className="rounded-md text-xs font-medium">
                  {getOfficeInitials(office)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0 flex-1">
                <span
                  className={cn(
                    'text-sm truncate leading-none',
                    isActive && 'font-medium',
                  )}
                >
                  {name}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <PlanBadge plan={office.plan} size="sm" />
                {isActive && (
                  <Check className="h-3.5 w-3.5 text-primary" />
                )}
              </div>
            </DropdownMenuItem>
          );
        })}

        {onCreateOffice && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer text-muted-foreground"
              onClick={onCreateOffice}
            >
              <div className="h-6 w-6 rounded-md border-2 border-dashed border-muted-foreground/30 flex items-center justify-center shrink-0">
                <Plus className="h-3 w-3" />
              </div>
              <span className="text-sm">Novo escritório</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
