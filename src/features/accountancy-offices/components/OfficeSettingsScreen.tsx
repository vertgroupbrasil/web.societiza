'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Separator,
} from '@shadcn/index';
import { Trash2, ShieldCheck } from 'lucide-react';
import { updateOfficeDTO, type UpdateOfficeInput } from '../schemas/office.schema';
import { OfficeIdentityForm } from './forms/OfficeIdentityForm';
import { FrozenOfficeBanner } from './ui/FrozenOfficeBanner';
import { PlanBadge } from './ui/PlanBadge';
import { PlanUsageBar } from './ui/PlanUsageBar';
import { PLAN_LIMITS } from '../constants/plans.constants';
import { useOfficeById } from '../hooks/queries/useOfficeQueries';
import {
  useUpdateOffice,
  useDeleteOffice,
} from '../hooks/mutations/useOfficeMutations';

interface OfficeSettingsScreenProps {
  officeId: string;
}

export function OfficeSettingsScreen({ officeId }: OfficeSettingsScreenProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { data: office, isLoading, error } = useOfficeById(officeId);
  const updateOffice = useUpdateOffice(officeId);
  const deleteOffice = useDeleteOffice();

  const form = useForm<UpdateOfficeInput>({
    resolver: zodResolver(updateOfficeDTO),
    defaultValues: office
      ? {
          cnpj: office.cnpj,
          legalName: office.legalName,
          tradeName: office.tradeName ?? '',
          address: office.address,
          city: office.city,
          state: office.state,
          postalCode: office.postalCode,
          phone: office.phone,
          email: office.email ?? '',
        }
      : {
          cnpj: '',
          legalName: '',
          tradeName: '',
          address: '',
          city: '',
          state: '',
          postalCode: '',
          phone: '',
          email: '',
        },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-48 bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-3/4 bg-muted rounded" />
      </div>
    );
  }

  if (error || !office) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Não foi possível carregar os dados do escritório.</p>
        <Button variant="ghost" onClick={() => window.location.reload()} className="mt-2">
          Tentar novamente
        </Button>
      </div>
    );
  }

  const limits = PLAN_LIMITS[office.plan];

  const handleSubmit = (data: UpdateOfficeInput) => {
    updateOffice.mutate(data);
  };

  const handleDelete = () => {
    deleteOffice.mutate(officeId);
    setDeleteOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Banner de congelamento */}
      {office.status === 'Frozen' && (
        <FrozenOfficeBanner
          reason={
            office.memberCount > limits.maxMembers ? 'members' : 'processes'
          }
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            {office.tradeName ?? office.legalName}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <PlanBadge plan={office.plan} />
            <span className="text-xs text-muted-foreground">
              {office.isOwner ? 'Você é o owner' : 'Você é membro'}
            </span>
          </div>
        </div>
      </div>

      {/* Uso do plano */}
      <div className="rounded-lg border p-4 space-y-3 bg-muted/30">
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          <span>Uso do plano {office.plan}</span>
        </div>
        <PlanUsageBar
          label="Processos"
          current={office.processCount}
          max={limits.maxProcesses}
        />
        <PlanUsageBar
          label="Membros"
          current={office.memberCount}
          max={limits.maxMembers}
        />
      </div>

      <Separator />

      {/* Formulário de identidade */}
      <div className="space-y-4">
        <h2 className="text-base font-medium">Dados do escritório</h2>
        <OfficeIdentityForm
          form={form}
          onSubmit={handleSubmit}
          isPending={updateOffice.isPending}
        />
      </div>

      {/* Zona de perigo */}
      {office.isOwner && (
        <>
          <Separator />
          <div className="space-y-4">
            <h2 className="text-base font-medium text-destructive">
              Zona de perigo
            </h2>
            <div className="rounded-lg border border-destructive/30 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Excluir escritório</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Esta ação é permanente e irreversível. Todos os processos e
                  templates serão perdidos.
                </p>
              </div>
              <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="shrink-0 ml-4 gap-1.5"
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir escritório?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação é permanente e não pode ser desfeita. Todos os
                      processos, templates e dados de{' '}
                      <strong>{office.tradeName ?? office.legalName}</strong>{' '}
                      serão excluídos permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Sim, excluir escritório
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
