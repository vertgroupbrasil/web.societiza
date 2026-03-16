'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { get } from '../../server/services/management.service';
import { API_ENDPOINTS } from '@societiza/routes/endpoints';
import { Management } from '../../schemas/management.schema';

const api = API_ENDPOINTS;

export function useManagement(): UseQueryResult<Management, Error> {
  return useQuery<Management, Error>({
    queryKey: [api.accountancy],
    queryFn: get,
  });
}
