import { Country, City } from "@/types";

export const filterFromCountries = (countries: Country[]): Country[] => {
  return countries.filter((country) => country.sendAllowed === "Y");
};

export const filterToCountries = (countries: Country[]): Country[] => {
  return countries.filter((country) => country.receivedAllowed === "Y");
};

export const filterFromCities = (
  cities: City[],
  countryId?: number
): City[] => {
  if (countryId === undefined || countryId === 0) return [];
  return cities.filter(
    (city) => city.countryId === countryId && city.sendAllowed === "Y"
  );
};

export const filterToCities = (cities: City[], countryId?: number): City[] => {
  if (countryId === undefined || countryId === 0) return [];
  return cities.filter(
    (city) => city.countryId === countryId && city.receivedAllowed === "Y"
  );
};
