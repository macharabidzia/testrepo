import { useQuery, UseQueryResult } from "@tanstack/react-query"; // Import UseQueryResult for typing useEffect deps
import { getCountries, getCities } from "@/api";
import { Country, City } from "@/types";
import { dictionaryKeys } from "./queryKeys";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib";
import { useEffect } from "react"; // Import useEffect

export const useFlightDictionaries = () => {
  const router = useRouter();
  const countriesQuery: UseQueryResult<Country[], Error> = useQuery({
    queryKey: dictionaryKeys.countries(),
    queryFn: getCountries,
    enabled: typeof window !== "undefined" && !!getToken(),
  });

  const citiesQuery: UseQueryResult<City[], Error> = useQuery({
    queryKey: dictionaryKeys.cities(),
    queryFn: getCities,
    enabled: typeof window !== "undefined" && !!getToken(),
  });
  useEffect(() => {
    if (countriesQuery.isError) {
      const err = countriesQuery.error as any;
      if (err?.status === 401) {
        console.error(
          "Countries query unauthorized (handled in useEffect), redirecting..."
        );
        router.replace("/login");
        return;
      } else {
        console.error(
          "Error fetching countries (handled in useEffect):",
          err?.message
        );
      }
    }

    if (!countriesQuery.isError && citiesQuery.isError) {
      const err = citiesQuery.error as any;
      if (err?.status === 401) {
        console.error(
          "Cities query unauthorized (handled in useEffect), redirecting..."
        );
        router.replace("/login");
        return;
      } else {
        console.error(
          "Error fetching cities (handled in useEffect):",
          err?.message
        );
      }
    }
  }, [
    countriesQuery.isError,
    countriesQuery.error,
    citiesQuery.isError,
    citiesQuery.error,
    router,
  ]);

  return {
    countries: countriesQuery.data ?? [],
    cities: citiesQuery.data ?? [],
    isLoading: countriesQuery.isLoading || citiesQuery.isLoading,
    error: countriesQuery.error || citiesQuery.error,
  };
};
