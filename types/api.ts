export interface ApiResponse {
  type: "success" | "error";
  message: string;
  isLoading: boolean;
}

export interface ApiErrorResponse {
  message: string;
}
