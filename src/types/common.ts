/**
 * Cross-cutting shared types used by services, hooks, and components.
 */

/** User roles that drive route-group access control. */
export type UserRole = "user" | "admin";

/** Standard paginated list envelope returned by list endpoints. */
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** Query params accepted by paginated list endpoints. */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

/** Normalized API error shape surfaced to the UI layer. */
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, string[]>;
}

/** Generic success envelope for single-resource responses. */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/** A selectable option used by dropdowns, filters, and selects. */
export interface SelectOption<T extends string | number = string> {
  label: string;
  value: T;
}

/** Sort direction shared by tables and catalog sorting. */
export type SortDirection = "asc" | "desc";
