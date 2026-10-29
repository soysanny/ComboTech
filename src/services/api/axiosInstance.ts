import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ApiError } from "@/types/common";
import { API_BASE_URL } from "./endpoints";

/**
 * Shared Axios instance. All API access flows through this — UI components must
 * never import axios directly.
 */

let authTokenAccessor: () => string | null = () => null;

/**
 * Register a function that returns the current auth token. Wired up once from
 * the Redux store bootstrap so the request interceptor can read the latest
 * token without importing the store here (keeps services store-agnostic).
 */
export function setAuthTokenAccessor(accessor: () => string | null): void {
  authTokenAccessor = accessor;
}

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authTokenAccessor();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error: unknown) => Promise.reject(normalizeError(error)),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeError(error)),
);

interface AxiosLikeError extends Error {
  isAxiosError?: boolean;
  response?: { status?: number; data?: Partial<ApiError> & Record<string, unknown> };
  config?: unknown;
  code?: string;
}

function isAxiosLikeError(error: unknown): error is AxiosLikeError {
  return error instanceof Error && (error as AxiosLikeError).isAxiosError === true;
}

/** Normalize any thrown value into the app-wide {@link ApiError} shape. */
export function normalizeError(error: unknown): ApiError {
  if (error instanceof AxiosError || isAxiosLikeError(error)) {
    const status = error.response?.status ?? 0;
    const data = error.response?.data as Partial<ApiError> | undefined;
    return {
      message:
        data?.message ??
        error.message ??
        "Something went wrong. Please try again.",
      status,
      code: data?.code ?? error.code,
      details: data?.details,
    };
  }
  if (error instanceof Error) {
    return { message: error.message, status: 0 };
  }
  return { message: "An unknown error occurred.", status: 0 };
}

/** Thin typed helpers so services stay concise. */
export const apiClient = {
  get: async <T>(url: string, params?: unknown): Promise<T> => {
    const res = await axiosInstance.get<T>(url, { params });
    return res.data;
  },
  post: async <T>(url: string, body?: unknown): Promise<T> => {
    const res = await axiosInstance.post<T>(url, body);
    return res.data;
  },
  put: async <T>(url: string, body?: unknown): Promise<T> => {
    const res = await axiosInstance.put<T>(url, body);
    return res.data;
  },
  patch: async <T>(url: string, body?: unknown): Promise<T> => {
    const res = await axiosInstance.patch<T>(url, body);
    return res.data;
  },
  delete: async <T>(url: string): Promise<T> => {
    const res = await axiosInstance.delete<T>(url);
    return res.data;
  },
};
