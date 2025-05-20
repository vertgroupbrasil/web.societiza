import useSWR, { SWRConfiguration } from "swr";
import { useRouter } from "next/navigation";
import { ApiError } from "@/types/Api";
import api from "@/lib/axios";


export function useApiBase<T>(
  endpoint: string | null,
  options: SWRConfiguration<T> = {},
) {
  const router = useRouter();

  const key = endpoint ? endpoint : null;

  const fetcher = async (url: string) => {
    try {
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      const apiError: ApiError = new Error(
        "An error occurred while fetching the data.",
      );
      apiError.info = error.response?.data;
      apiError.status = error.response?.status;
      throw apiError;
    }
  };

  const { data, error, mutate, isValidating } = useSWR<T>(
    key,
    key ? fetcher : null,
    {
      ...options,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
      dedupingInterval: 60000,
      refreshInterval: 0,

      onErrorRetry: async (err, key, config, revalidate, { retryCount }) => {
        const apiError = err as ApiError;

        // Verifica erros de autorização (401 ou 400)
        if (apiError.status === 401 || apiError.status === 400) {
          // Limita para uma única tentativa
          if (retryCount < 1) {
            try {
              console.log("Revalidating after token refresh");
              await revalidate();
            } catch (error: any) {
              console.log(retryCount);
              console.log("Token refresh failed:", error);
              router.push("/login");
            }
          } else {
            console.log("Max retry count reached, redirecting to login");
            router.push("/login");
          }
          return;
        }
      },
    },
  );

  return {
    data,
    error,
    mutate,
    isLoading: !error && !data,
    isValidating,
  };
}
