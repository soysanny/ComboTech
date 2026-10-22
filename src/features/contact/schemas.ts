import { z } from "zod";

/** Ordered subject list — drives both the schema enum and the form Select. */
export const contactSubjects = [
  "general",
  "order",
  "product",
  "payment",
  "support",
  "other",
] as const;

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  phone: z.string().optional(),
  subject: z.enum(contactSubjects),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactSchema = z.infer<typeof contactSchema>;