import React, { useState, useEffect } from "react";
import { FlightFiltersType, Country, City } from "@/types";
import Button from "@/components/Button";
import {
  filterFromCountries,
  filterToCountries,
  filterFromCities,
  filterToCities,
} from "../utils/dictionaryFilters";

type FlightFiltersState = {
  fromDate: string;
  toDate: string;
  fromCountryId: number;
  fromCityId: number;
  toCountryId: number;
  toCityId: number;
};

interface FlightFiltersProps {
  initialFilters: FlightFiltersType;
  countries: Country[];
  cities: City[];
  // Updated the type expected by onFilter to be Partial
  onFilter: (
    filters: Partial<Omit<FlightFiltersType, "page" | "perPage">>
  ) => void;
  onReset: () => void;
  isLoading?: boolean;
}

const FlightFilters: React.FC<FlightFiltersProps> = ({
  initialFilters,
  countries,
  cities,
  onFilter,
  onReset,
  isLoading = false,
}) => {
  // Removed flightNumber from initial state
  const [filters, setFilters] = useState<FlightFiltersState>({
    fromDate: initialFilters.fromDate ?? "",
    toDate: initialFilters.toDate ?? "",
    fromCountryId: initialFilters.fromCountryId ?? 0,
    fromCityId: initialFilters.fromCityId ?? 0,
    toCountryId: initialFilters.toCountryId ?? 0,
    toCityId: initialFilters.toCityId ?? 0,
  });

  useEffect(() => {
    setFilters({
      fromDate: initialFilters.fromDate ?? "",
      toDate: initialFilters.toDate ?? "",
      fromCountryId: initialFilters.fromCountryId ?? 0,
      fromCityId: initialFilters.fromCityId ?? 0,
      toCountryId: initialFilters.toCountryId ?? 0,
      toCityId: initialFilters.toCityId ?? 0,
    });
  }, [initialFilters]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    const target = e.target;
    const targetValue = target.value;

    setFilters((prev) => ({
      ...prev,
      [name]: name.endsWith("Id") ? Number(targetValue) : targetValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    type TargetFilterType = Partial<
      Omit<FlightFiltersType, "page" | "perPage">
    >;

    const cleanedFilters = Object.entries(filters).reduce(
      (acc: TargetFilterType, [key, value]) => {
        if (value !== "" && value !== 0) {
          const targetKey = key as keyof TargetFilterType;
          acc[targetKey] = value as any;
        }
        return acc;
      },
      {} as TargetFilterType
    );
    onFilter(cleanedFilters);
  };

  const handleReset = () => {
    const emptyFilters: FlightFiltersState = {
      fromDate: "",
      toDate: "",
      fromCountryId: 0,
      fromCityId: 0,
      toCountryId: 0,
      toCityId: 0,
    };
    setFilters(emptyFilters);
    onReset();
  };

  const fromCountries = filterFromCountries(countries);
  const toCountries = filterToCountries(countries);
  const fromCities = filterFromCities(cities, filters.fromCountryId);
  const toCities = filterToCities(cities, filters.toCountryId);

  const isDictionaryDataAvailable = countries.length > 0 && cities.length > 0;

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Filter Flights</h3>
      {isDictionaryDataAvailable && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end"
        >
          <div>
            <label
              htmlFor="filterFromDate"
              className="block text-sm font-medium text-gray-700"
            >
              From Date
            </label>
            <input
              type="date"
              name="fromDate"
              id="filterFromDate"
              value={filters.fromDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label
              htmlFor="filterToDate"
              className="block text-sm font-medium text-gray-700"
            >
              To Date
            </label>
            <input
              type="date"
              name="toDate"
              id="filterToDate"
              value={filters.toDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label
              htmlFor="filterFromCountryId"
              className="block text-sm font-medium text-gray-700"
            >
              From Country
            </label>
            <select
              name="fromCountryId"
              id="filterFromCountryId"
              value={filters.fromCountryId}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              disabled={isLoading || !isDictionaryDataAvailable}
            >
              <option value={0}>All Countries</option>
              {fromCountries.map((country) => (
                <option key={country.countryId} value={country.countryId}>
                  {country.countryName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="filterFromCityId"
              className="block text-sm font-medium text-gray-700"
            >
              From City
            </label>
            <select
              name="fromCityId"
              id="filterFromCityId"
              value={filters.fromCityId}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              disabled={
                isLoading ||
                !isDictionaryDataAvailable ||
                !filters.fromCountryId
              }
            >
              <option value={0}>All Cities</option>
              {fromCities.map((city) => (
                <option key={city.cityId} value={city.cityId}>
                  {city.cityName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="filterToCountryId"
              className="block text-sm font-medium text-gray-700"
            >
              To Country
            </label>
            <select
              name="toCountryId"
              id="filterToCountryId"
              value={filters.toCountryId}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              disabled={isLoading || !isDictionaryDataAvailable}
            >
              <option value={0}>All Countries</option>
              {toCountries.map((country) => (
                <option key={country.countryId} value={country.countryId}>
                  {country.countryName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="filterToCityId"
              className="block text-sm font-medium text-gray-700"
            >
              To City
            </label>
            <select
              name="toCityId"
              id="filterToCityId"
              value={filters.toCityId}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              disabled={
                isLoading || !isDictionaryDataAvailable || !filters.toCountryId
              }
            >
              <option value={0}>All Cities</option>
              {toCities.map((city) => (
                <option key={city.cityId} value={city.cityId}>
                  {city.cityName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-full flex justify-end space-x-2 mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
              disabled={isLoading || !isDictionaryDataAvailable}
            >
              Reset Filters
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || !isDictionaryDataAvailable}
            >
              Apply Filters
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FlightFilters;
export type { FlightFiltersState };
