'use client';

import { useEffect, useState } from 'react';
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@shadcn/index';
import { Trash2, ShieldCheck } from 'lucide-react';
import {
  updateOfficeDTO,
  type Office,
  type UpdateOfficeInput,
} from '../schemas/office.schema';
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

const EMPTY_OFFICE_FORM_VALUES: UpdateOfficeInput = {
  cnpj: '',
  legalName: '',
  tradeName: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  phone: '',
  email: '',
  description: '',
  profilePhotoUrl: '',
  bannerUrl: '',
};

function getOfficeFormValues(office?: Office): UpdateOfficeInput {
  if (!office) return EMPTY_OFFICE_FORM_VALUES;

  return {
    cnpj: office.cnpj,
    legalName: office.legalName,
    tradeName: office.tradeName ?? '',
    address: office.address,
    city: office.city,
    state: office.state,
    postalCode: office.postalCode,
    phone: office.phone,
    email: office.email ?? '',
    description: office.description ?? '',
    profilePhotoUrl: office.profilePhotoUrl ?? '',
    bannerUrl: office.bannerUrl ?? '',
  };
}

export function OfficeSettingsScreen({ officeId }: OfficeSettingsScreenProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { data: office, isLoading, error } = useOfficeById(officeId);
  const updateOffice = useUpdateOffice(officeId);
  const deleteOffice = useDeleteOffice();

  const form = useForm<UpdateOfficeInput>({
    resolver: zodResolver(updateOfficeDTO),
    defaultValues: EMPTY_OFFICE_FORM_VALUES,
  });
  const { reset } = form;

  useEffect(() => {
    if (!office) return;
    reset(getOfficeFormValues(office));
  }, [office, reset]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (error || !office) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar os dados do escritório.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
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
    <div className="flex flex-col gap-6">
      {office.status === 'Frozen' && (
        <FrozenOfficeBanner
          reason={
            office.memberCount > limits.maxMembers ? 'members' : 'processes'
          }
        />
      )}

      <Card className="overflow-hidden">
        <div className="relative h-44 bg-muted sm:h-56">
          {office.bannerUrl ? (
            <img
              src={office.bannerUrl}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <div className="size-full bg-[linear-gradient(135deg,hsl(var(--primary))_0%,hsl(var(--muted))_55%,hsl(var(--background))_100%)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/15 to-transparent" />
        </div>

        <CardContent className="relative flex flex-col gap-6 p-6 pt-0">
          <div className="-mt-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex size-28 items-center justify-center overflow-hidden rounded-2xl border-4 border-background bg-muted shadow-sm">
                {office.profilePhotoUrl ? (
                  <img
                    src={office.profilePhotoUrl}
                    alt={office.tradeName ?? office.legalName}
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-semibold">
                    {(office.tradeName ?? office.legalName)
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((word) => word[0]?.toUpperCase() ?? '')
                      .join('')}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-semibold tracking-tight">
                    {office.tradeName ?? office.legalName}
                  </h1>
                  <PlanBadge plan={office.plan} />
                </div>
                <p className="max-w-3xl text-base text-muted-foreground">
                  {office.description ??
                    'Apresente o escritório com uma descrição curta, clara e institucional.'}
                </p>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <span>{office.legalName}</span>
                  <span aria-hidden="true">•</span>
                  <span>
                    {office.city}, {office.state}
                  </span>
                  {office.email && (
                    <>
                      <span aria-hidden="true">•</span>
                      <span>{office.email}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                <span>Uso do plano {office.plan}</span>
              </div>
              <div className="mt-4 flex flex-col gap-3">
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
            </div>

            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm font-medium">Dados de contato</p>
              <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                <span>{office.phone}</span>
                <span>{office.address}</span>
                <span>
                  {office.postalCode} · {office.city}, {office.state}
                </span>
                <span>CNPJ {office.cnpj}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <OfficeIdentityForm
        form={form}
        onSubmit={handleSubmit}
        isPending={updateOffice.isPending}
      />

      {office.isOwner && (
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">Zona de perigo</CardTitle>
            <CardDescription>
              Ações permanentes para este escritório.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">Excluir escritório</p>
              <p className="text-sm text-muted-foreground">
                Esta ação é permanente e irreversível. Todos os processos e
                templates serão perdidos.
              </p>
            </div>
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="shrink-0"
                  icon={Trash2}
                  iconPlacement="left"
                >
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
