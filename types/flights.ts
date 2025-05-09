// types/flights.ts

import { ApiResponse } from "./api";

export interface Flight {
  id: number;
  flightNumber: string;
  flightDate: string; // YYYY-MM-DD HH:mm:ss
  fromCountryId: number;
  fromCountryDictionaryKey: string;
  fromCityId: number;
  fromCityDictionaryKey: string;
  toCountryId: number;
  toCountryDictionaryKey: string;
  toCityId: number;
  toCityDictionaryKey: string;
  inpDate: string; // YYYY-MM-DD HH:mm:ss
  actions: ("edit" | "delete")[];
}
export interface Flight {
  id: number;
  flightNumber: string;
  flightDate: string;
  inpDate: string;
  fromCountryId: number;
  fromCountryDictionaryKey: string;
  fromCityId: number;
  fromCityDictionaryKey: string;
  toCountryId: number;
  toCountryDictionaryKey: string;
  toCityId: number;
  toCityDictionaryKey: string;
  actions: ("edit" | "delete")[];
}
export interface FlightsApiResponse {
  recordsNumber: number;
  currentPage: number;
  perPage: number;
  flights: Flight[];
}

export interface FlightFiltersType {
  page: number;
  perPage: number;
  flightNumber?: string;
  fromDate?: string; // YYYY-MM-DD
  toDate?: string; // YYYY-MM-DD
  fromCountryId?: number;
  fromCityId?: number;
  toCountryId?: number;
  toCityId?: number;
  [key: string]: string | number | null | undefined;
}

export interface FlightFormData {
  flightNumber: string;
  flightDate: string; // YYYY-MM-DD HH:mm:ss
  fromCountryId: number;
  fromCityId: number;
  toCountryId: number;
  toCityId: number;
}

export type ChangeFlightVariables = {
  id: number;
  data: FlightFormData;
};

export type DeleteFlightVariables = number;
