'use client';

import React, { useState } from 'react';
import {
  Button,
  DialogTitle,
  Drawer,
  DrawerContent,
  Input,
  Label,
} from '@shadcn/index';
import {
  useCorporateUIContext,
  useCorporateProcessById,
  useCorporateListProcessTypes,
  EditProcessForm,
  FORM_URL,
} from '@corporate/index';
import { toast } from 'sonner';
import { CopyIcon } from '@icons/index';
import { DeleteModal } from '@components/index';

export function CorporateDrawer() {
  const {
    selectedProcessId,
    drawerOpen,
    setDrawerOpen,
    setSelectedProcessId, // ✅ Adicionar função para limpar
  } = useCorporateUIContext();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pendingDeleteCallback, setPendingDeleteCallback] = useState<
    (() => Promise<void>) | null
  >(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: processData, isLoading: processLoading } =
    useCorporateProcessById(selectedProcessId || '');

  const { data: processTypesData, isLoading: typesLoading } =
    useCorporateListProcessTypes();

  const handleDeleteRequest = (deleteCallback: () => Promise<void>) => {
    setPendingDeleteCallback(() => deleteCallback);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (pendingDeleteCallback) {
      try {
        setIsDeleting(true);
        await pendingDeleteCallback();

        // ✅ Sequência correta de limpeza
        setDeleteModalOpen(false);
        setPendingDeleteCallback(null);
        setDrawerOpen(false);
        setSelectedProcessId(null); // ✅ Limpar processo selecionado
      } catch (error) {
        console.error('Erro ao deletar:', error);
        toast.error('Erro ao deletar processo');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setPendingDeleteCallback(null);
  };

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedProcessId(null); // ✅ Limpar ao fechar manual
  };

  // ✅ Não renderizar se não há processo selecionado
  if (!selectedProcessId || !drawerOpen) {
    return null;
  }

  const processName = processData?.processo?.nome || 'Processo';

  return (
    <>
      <Drawer
        open={drawerOpen}
        onOpenChange={(open) => {
          setDrawerOpen(open);
          if (!open) {
            setSelectedProcessId(null); // ✅ Limpar ao fechar via backdrop
          }
        }}
        direction="right"
      >
        <DialogTitle>Editar Processo</DialogTitle>

        <DrawerContent className="sm:max-w-lg w-full h-full flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {(processLoading || typesLoading) && (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    Carregando dados...
                  </p>
                </div>
              </div>
            )}

            {processData?.processo &&
              processTypesData &&
              !processLoading &&
              !typesLoading && (
                <EditProcessForm
                  process={processData.processo}
                  processTypes={processTypesData}
                  onDelete={handleDeleteRequest}
                  onClose={handleClose}
                />
              )}

            {!processLoading && !processData?.processo && (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Processo não encontrado ou erro ao carregar dados.
                  </p>
                </div>
              </div>
            )}
          </div>

          {processData?.processo && !processLoading && !typesLoading && (
            <div className="border-t bg-background/95 flex-col backdrop-blur-sm p-4 flex gap-3 justify-end">
              <Label className="flex gap-2 items-start flex-col w-full">
                <span>Link para formulário</span>
                <div className="flex items-center w-full gap-2">
                  <Input
                    type="url"
                    value={FORM_URL + `${processData.processo.id}`}
                    className="w-full overflow-hidden text-ellipsis whitespace-nowrap"
                    readOnly
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        FORM_URL + `${processData.processo.id}`,
                      );
                      toast.info('Link copiado para a área de transferência!');
                    }}
                  >
                    <CopyIcon />
                  </Button>
                </div>
              </Label>
              <Button
                effect={'shineHover'}
                type="submit"
                form="edit-process-form"
                className="w-full"
              >
                Salvar alterações
              </Button>
            </div>
          )}
        </DrawerContent>
      </Drawer>

      <DeleteModal
        isOpen={deleteModalOpen}
        identifier={processName}
        text="Esta ação não pode ser desfeita. Para confirmar a exclusão do processo"
        onDelete={handleConfirmDelete}
        onClose={handleCancelDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
