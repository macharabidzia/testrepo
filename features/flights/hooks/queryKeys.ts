import { FlightFiltersType } from "@/types";

export const flightKeys = {
  all: ["flights"] as const,
  lists: () => [...flightKeys.all, "list"] as const,
  list: (filters: FlightFiltersType) =>
    [...flightKeys.lists(), filters] as const,
};

export const dictionaryKeys = {
  all: ["dictionaries"] as const,
  countries: () => [...dictionaryKeys.all, "countries"] as const,
  cities: () => [...dictionaryKeys.all, "cities"] as const,
};
