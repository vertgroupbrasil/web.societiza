'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@shadcn/index';
import { Users, UserPlus } from 'lucide-react';
import { inviteByEmailDTO, type InviteByEmailInput } from '../schemas/office.schema';
import { MemberCard } from './ui/MemberCard';
import { MemberCardSkeleton } from './ui/MemberCardSkeleton';
import { InviteByLinkCard } from './ui/InviteByLinkCard';
import { InviteByEmailForm } from './forms/InviteByEmailForm';
import { PLAN_LIMITS } from '../constants/plans.constants';
import { useOfficeById, useOfficeMembers, useOfficeInviteLink } from '../hooks/queries/useOfficeQueries';
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
  const { data: members, isLoading: isMembersLoading } = useOfficeMembers(officeId);
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
      <div className="space-y-6">
        <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        <div className="divide-y">
          <MemberCardSkeleton />
          <MemberCardSkeleton />
          <MemberCardSkeleton />
        </div>
      </div>
    );
  }

  const isOwner = office?.isOwner ?? false;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-muted-foreground" />
        <h1 className="text-xl font-semibold">Membros</h1>
        {office && (
          <span className="text-sm text-muted-foreground ml-1">
            {office.memberCount}/{PLAN_LIMITS[office.plan].maxMembers}
          </span>
        )}
      </div>

      {/* Lista de membros */}
      <div className="divide-y rounded-lg border overflow-hidden">
        {members && members.length > 0 ? (
          members.map((member) => (
            <div key={member.id} className="px-4">
              <MemberCard
                member={member}
                isCurrentUser={member.id === currentUserId}
                canRemove={isOwner}
                onRemove={(memberId) => removeMember.mutate(memberId)}
                isRemoving={removeMember.isPending}
              />
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-muted-foreground px-4">
            <p className="text-sm">Nenhum membro encontrado.</p>
          </div>
        )}
      </div>

      {/* Convidar membros */}
      {isOwner && (
        <>
          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-base font-medium">Convidar membros</h2>
            </div>

            {canInvite ? (
              <div className="space-y-4">
                <InviteByEmailForm
                  form={form}
                  onSubmit={handleInvite}
                  isPending={inviteByEmail.isPending}
                />

                {canUseLink && inviteLink && (
                  <InviteByLinkCard inviteUrl={inviteLink.url} />
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-center space-y-2">
                <p className="text-sm font-medium">
                  Convite de membros não disponível no plano Grátis
                </p>
                <p className="text-xs text-muted-foreground">
                  Faça upgrade para o plano Escrivaninha ou Executivo para
                  convidar membros para o seu escritório.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
