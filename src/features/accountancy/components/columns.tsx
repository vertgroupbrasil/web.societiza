import { DataTableColumnHeader } from '@societiza/components/data-table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import React from 'react';
import type { AccountancyDetail } from '../schemas/accountancy.schema';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@societiza/components/ui/shadcnui/dropdown-menu';
import { Button } from '@societiza/components/ui/shadcnui/button';
import { AccountancyFormDialog } from './accountancy-form-dialog';
import { CreateAccountancyAdminInvitationDialog } from '@societiza/features/identity-invitations/components/CreateAccountancyAdminInvitationDialog';
import {
  displayCEP,
  displayCNPJ,
  displayPhone,
  formatDateTimeBR,
} from '../lib/accountancy.formatters';

export function makeAccountancyColumns(): ColumnDef<AccountancyDetail>[] {
  return [
    {
      id: 'legalName',
      accessorKey: 'legalName',
      header: ({ column }: { column: Column<AccountancyDetail, unknown> }) => (
        <DataTableColumnHeader column={column} title="Razão Social" />
      ),
      cell: ({ cell }) => (
        <div className="font-medium">
          {cell.getValue<AccountancyDetail['legalName']>()}
        </div>
      ),
      meta: { label: 'Razão Social' },
      enableSorting: false,
    },
    {
      id: 'tradeName',
      accessorKey: 'tradeName',
      header: 'Nome Fantasia',
      cell: ({ cell }) => {
        const value = cell.getValue<AccountancyDetail['tradeName']>();
        return (
          <div>{value ?? <span className="text-muted-foreground">—</span>}</div>
        );
      },
      meta: { label: 'Nome Fantasia' },
      enableSorting: false,
    },
    {
      id: 'cnpj',
      accessorKey: 'cnpj',
      header: 'CNPJ',
      cell: ({ cell }) => (
        <div className="font-mono text-sm">
          {displayCNPJ(cell.getValue<string>())}
        </div>
      ),
      meta: { label: 'CNPJ' },
      enableSorting: false,
    },
    {
      id: 'location',
      header: 'Cidade/UF',
      cell: ({ row }) => (
        <div>
          {row.original.city}
          {row.original.city && row.original.state ? ', ' : ''}
          {row.original.state}
        </div>
      ),
      meta: { label: 'Cidade/UF' },
      enableSorting: false,
    },
    {
      id: 'phone',
      accessorKey: 'phone',
      header: 'Telefone',
      cell: ({ cell }) => (
        <div className="font-mono text-sm">
          {displayPhone(cell.getValue<string>())}
        </div>
      ),
      meta: { label: 'Telefone' },
      enableSorting: false,
    },
    {
      id: 'postalCode',
      accessorKey: 'postalCode',
      header: 'CEP',
      cell: ({ cell }) => (
        <div className="font-mono text-sm">
          {displayCEP(cell.getValue<string>())}
        </div>
      ),
      meta: { label: 'CEP' },
      enableSorting: false,
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: 'Criado em',
      cell: ({ cell }) => (
        <div className="text-sm text-muted-foreground">
          {formatDateTimeBR(cell.getValue<Date>())}
        </div>
      ),
      meta: { label: 'Criado em' },
      enableSorting: false,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const accountancy = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <AccountancyFormDialog
                accountancy={accountancy}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Editar
                  </DropdownMenuItem>
                }
              />
              <CreateAccountancyAdminInvitationDialog
                accountancyId={accountancy.id}
                accountancyName={accountancy.tradeName ?? accountancy.legalName}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Gerar link de administrador
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 32,
    },
  ];
}
