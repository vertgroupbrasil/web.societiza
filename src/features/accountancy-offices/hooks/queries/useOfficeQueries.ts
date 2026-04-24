import { useQuery } from '@tanstack/react-query';
import { officeQueryOptions } from './query-options';

export const useOffices = () => useQuery(officeQueryOptions.list());

export const useOfficeById = (id: string) =>
  useQuery(officeQueryOptions.detail(id));

export const useOfficeMembers = (officeId: string) =>
  useQuery(officeQueryOptions.members(officeId));

export const useOfficeInviteLink = (officeId: string) =>
  useQuery(officeQueryOptions.inviteLink(officeId));
