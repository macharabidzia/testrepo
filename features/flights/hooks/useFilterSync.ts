import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createQueryString } from "@/lib";
import type { FlightFiltersType } from "@/types";

const DEFAULT_FILTERS: Omit<FlightFiltersType, "page" | "perPage"> = {
  flightNumber: undefined,
  fromDate: undefined,
  toDate: undefined,
  fromCountryId: undefined,
  fromCityId: undefined,
  toCountryId: undefined,
  toCityId: undefined,
};

export function useFilterSync(defaultPerPage = 10) {
  const router = useRouter();
  const params = useSearchParams();

  const parse = () => {
    const p = new URLSearchParams(params);
    return {
      page: +p.get("page")! || 1,
      perPage: +p.get("perPage")! || defaultPerPage,
      flightNumber: p.get("flightNumber") ?? undefined,
      fromDate: p.get("fromDate") ?? undefined,
      toDate: p.get("toDate") ?? undefined,
      fromCountryId: p.has("fromCountryId")
        ? +p.get("fromCountryId")!
        : undefined,
      fromCityId: p.has("fromCityId") ? +p.get("fromCityId")! : undefined,
      toCountryId: p.has("toCountryId") ? +p.get("toCountryId")! : undefined,
      toCityId: p.has("toCityId") ? +p.get("toCityId")! : undefined,
    } as FlightFiltersType;
  };

  const [filters, setFilters] = useState<FlightFiltersType>(() => parse());

  useEffect(() => {
    const next = parse();
    if (JSON.stringify(next) !== JSON.stringify(filters)) {
      setFilters(next);
    }
  }, [params]);

  const apply = (
    updates: Partial<Omit<FlightFiltersType, "page" | "perPage">>
  ) => {
    const merged: FlightFiltersType = { ...filters, ...updates, page: 1 };
    const cleanedMerged = Object.entries(merged).reduce<Record<string, any>>(
      (o, [k, v]) => {
        if (v != null && v !== "" && (typeof v !== "number" || v !== 0)) {
          o[k] = v;
        }
        return o;
      },
      {}
    );
    const qs = createQueryString(cleanedMerged);
    router.push(`/flights?${qs}`);
  };

  const resetFilters = () => {
    const defaultState: FlightFiltersType = {
      page: 1,
      perPage: filters.perPage,
      ...DEFAULT_FILTERS,
    };
    const cleanedDefault = Object.entries(defaultState).reduce<
      Record<string, any>
    >((o, [k, v]) => {
      if (v != null && v !== "" && (typeof v !== "number" || v !== 0)) {
        o[k] = v;
      }
      return o;
    }, {});
    const qs = createQueryString(cleanedDefault);
    router.push(`/flights?${qs}`);
  };

  const changePage = (page: number) => {
    const cleanedCurrent = Object.entries(filters).reduce<Record<string, any>>(
      (o, [k, v]) => {
        if (v != null && v !== "" && (typeof v !== "number" || v !== 0)) {
          o[k] = v;
        }
        return o;
      },
      {}
    );
    const qs = createQueryString({ ...cleanedCurrent, page });
    router.push(`/flights?${qs}`);
  };

  return { filters, apply, changePage, resetFilters };
}
