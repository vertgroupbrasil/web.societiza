'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
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
import {
  Building2,
  FileText,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import {
  updateOfficeDTO,
  type Office,
  type UpdateOfficeInput,
} from '../schemas/office.schema';
import { OfficeIdentityForm } from './forms/OfficeIdentityForm';
import { FrozenOfficeBanner } from './ui/FrozenOfficeBanner';
import { PlanBadge } from './ui/PlanBadge';
import { PlanUsageBar } from './ui/PlanUsageBar';
import { PLAN_LIMITS, PLAN_LABELS } from '../constants/plans.constants';
import { useMyOffice } from '../hooks/queries/useOfficeQueries';
import {
  useDeleteOffice,
  useUpdateOffice,
} from '../hooks/mutations/useOfficeMutations';
import {
  displayCEP,
  displayCNPJ,
  displayPhone,
} from '@societiza/features/accountancy/lib/accountancy.formatters';
import { useCurrentUser } from '@societiza/hooks/useCurrentUser';

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

function getOfficeInitials(office: Office) {
  return (office.tradeName ?? office.legalName)
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

export function OfficeSettingsScreen() {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { data: office, isLoading, error, refetch } = useMyOffice();
  const updateOffice = useUpdateOffice(office?.id ?? '');
  const deleteOffice = useDeleteOffice();
  const currentUser = useCurrentUser();
  // Spec accountancy-org: AccountancyAdmin/Employee não editam dados cadastrais.
  // Apenas SystemAdmin pode escrever — mas SystemAdmin não acessa /me.
  const isReadOnly = currentUser?.role !== 'SystemAdmin';

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
        <Skeleton className="h-56 w-full rounded-lg" />
        <Skeleton className="h-[32rem] w-full rounded-lg" />
      </div>
    );
  }

  if (error || !office) {
    const status =
      (error as { response?: { status?: number; data?: { type?: string } } })
        ?.response?.status;
    const errorType = (
      error as { response?: { data?: { type?: string } } }
    )?.response?.data?.type;

    if (status === 403 && errorType === 'AccountancyClaimMissing') {
      return (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-sm font-medium">
              Sua conta ainda não está vinculada a uma contabilidade.
            </p>
            <p className="text-xs text-muted-foreground max-w-md">
              Isso geralmente indica um problema de provisionamento. Entre em
              contato com o suporte da Societiza para resolver.
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar os dados do escritório.
          </p>
          <Button variant="outline" onClick={() => void refetch()}>
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
    deleteOffice.mutate(office.id);
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

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Configuração do escritório
        </h1>
        <p className="text-sm text-muted-foreground">
          Atualize identidade, contato e informações institucionais do
          escritório ativo.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Resumo do escritório</CardTitle>
          </div>
          <CardDescription>
            Visão rápida da identidade pública e da capacidade atual do plano.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="overflow-hidden rounded-lg border bg-card">
            <div className="relative h-36 bg-muted sm:h-44">
              {office.bannerUrl ? (
                <Image
                  src={office.bannerUrl}
                  alt=""
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="size-full bg-[linear-gradient(120deg,rgba(255,222,154,0.92)_0%,rgba(250,211,184,0.88)_48%,rgba(242,200,213,0.92)_100%)]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            </div>

            <div className="flex flex-col gap-4 p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="relative -mt-12 flex size-20 items-center justify-center overflow-hidden rounded-lg border-4 border-background bg-[#f3eadf] text-xl font-semibold text-foreground sm:size-24">
                  {office.profilePhotoUrl ? (
                    <Image
                      src={office.profilePhotoUrl}
                      alt={office.tradeName ?? office.legalName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span>{getOfficeInitials(office)}</span>
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold text-foreground">
                      {office.tradeName ?? office.legalName}
                    </h2>
                    <PlanBadge plan={office.plan} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {office.description ??
                      'Apresente o escritório com uma descrição curta, clara e institucional.'}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border bg-background p-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium">Plano e consumo</p>
                  </div>
                  <div className="mt-4 flex flex-col gap-4">
                    <div className="text-sm text-muted-foreground">
                      Plano {PLAN_LABELS[office.plan]}
                    </div>
                    <PlanUsageBar
                      label="Processos ativos"
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

                <div className="rounded-lg border bg-background p-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium">Dados institucionais</p>
                  </div>
                  <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
                    <div className="inline-flex items-start gap-2">
                      <Building2 className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>CNPJ {displayCNPJ(office.cnpj)}</span>
                    </div>
                    <div className="inline-flex items-start gap-2">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{displayPhone(office.phone)}</span>
                    </div>
                    {office.email && (
                      <div className="inline-flex items-start gap-2">
                        <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{office.email}</span>
                      </div>
                    )}
                    <div className="inline-flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>
                        {office.address}
                        <br />
                        {displayCEP(office.postalCode)} · {office.city},{' '}
                        {office.state}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <OfficeIdentityForm
        form={form}
        onSubmit={handleSubmit}
        isPending={updateOffice.isPending}
        readOnly={isReadOnly}
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
