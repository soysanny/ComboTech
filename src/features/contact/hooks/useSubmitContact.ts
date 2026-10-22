"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { contactService } from "../services/contactService";
import type { ContactInput } from "../types";

/** Submit a "Contact us" message. Shows a toast on success or failure. */
export function useSubmitContact() {
  return useMutation({
    mutationFn: (input: ContactInput) => contactService.submit(input),
    onSuccess: () => {
      toast.success("Message sent", {
        description: "Thanks for reaching out — we'll reply shortly.",
      });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Something went wrong. Please try again.");
    },
  });
}