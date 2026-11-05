import { API_BASE_URL, ENDPOINTS } from "@/services/api/endpoints";
import type { AuthResponse, LoginInput } from "../types";

async function requestJson<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    ...init,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await response.json().catch(() => ({}))
    : await response.text().catch(() => "");

  if (!response.ok) {
    const message =
      typeof data === "object" && data && "message" in data
        ? String((data as { message?: unknown }).message)
        : "Request failed";
    throw new Error(message);
  }
  return data as T;
}

/**
 * Auth service — staff (admin) authentication only. The storefront
 * has no customer accounts, so only login and logout are supported.
 */
export const authService = {
  login: (input: LoginInput) =>
    requestJson<AuthResponse>(ENDPOINTS.auth.login, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  logout: () =>
    requestJson<{ success: boolean }>(ENDPOINTS.auth.logout, {
      method: "POST",
    }),
};



