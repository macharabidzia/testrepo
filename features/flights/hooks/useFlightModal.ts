import { useState } from "react";
import { Flight, FlightFormData, ApiResponse } from "@/types"; // Import ApiResponse
import { UseMutationResult } from "@tanstack/react-query";

interface UseFlightModalProps {
  registerMutation: UseMutationResult<
    ApiResponse,
    Error,
    FlightFormData,
    unknown
  >;
  changeMutation: UseMutationResult<
    ApiResponse,
    Error,
    { id: number; data: FlightFormData },
    unknown
  >;
  onCloseModalSuccess?: () => void;
}

interface UseFlightModalReturn {
  isModalOpen: boolean;
  editingFlight: Flight | null;
  openAddModal: () => void;
  openEditModal: (flight: Flight) => void;
  closeModal: () => void;
  handleFormSubmit: (data: FlightFormData) => void;
  isSubmitting: boolean;
  formError: string | null;
}

export function useFlightModal({
  registerMutation,
  changeMutation,
  onCloseModalSuccess,
}: UseFlightModalProps): UseFlightModalReturn {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFlight(null);
    registerMutation.reset();
    changeMutation.reset();
    onCloseModalSuccess?.();
  };

  const openAddModal = () => {
    setEditingFlight(null);
    setIsModalOpen(true);
    registerMutation.reset();
    changeMutation.reset();
  };

  const openEditModal = (flight: Flight) => {
    setEditingFlight(flight);
    setIsModalOpen(true);
    registerMutation.reset();
    changeMutation.reset();
  };

  const handleFormSubmit = (data: FlightFormData) => {
    if (editingFlight) {
      changeMutation.mutate(
        { id: editingFlight.id, data },
        {
          onSuccess: () => {
            closeModal();
          },
        }
      );
    } else {
      registerMutation.mutate(data, {
        onSuccess: () => {
          closeModal();
        },
      });
    }
  };

  const isSubmitting = registerMutation.isPending || changeMutation.isPending;
  // Error comes from mutation.error if the promise rejects
  const formError =
    registerMutation.error?.message || changeMutation.error?.message || null;

  return {
    isModalOpen,
    editingFlight,
    openAddModal,
    openEditModal,
    closeModal,
    handleFormSubmit,
    isSubmitting,
    formError,
  };
}
