import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import type { Banner } from "@/features/admin/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as Banner["type"] | null;

  const banners = getCollection<Banner>("banners")
    .filter((b) => b.active)
    .sort((a, b) => a.order - b.order);

  const filtered = type ? banners.filter((b) => b.type === type) : banners;

  return NextResponse.json({ data: filtered });
}
