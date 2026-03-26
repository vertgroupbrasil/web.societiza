'use client';

import * as React from 'react';
import { useQueryState, parseAsString } from 'nuqs';
import { DataTable } from '@societiza/components/data-table/data-table';
import { DataTableToolbar } from '@societiza/components/data-table/data-table-toolbar';
import { useDataTable } from '@societiza/hooks/use-data-table';
import { DeleteModal } from '@societiza/components/delete-modal';
import { handleFormError } from '@societiza/handlers/error';
import { toast } from 'sonner';

import { useAccountancies } from '../hooks/queries/useAccountancyQueries';
import { useDeleteAccountancy } from '../hooks/mutations/useAccountancyMutations';
import { makeAccountancyColumns } from './columns';
import { AccountancyFormDialog } from './accountancy-form-dialog';
import type { Accountancy } from '../schemas/accountancy.schema';

export function DataTableDemo() {
  const [, setGlobalError] = React.useState<string | undefined>();
  const [search] = useQueryState('legalName', parseAsString.withDefault(''));

  const { data: accountancies = [] } = useAccountancies();
  const deleteAccountancy = useDeleteAccountancy();

  const [deleteModal, setDeleteModal] = React.useState<{
    isOpen?: boolean;
    id: string;
    identifier: string;
    text: string;
  } | null>(null);

  const handleOpenDeleteModal = React.useCallback(
    (id: string, identifier: string, text: string, isOpen: boolean) => {
      setDeleteModal({ id, identifier, text, isOpen });
    },
    [],
  );

  const columns = React.useMemo(
    () => makeAccountancyColumns(handleOpenDeleteModal),
    [handleOpenDeleteModal],
  );

  const filteredData = React.useMemo(() => {
    if (!search) return accountancies;
    const q = search.toLowerCase();
    return accountancies.filter(
      (a) =>
        a.legalName.toLowerCase().includes(q) ||
        (a.tradeName?.toLowerCase().includes(q) ?? false),
    );
  }, [accountancies, search]);

  const { table } = useDataTable({
    data: filteredData,
    columns,
    pageCount: 1,
    initialState: {
      sorting: [{ id: 'legalName', desc: false }],
      columnPinning: { right: ['actions'] },
    },
    getRowId: (row: Accountancy) => row.id,
  });

  const handleDelete = async () => {
    if (!deleteModal) return;
    const { id, identifier } = deleteModal;
    setGlobalError(undefined);

    try {
      await deleteAccountancy.mutateAsync(id);
      toast.success('Exclusão feita com sucesso!', {
        description: `${identifier} foi removida.`,
      });
      setDeleteModal(null);
    } catch (error) {
      const parsed = handleFormError<Accountancy>(error, setGlobalError);
      toast.error('Ops! Erro ao excluir.', {
        description:
          parsed.globalError ?? 'Algo deu errado durante a exclusão.',
      });
    }
  };

  const handleCloseModal = React.useCallback(() => {
    setDeleteModal(null);
  }, []);

  return (
    <div className="data-table-container">
      <div className="flex items-center justify-between mb-4">
        <div />
        <AccountancyFormDialog />
      </div>

      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>

      {deleteModal?.isOpen && (
        <DeleteModal
          isOpen={true}
          identifier={deleteModal.identifier}
          text="Tem certeza que deseja prosseguir com essa ação? Ela não pode ser desfeita, você estará excluindo "
          onDelete={handleDelete}
          onClose={handleCloseModal}
          isLoading={deleteAccountancy.isPending}
        />
      )}
    </div>
  );
}
