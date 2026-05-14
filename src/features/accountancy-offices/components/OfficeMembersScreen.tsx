'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@shadcn/index';
import { Users, UserPlus } from 'lucide-react';
import {
  inviteByEmailDTO,
  type InviteByEmailInput,
} from '../schemas/office.schema';
import { MemberCard } from './ui/MemberCard';
import { MemberCardSkeleton } from './ui/MemberCardSkeleton';
import { InviteByLinkCard } from './ui/InviteByLinkCard';
import { InviteByEmailForm } from './forms/InviteByEmailForm';
import { PLAN_LIMITS } from '../constants/plans.constants';
import {
  useOfficeById,
  useOfficeInviteLink,
  useOfficeMembers,
} from '../hooks/queries/useOfficeQueries';
import {
  useInviteByEmail,
  useRemoveMember,
} from '../hooks/mutations/useOfficeMutations';

interface OfficeMembersScreenProps {
  officeId: string;
  currentUserId?: string;
}

export function OfficeMembersScreen({
  officeId,
  currentUserId,
}: OfficeMembersScreenProps) {
  const { data: office, isLoading: isOfficeLoading } = useOfficeById(officeId);
  const { data: members, isLoading: isMembersLoading } =
    useOfficeMembers(officeId);
  const inviteByEmail = useInviteByEmail(officeId);
  const removeMember = useRemoveMember(officeId);

  const canInvite = office ? PLAN_LIMITS[office.plan].canInviteMembers : false;
  const canUseLink = office ? PLAN_LIMITS[office.plan].canUseInviteLink : false;

  const { data: inviteLink } = useOfficeInviteLink(
    canUseLink ? officeId : '',
  );

  const form = useForm<InviteByEmailInput>({
    resolver: zodResolver(inviteByEmailDTO),
    defaultValues: { email: '' },
  });

  const handleInvite = (data: InviteByEmailInput) => {
    inviteByEmail.mutate(data, {
      onSuccess: () => form.reset(),
    });
  };

  const isLoading = isOfficeLoading || isMembersLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-16 w-full rounded-lg" />
        <Card>
          <CardContent className="divide-y">
            <MemberCardSkeleton />
            <MemberCardSkeleton />
            <MemberCardSkeleton />
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOwner = office?.isOwner ?? false;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Membros</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie quem tem acesso ao escritório ativo.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Lista de membros</CardTitle>
          </div>
          <CardDescription>
            {office ? (
              <>
                {office.memberCount}/{PLAN_LIMITS[office.plan].maxMembers}{' '}
                membros usados no plano {office.plan}.
              </>
            ) : (
              'Membros vinculados ao escritório.'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          {members && members.length > 0 ? (
            members.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                isCurrentUser={member.id === currentUserId}
                canRemove={isOwner}
                onRemove={(memberId) => removeMember.mutate(memberId)}
                isRemoving={removeMember.isPending}
              />
            ))
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <p className="text-sm">Nenhum membro encontrado.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {isOwner && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Convidar membros</CardTitle>
            </div>
            <CardDescription>
              Envie convites conforme os limites do plano atual.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {canInvite ? (
              <>
                <InviteByEmailForm
                  form={form}
                  onSubmit={handleInvite}
                  isPending={inviteByEmail.isPending}
                />

                {canUseLink && inviteLink && (
                  <InviteByLinkCard
                    inviteUrl={inviteLink.url}
                    className="border-0 bg-transparent p-0"
                  />
                )}
              </>
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-sm font-medium">
                  Convite de membros não disponível no plano Grátis
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Faça upgrade para o plano Escrivaninha ou Executivo para
                  convidar membros para o seu escritório.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
