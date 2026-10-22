import type { Metadata } from "next";
import { HomePageContent } from "./HomePageContent";

export const metadata: Metadata = {
  title: "CAMBOTECH — Premium Computers & Tech Gear",
  description:
    "Shop laptops, desktops, PC parts, storage, peripherals, printers and accessories with local warranty and genuine products in Cambodia.",
};

export default function HomePage() {
  return <HomePageContent />;
}
