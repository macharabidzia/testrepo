import {
  FlightFiltersType,
  FlightsApiResponse,
  FlightFormData,
  ApiResponse,
} from "@/types";
import { fetchApi } from "./apiClient";
import { createQueryString } from "@/lib";

export const getFlights = async (
  filters: FlightFiltersType
): Promise<FlightsApiResponse> => {
  const queryString = createQueryString(filters);
  const url = `/admin/flight/get_flights${
    queryString ? `?${queryString}` : ""
  }`;
  return fetchApi(url);
};

export const registerFlight = async (
  data: FlightFormData
): Promise<ApiResponse> => {
  return fetchApi("/admin/flight/register_flight", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const changeFlight = async (
  id: number,
  data: FlightFormData
): Promise<ApiResponse> => {
  const bodyWithId = { ...data, id };
  return fetchApi("/admin/flight/change_flight", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bodyWithId),
  });
};

export const deleteFlight = async (id: number): Promise<ApiResponse> => {
  return fetchApi("/admin/flight/delete_flight", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
};
