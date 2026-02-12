'use client';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Separator,
} from '@shadcn/index';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { NewProcessForm, ProcessTypes, Stages } from '@corporate/index';
import { Accounties } from '@flowtec/features/management/schemas/management.schema';

interface ProcessDialogProps {
  accounties?: Accounties;
  processTypes: ProcessTypes;
  stages: Stages;
  trigger?: React.ReactNode;
}

export default function ProcessDialog({
  accounties,
  processTypes,
  stages,
  trigger,
}: ProcessDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button type="button">
            <Plus className="h-4 w-4 mr-2" />
            Novo Processo
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Processo</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar um novo processo contábil.
          </DialogDescription>
        </DialogHeader>
        <Separator />

        <div className="py-4">
          {/* ✅ CORREÇÃO: Só renderizar se accounties existir */}
          {accounties ? (
            <NewProcessForm
              accounties={accounties} // ✅ Agora não é undefined
              processTypes={processTypes}
              stages={stages}
              onSuccess={handleSuccess}
            />
          ) : (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-700">
                Carregando dados das contabilidades...
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
