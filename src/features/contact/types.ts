/** Subject categories used to route "Contact us" inquiries. */
export type ContactSubject =
  | "general"
  | "order"
  | "product"
  | "payment"
  | "support"
  | "other";

export interface ContactInput {
  name: string;
  email: string;
  phone?: string;
  subject: ContactSubject;
  message: string;
}

/** A persisted inbound contact message as returned by the backend. */
export interface ContactMessage extends ContactInput {
  id: string;
  status: "received";
  createdAt: string;
}