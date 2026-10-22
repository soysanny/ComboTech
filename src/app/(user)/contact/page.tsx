import type { Metadata } from "next";
import { ContactPageContent } from "./ContactPageContent";

export const metadata: Metadata = {
  title: "Contact Us — CAMBOTECH",
  description:
    "Get in touch with the CAMBOTECH team. We're here to help with orders, products, payments, and technical support in Cambodia.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}