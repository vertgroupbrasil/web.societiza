import { DataTableColumnHeader } from '@societiza/components/data-table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Trash2Icon } from 'lucide-react';
import React from 'react';
import type { Accountancy } from '../schemas/accountancy.schema';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@societiza/components/ui/shadcnui/dropdown-menu';
import { Button } from '@societiza/components/ui/shadcnui/button';
import { AccountancyFormDialog } from './accountancy-form-dialog';

export function makeAccountancyColumns(
  openDeleteModal: (
    id: string,
    identifier: string,
    text: string,
    isOpen: boolean,
  ) => void,
): ColumnDef<Accountancy>[] {
  return [
    {
      id: 'legalName',
      accessorKey: 'legalName',
      header: ({ column }: { column: Column<Accountancy, unknown> }) => (
        <DataTableColumnHeader column={column} title="Razão Social" />
      ),
      cell: ({ cell }) => (
        <div className="font-medium">
          {cell.getValue<Accountancy['legalName']>()}
        </div>
      ),
      meta: {
        label: 'Razão Social',
        placeholder: 'Buscar razão social...',
        variant: 'text',
      },
      enableColumnFilter: true,
    },
    {
      id: 'tradeName',
      accessorKey: 'tradeName',
      header: ({ column }: { column: Column<Accountancy, unknown> }) => (
        <DataTableColumnHeader column={column} title="Nome Fantasia" />
      ),
      cell: ({ cell }) => {
        const value = cell.getValue<Accountancy['tradeName']>();
        return (
          <div>{value ?? <span className="text-muted-foreground">—</span>}</div>
        );
      },
      meta: {
        label: 'Nome Fantasia',
        placeholder: 'Buscar nome fantasia...',
        variant: 'text',
      },
      enableColumnFilter: true,
    },
    {
      id: 'cnpj',
      accessorKey: 'cnpj',
      header: ({ column }: { column: Column<Accountancy, unknown> }) => (
        <DataTableColumnHeader column={column} title="CNPJ" />
      ),
      cell: ({ cell }) => (
        <div className="text-sm tabular-nums">
          {cell.getValue<Accountancy['cnpj']>()}
        </div>
      ),
      meta: { label: 'CNPJ' },
    },
    {
      id: 'location',
      header: 'Localização',
      cell: ({ row }) => (
        <div>
          {row.original.city}
          {row.original.city && row.original.state ? ', ' : ''}
          {row.original.state}
        </div>
      ),
      meta: { label: 'Cidade/UF' },
    },
    {
      id: 'actions',
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
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  openDeleteModal(
                    accountancy.id,
                    accountancy.legalName,
                    'contabilidade',
                    true,
                  );
                }}
              >
                <Trash2Icon />
                Deletar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 32,
    },
  ];
}
