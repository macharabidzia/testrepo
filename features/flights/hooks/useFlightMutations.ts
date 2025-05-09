import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerFlight, changeFlight, deleteFlight } from "@/api";
import {
  FlightFormData,
  ChangeFlightVariables,
  DeleteFlightVariables,
  ApiResponse,
} from "@/types";
import { flightKeys } from "./queryKeys";
import { useRouter } from "next/navigation";
import { removeToken } from "@/lib";

export const useRegisterFlight = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<ApiResponse, Error, FlightFormData>({
    mutationFn: registerFlight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flightKeys.lists() });
    },
    onError: (err: any) => {
      if (err.status === 401) {
        removeToken();
        router.push("/login");
      } else {
        console.error("Registration failed:", err.message);
      }
    },
  });
};

export const useChangeFlight = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<ApiResponse, Error, ChangeFlightVariables>({
    mutationFn: ({ id, data }) => changeFlight(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flightKeys.lists() });
    },
    onError: (err: any) => {
      if (err.status === 401) {
        removeToken();
        router.push("/login");
      } else {
        console.error("Update failed:", err.message);
      }
    },
  });
};

export const useDeleteFlight = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<ApiResponse, Error, DeleteFlightVariables>({
    mutationFn: deleteFlight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flightKeys.lists() });
    },

    onError: (err: any) => {
      console.error("Delete failed:", err.message);
      if (err.status === 401) {
        removeToken();
        router.push("/login");
      }
    },
  });
};
