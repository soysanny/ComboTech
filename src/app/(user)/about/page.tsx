import type { Metadata } from "next";
import { AboutPageContent } from "./AboutPageContent";

export const metadata: Metadata = {
  title: "About Us — CAMBOTECH",
  description:
    "Learn about CAMBOTECH — Cambodia's trusted e-commerce destination for premium computers, laptops, gaming gear, and accessories.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
