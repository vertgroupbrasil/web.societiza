import type { QueryClient, QueryKey } from '@tanstack/react-query';

export async function refreshVisibleAndMarkStale(
  queryClient: QueryClient,
  queryKeys: QueryKey[],
) {
  await Promise.all(
    queryKeys.map((queryKey) =>
      queryClient.refetchQueries({
        queryKey,
        type: 'active',
      }),
    ),
  );

  await Promise.all(
    queryKeys.map((queryKey) =>
      queryClient.invalidateQueries({
        queryKey,
        refetchType: 'none',
      }),
    ),
  );
}
