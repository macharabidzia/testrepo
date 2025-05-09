import {
  useQuery,
  keepPreviousData,
  UseQueryResult,
} from "@tanstack/react-query";
import { getFlights } from "@/api";
import { FlightFiltersType, FlightsApiResponse } from "@/types";
import { flightKeys } from "./queryKeys";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib";
import { useEffect } from "react";

export const useFlightsQuery = (
  filters: FlightFiltersType
): UseQueryResult<FlightsApiResponse, Error> => {
  const router = useRouter();

  const queryResult = useQuery<FlightsApiResponse, Error>({
    queryKey: flightKeys.list(filters),
    queryFn: () => getFlights(filters),
    enabled: typeof window !== "undefined" && !!getToken(),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (queryResult.isError) {
      const err = queryResult.error;
      if (
        err &&
        typeof err === "object" &&
        "status" in err &&
        (err as any).status === 401
      ) {
        console.error("Flight query unauthorized, redirecting...");
        router.replace("/login");
      } else {
        console.error(
          "Error fetching flights:",
          (err as any)?.message || "Unknown error"
        );
      }
    }
  }, [queryResult.isError, queryResult.error, router]);

  return queryResult;
};
