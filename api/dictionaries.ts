import { Country, City } from "@/types";
import { fetchApi } from "./apiClient";

export const getCountries = async (): Promise<Country[]> => {
  return fetchApi("/admin/flight/get_countries");
};

export const getCities = async (): Promise<City[]> => {
  return fetchApi("/admin/flight/get_cities");
};
