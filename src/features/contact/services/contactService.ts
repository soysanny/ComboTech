import { apiClient } from "@/services/api/axiosInstance";
import { ENDPOINTS } from "@/services/api/endpoints";
import { registerMock } from "@/services/api/mockAdapter";
import type { ContactInput, ContactMessage } from "../types";

// TODO: replace mock with real API endpoint.
// In-memory store of submitted messages — the mock handler appends here.
const messages: ContactMessage[] = [];

registerMock("POST", ENDPOINTS.contact.submit, (ctx) => {
  const body = ctx.body as ContactInput;
  const message: ContactMessage = {
    ...body,
    id: `contact-${Date.now()}`,
    status: "received",
    createdAt: new Date().toISOString(),
  };
  messages.unshift(message);
  return { data: { data: message } };
});

/** Contact service — single entry point for "Contact us" submissions. */
export const contactService = {
  submit: (input: ContactInput) =>
    apiClient.post<{ data: ContactMessage }>(ENDPOINTS.contact.submit, input),
};