'use client';

import * as React from 'react';
import { useQueryState, parseAsInteger } from 'nuqs';
import { DataTable } from '@societiza/components/data-table/data-table';
import { useDataTable } from '@societiza/hooks/use-data-table';

import { useAccountancies } from '../hooks/queries/useAccountancyQueries';
import { makeAccountancyColumns } from './columns';
import { AccountancyFormDialog } from './accountancy-form-dialog';
import type { AccountancyDetail } from '../schemas/accountancy.schema';

export function DataTableDemo() {
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const { data, isLoading, isError } = useAccountancies(page, perPage);

  const columns = React.useMemo(() => makeAccountancyColumns(), []);

  const items = data?.items ?? [];
  const totalPages = data?.page.totalPages ?? 0;
  const totalCount = data?.page.totalCount ?? 0;

  const { table } = useDataTable<AccountancyDetail>({
    data: items,
    columns,
    pageCount: totalPages > 0 ? totalPages : 1,
    initialState: {
      columnPinning: { right: ['actions'] },
    },
    getRowId: (row) => row.id,
  });

  return (
    <div className="data-table-container space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isLoading
            ? 'Carregando…'
            : `${totalCount} contabilidade${totalCount === 1 ? '' : 's'} cadastrada${totalCount === 1 ? '' : 's'}`}
        </p>
        <AccountancyFormDialog />
      </div>

      {isError ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive">
          Não foi possível carregar a listagem. Tente novamente em instantes.
        </div>
      ) : !isLoading && totalCount === 0 ? (
        <div className="rounded-md border border-dashed p-10 text-center">
          <p className="text-sm font-medium">Nenhuma contabilidade cadastrada</p>
          <p className="text-xs text-muted-foreground mt-1">
            Cadastre a primeira contabilidade para iniciar o provisionamento.
          </p>
        </div>
      ) : (
        <DataTable table={table} />
      )}
    </div>
  );
}
