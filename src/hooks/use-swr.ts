import { useState, useEffect, useRef, useCallback } from "react";

interface SWROptions<T> {
  refreshInterval?: number;
  fallbackData?: T;
  revalidateOnFocus?: boolean;
}

interface SWRResponse<T> {
  data: T | undefined;
  error: Error | null;
  isLoading: boolean;
  isValidating: boolean;
  mutate: () => Promise<void>;
}

export function useSWR<T>(
  key: string | null,
  fetcher: (url: string) => Promise<T>,
  options: SWROptions<T> = {}
): SWRResponse<T> {
  const { refreshInterval = 0, fallbackData, revalidateOnFocus = true } = options;

  const [data, setData] = useState<T | undefined>(fallbackData);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!fallbackData && !!key);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const executeFetch = useCallback(async () => {
    if (!key) return;
    setIsValidating(true);
    try {
      const result = await fetcherRef.current(key);
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
      setIsValidating(false);
    }
  }, [key]);

  // Initial fetch
  useEffect(() => {
    executeFetch();
  }, [executeFetch]);

  // Polling interval
  useEffect(() => {
    if (!key || !refreshInterval || refreshInterval <= 0) return;

    const intervalId = setInterval(() => {
      // Don't poll if document is hidden to conserve bandwidth
      if (typeof document !== "undefined" && document.hidden) return;
      executeFetch();
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [key, refreshInterval, executeFetch]);

  // Window focus revalidation
  useEffect(() => {
    if (!revalidateOnFocus || !key) return;

    const onFocus = () => {
      executeFetch();
    };

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [key, revalidateOnFocus, executeFetch]);

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate: executeFetch,
  };
}
