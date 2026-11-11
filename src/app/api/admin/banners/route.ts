import { NextResponse } from "next/server";
import { getCollection, saveCollection, paginate } from "@/lib/db";
import { getAuth, unauthorized } from "@/lib/auth";
import { bannerCreateSchema } from "@/features/banners/validation";
import type { Banner } from "@/features/admin/types";

export async function GET(request: Request) {
  const auth = await getAuth(request);
  if (!auth || auth.role !== "admin") return unauthorized();

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");

  const banners = await getCollection<Banner>("banners");
  return NextResponse.json(paginate(banners, page, pageSize));
}

export async function POST(request: Request) {
  const auth = await getAuth(request);
  if (!auth || auth.role !== "admin") return unauthorized();

  const parsed = bannerCreateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid banner data", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const newBanner: Banner = {
    ...parsed.data,
    id: `banner-${Date.now()}`,
  };

  const banners = await getCollection<Banner>("banners");
  banners.push(newBanner);
  await saveCollection("banners", banners);

  return NextResponse.json({ data: newBanner }, { status: 201 });
}
