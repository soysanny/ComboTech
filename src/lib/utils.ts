// Re-export the canonical class-merge helper so shadcn-generated components
// (which import from "@/lib/utils") share a single source of truth with the
// app-level helper at "@/utils/cn".
export { cn } from "@/utils/cn";
