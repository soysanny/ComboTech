import { NextResponse } from "next/server";
import { getCollection, saveCollection, paginate } from "@/lib/db";
import { getAuth, unauthorized } from "@/lib/auth";
import type { Banner } from "@/features/admin/types";

export async function GET(request: Request) {
  const auth = await getAuth(request);
  if (!auth || auth.role !== "admin") return unauthorized();

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");

  const banners = getCollection<Banner>("banners");
  return NextResponse.json(paginate(banners, page, pageSize));
}

export async function POST(request: Request) {
  const auth = await getAuth(request);
  if (!auth || auth.role !== "admin") return unauthorized();

  const body = (await request.json()) as Omit<Banner, "id">;
  const newBanner: Banner = {
    ...body,
    id: `banner-${Date.now()}`,
  };

  const banners = getCollection<Banner>("banners");
  banners.push(newBanner);
  saveCollection("banners", banners);

  return NextResponse.json({ data: newBanner }, { status: 201 });
}
