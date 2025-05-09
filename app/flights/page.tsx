"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { removeToken, createQueryString } from "@/lib";
import { FlightFiltersType, FlightFormData } from "@/types";
import {
  useFlightsQuery,
  useFlightDictionaries,
  useRegisterFlight,
  useChangeFlight,
  useDeleteFlight,
} from "@/features/flights/hooks";
import { useFilterSync } from "@/features/flights/hooks/useFilterSync";
import { useFlightModal } from "@/features/flights/hooks/useFlightModal";
import FlightsTable from "@/features/flights/components/FlightsTable";
import FlightFilters from "@/features/flights/components/FlightFilters";
import FlightForm from "@/features/flights/components/FlightForm";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { FullPageError } from "@/features/flights/components/FullPageError";
import { FullPageLoader } from "@/features/flights/components/FullPageLoader";

const ITEMS_PER_PAGE = 10;

export default function FlightsPage() {
  const ready = useAuthGuard();
  const { filters, apply, changePage, resetFilters } =
    useFilterSync(ITEMS_PER_PAGE);
  const {
    data: flightsData,
    isLoading: loadingFlights,
    isFetching: fetchingFlights,
    error: flightErr,
  } = useFlightsQuery(filters);
  const {
    countries,
    cities,
    isLoading: loadingDicts,
    error: dictErr,
  } = useFlightDictionaries();

  const registerMutation = useRegisterFlight();
  const changeMutation = useChangeFlight();
  const deleteMutation = useDeleteFlight();

  const {
    isModalOpen,
    editingFlight,
    openAddModal,
    openEditModal,
    closeModal,
    handleFormSubmit,
    isSubmitting,
    formError,
  } = useFlightModal({
    registerMutation,
    changeMutation,
    onCloseModalSuccess: () => {
      apply({});
    },
  });

  if (
    !ready ||
    (loadingFlights && !flightsData) ||
    (loadingDicts && !countries)
  ) {
    return <FullPageLoader />;
  }
  if (flightErr || dictErr) {
    return (
      <FullPageError
        message={(flightErr || dictErr)!.message}
        onRecover={() => window.location.reload()}
      />
    );
  }

  // Determine prev/next purely from page & items returned
  const hasPrev = flightsData!.currentPage > 1;
  const hasNext = flightsData!.flights.length === filters.perPage;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Flight Management</h1>
        <Button
          variant="secondary"
          onClick={() => {
            removeToken();
            window.location.assign("/login");
          }}
        >
          Logout
        </Button>
      </div>

      <Button variant="primary" className="mb-6" onClick={openAddModal}>
        Register New Flight
      </Button>

      <FlightFilters
        countries={countries!}
        cities={cities!}
        initialFilters={{
          ...filters,
          flightNumber: filters.flightNumber || "",
          fromDate: filters.fromDate || "",
          toDate: filters.toDate || "",
          fromCountryId: filters.fromCountryId || 0,
          fromCityId: filters.fromCityId || 0,
          toCountryId: filters.toCountryId || 0,
          toCityId: filters.toCityId || 0,
        }}
        onFilter={apply}
        onReset={resetFilters}
        isLoading={loadingDicts}
      />

      {fetchingFlights && (
        <p className="text-center my-4 text-gray-600">Updating…</p>
      )}

      <FlightsTable
        flights={flightsData!.flights}
        onEdit={openEditModal}
        onDelete={(id) => deleteMutation.mutate(id)}
        isDeleting={deleteMutation.isPending}
      />

      <div className="mt-6 flex justify-between items-center">
        <span className="text-sm text-gray-700">
          Page {flightsData!.currentPage}, showing {flightsData!.flights.length}{" "}
          records
        </span>
        <div>
          <Button
            variant="secondary"
            className="mr-2"
            onClick={() => changePage(flightsData!.currentPage - 1)}
            disabled={!hasPrev || fetchingFlights}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            onClick={() => changePage(flightsData!.currentPage + 1)}
            disabled={!hasNext || fetchingFlights}
          >
            Next
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingFlight ? "Edit Flight" : "Register New Flight"}
      >
        <FlightForm
          initialData={editingFlight}
          countries={countries!}
          cities={cities!}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
          isLoading={isSubmitting}
          error={formError}
        />
      </Modal>
    </div>
  );
}
