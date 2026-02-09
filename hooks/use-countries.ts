// hooks/use-countries.ts
"use client";

import useSWR from "swr";
import { swrFetcher } from "@/lib/api";

export interface Country {
  id: number;
  code: string;
  name: string;
}

const API_URL = "/api/core/country/";

export function useCountries() {
  const { data, error, isLoading } = useSWR<Country[]>(API_URL, swrFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  return {
    countries: data || [],
    isLoading,
    isError: !!error,
    error,
  };
}
