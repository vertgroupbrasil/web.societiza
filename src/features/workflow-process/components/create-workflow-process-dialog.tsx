'use client';

import { FormEvent, useMemo, useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shadcn/index';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useWorkflowTemplates } from '@societiza/features/workflow-template/hooks/queries/use-workflow-template-queries';
import type { WorkflowTemplateListItem } from '@societiza/features/workflow-template/server/types/template.types';
import { WORKFLOW_PROCESS_TYPE_OPTIONS } from '../constants';
import { useCreateWorkflowProcess } from '../hooks/mutations';
import type { WorkflowProcessType } from '../server/types';

type CreateWorkflowProcessDialogProps = {
  accountancyId: string | undefined;
  onCreated: (processId: string) => void;
};

type WorkflowTemplateListEnvelope = {
  items?: WorkflowTemplateListItem[];
  data?: WorkflowTemplateListItem[];
};

const normalizeWorkflowTemplateList = (
  response: WorkflowTemplateListItem[] | WorkflowTemplateListEnvelope | undefined,
): WorkflowTemplateListItem[] => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.items)) return response.items;
  if (Array.isArray(response.data)) return response.data;
  return [];
};

export function CreateWorkflowProcessDialog({
  accountancyId,
  onCreated,
}: CreateWorkflowProcessDialogProps) {
  const [open, setOpen] = useState(false);
  const [templateId, setTemplateId] = useState('');
  const [processType, setProcessType] = useState<WorkflowProcessType | ''>('');
  const [targetClient, setTargetClient] = useState('');
  const { data: templates, isLoading: isLoadingTemplates } =
    useWorkflowTemplates({ pageSize: 100 });
  const createProcess = useCreateWorkflowProcess();

  const activeTemplates = useMemo(() => {
    return normalizeWorkflowTemplateList(templates).filter(
      (template) => template.status === 'Active' || !template.status,
    );
  }, [templates]);

  const resetForm = () => {
    setTemplateId('');
    setProcessType('');
    setTargetClient('');
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) resetForm();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!accountancyId) {
      toast.error('Selecione uma contabilidade antes de criar o processo.');
      return;
    }

    if (!templateId || !processType || !targetClient.trim()) {
      toast.error('Informe template, tipo e cliente-alvo.');
      return;
    }

    const result = await createProcess.mutateAsync({
      accountancyId,
      templateId,
      processType,
      targetClient: targetClient.trim(),
    });

    handleOpenChange(false);
    onCreated(result.id);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button onClick={() => setOpen(true)} disabled={!accountancyId}>
        <Plus data-icon className="size-4" />
        Novo processo
      </Button>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo processo societário</DialogTitle>
          <DialogDescription>
            Escolha o template ativo, o tipo do processo e o cliente-alvo.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="workflow-template">
              Template
            </label>
            <Select
              value={templateId}
              onValueChange={setTemplateId}
              disabled={isLoadingTemplates || activeTemplates.length === 0}
            >
              <SelectTrigger id="workflow-template" className="w-full">
                <SelectValue
                  placeholder={
                    activeTemplates.length === 0
                      ? 'Nenhum template ativo'
                      : 'Selecione um template'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {activeTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="process-type">
              Tipo
            </label>
            <Select
              value={processType}
              onValueChange={(value) =>
                setProcessType(value as WorkflowProcessType)
              }
            >
              <SelectTrigger id="process-type" className="w-full">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {WORKFLOW_PROCESS_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="target-client">
              Cliente-alvo
            </label>
            <Input
              id="target-client"
              placeholder="Nome do cliente ou empresa"
              value={targetClient}
              onChange={(value) => setTargetClient(value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createProcess.isPending || activeTemplates.length === 0}
            >
              {createProcess.isPending ? 'Criando...' : 'Criar processo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
