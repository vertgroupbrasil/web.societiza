'use client';

import * as React from 'react';
import { useQueryState, parseAsString, parseAsArrayOf } from 'nuqs';
import { DataTable } from '@flowtec/components/data-table/data-table';
import { DataTableToolbar } from '@flowtec/components/data-table/data-table-toolbar';
import { useDataTable } from '@flowtec/hooks/use-data-table';
import { toast } from 'sonner';

import { useManagement } from '../hooks/queries/useManagementQueries';
import { useManagementMutations } from '../hooks/mutations/useManagementMutations';
import { makeManagementColumns } from './columns';
import { DeleteModal } from '@flowtec/components/delete-modal';

import type { Accounting } from '../schemas/management.schema';
import { handleFormError } from '@flowtec/handlers/error';

export function DataTableDemo() {
  const [, setGlobalError] = React.useState<string | undefined>();
  const [title] = useQueryState('nome_fantasia', parseAsString.withDefault(''));
  const [status] = useQueryState(
    'situacao',
    parseAsArrayOf(parseAsString).withDefault([]),
  );

  // dados e mutações
  const { data } = useManagement();
  const { deleteAccounting } = useManagementMutations();

  // estado do modal de delete
  const [deleteModal, setDeleteModal] = React.useState<{
    isOpen?: boolean;
    id: string;
    identifier: string;
    text: string;
  } | null>(null);

  // função para abrir o modal
  const handleOpenDeleteModal = React.useCallback(
    (id: string, identifier: string, text: string, isOpen: boolean) => {
      setDeleteModal({ id, identifier, text, isOpen });
    },
    [],
  );

  // colunas injetando o callback que abre o modal
  const columns = React.useMemo(
    () => makeManagementColumns(handleOpenDeleteModal),
    [handleOpenDeleteModal],
  );

  // opcional: filtro client-side (ou remova se fizer server-side)
  const filteredData = React.useMemo(() => {
    const list = data?.results.empresas ?? [];
    return list.filter((d) => {
      const byTitle =
        !title || d.nome_fantasia.toLowerCase().includes(title.toLowerCase());
      const byStatus = status.length === 0 || status.includes(d.situacao);
      return byTitle && byStatus;
    });
  }, [data, title, status]);

  // hook da tabela
  const { table } = useDataTable({
    data: filteredData,
    columns,
    pageCount: data
      ? Math.ceil(data.count / (data.results.empresas.length || 1))
      : 1,
    initialState: {
      sorting: [{ id: 'nome_fantasia', desc: true }],
      columnPinning: { right: ['actions'] },
    },
    getRowId: (row: Accounting) => row.id,
  });

  // função executada ao confirmar delete
  const handleDelete = async () => {
    if (!deleteModal) return;
    const { id, identifier } = deleteModal;
    setGlobalError(undefined);

    try {
      await deleteAccounting.mutateAsync(id);
      // Se chegou aqui, deu sucesso
      toast.success('Exclusão feita com sucesso!', {
        description: `${identifier} foi excluído.`,
      });
      setDeleteModal(null);
    } catch (error) {
      const parsed = handleFormError<Accounting>(error, setGlobalError);
      toast.error('Ops! Erro ao excluir.', {
        description:
          parsed.globalError ?? 'Algo deu errado durante a exclusão.',
      });
    }
  };

  // função para fechar o modal
  const handleCloseModal = React.useCallback(() => {
    setDeleteModal(null);
  }, []);

  return (
    <div className="data-table-container">
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>

      {/* APENAS o modal de delete - SEM botão extra */}
      {deleteModal?.isOpen && (
        <DeleteModal
          isOpen={true}
          identifier={deleteModal.identifier}
          text="Tem certeza que deseja prosseguir com essa ação? Ela não pode ser desfeita, você estará excluindo "
          onDelete={handleDelete}
          onClose={handleCloseModal}
          isLoading={deleteAccounting.isPending}
        />
      )}
    </div>
  );
}
