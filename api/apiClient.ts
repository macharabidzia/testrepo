import { getToken, removeToken } from "@/lib";
import {
  ApiError,
  ApiHttpError,
  ApiNetworkError,
  ApiUnauthorizedError,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const handleHttpError = async (response: Response): Promise<never> => {
  let errorBody: any = null;
  const contentType = response.headers.get("content-type");

  try {
    if (contentType && contentType.includes("application/json")) {
      errorBody = await response.json();
    } else {
      errorBody = await response.text();
    }
  } catch (e) {
    console.error(
      `Failed to parse error response body from ${response.url}:`,
      e
    );
    errorBody = `Could not parse response body (status ${response.status})`;
  }

  if (response.status === 401) {
    throw new ApiUnauthorizedError(response, errorBody);
  }

  throw new ApiHttpError(response, errorBody);
};

export const fetchApi = async <T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  const token = getToken();

  const requestHeaders = new Headers(options?.headers);

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: requestHeaders,
    });

    if (!response.ok) {
      await handleHttpError(response);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return (await response.json()) as T;
    }

    console.warn(
      `Received non-JSON success response from ${url}. Parsing as text.`
    );
    return (await response.text()) as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }

    console.error(`Workspace failed for ${url}:`, error);
    throw new ApiNetworkError(`Network request failed for ${url}`, error);
  }
};

export const fetchFormDataApi = async <T = any>(
  endpoint: string,
  formData: FormData,
  options?: RequestInit
): Promise<T> => {
  const token = getToken();

  const requestHeaders = new Headers(options?.headers);

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  if (
    requestHeaders.has("Content-Type") &&
    requestHeaders.get("Content-Type")?.startsWith("multipart/form-data")
  ) {
    requestHeaders.delete("Content-Type");
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: options?.method || "POST",
      ...options,
      headers: requestHeaders,
      body: formData,
    });

    if (!response.ok) {
      await handleHttpError(response);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return (await response.json()) as T;
    }

    console.warn(
      `Received non-JSON success response from ${url} (FormData). Parsing as text.`
    );
    return (await response.text()) as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }

    console.error(`Workspace (FormData) failed for ${url}:`, error);
    throw new ApiNetworkError(
      `Network request failed for ${url} (FormData)`,
      error
    );
  }
};
