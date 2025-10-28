import { useEffect, useState } from "react";

type FetchFunction<TData> = (options?: {
    signal: AbortSignal;
}) => Promise<TData>;

interface UseQueryResult<TData, TError> {
    data: TData | null;
    error: TError | null;
    isLoading: boolean;
}

const cache: Record<string, unknown> = {};

/**
 * Minimal useQuery hook
 *
 * @param key Unique key identifying this query
 * @param fetchFn Async function returning the data
 */
export function useQuery<TData = unknown, TError = Error>(
    key: string,
    fetchFn: FetchFunction<TData>
): UseQueryResult<TData, TError> {
    const [data, setData] = useState<TData | null>(
        () => (cache[key] as TData) || null
    );
    const [error, setError] = useState<TError | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(!cache[key]);

    useEffect(() => {
        const controller = new AbortController();

        // If cached, skip fetching
        if (cache[key]) return;

        setIsLoading(true);
        setError(null);

        fetchFn({ signal: controller.signal })
            .then((res) => {
                cache[key] = res;
                setData(res);
            })
            .catch((err) => {
                // Ignore abort errors
                if (err.name !== "AbortError") {
                    setError(err as TError);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });

        // Cleanup: cancella la fetch se il componente si smonta
        return () => controller.abort();
    }, [key, fetchFn]);

    return { data, error, isLoading };
}
