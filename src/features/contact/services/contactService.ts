import { apiClient } from "@/services/api/axiosInstance";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { ContactInput, ContactMessage } from "../types";

/** Contact service — submits "Contact us" messages to the backend (persisted). */
export const contactService = {
  submit: (input: ContactInput) =>
    apiClient.post<{ data: ContactMessage }>(ENDPOINTS.contact.submit, input),
};
