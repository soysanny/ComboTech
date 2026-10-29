import { NextResponse } from "next/server";
import { getCollection, saveCollection } from "@/lib/db";
import { getAuth, unauthorized } from "@/lib/auth";
import type { Banner } from "@/features/admin/types";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuth(request);
  if (!auth || auth.role !== "admin") return unauthorized();

  const { id } = await params;
  const body = (await request.json()) as Partial<Banner>;

  const banners = await getCollection<Banner>("banners");
  const index = banners.findIndex((b) => b.id === id);
  if (index === -1) {
    return NextResponse.json({ message: "Banner not found", status: 404 }, { status: 404 });
  }

  banners[index] = { ...banners[index], ...body, id };
  await saveCollection("banners", banners);

  return NextResponse.json({ data: banners[index] });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuth(request);
  if (!auth || auth.role !== "admin") return unauthorized();

  const { id } = await params;
  const banners = await getCollection<Banner>("banners");
  const index = banners.findIndex((b) => b.id === id);
  if (index === -1) {
    return NextResponse.json({ message: "Banner not found", status: 404 }, { status: 404 });
  }

  banners.splice(index, 1);
  await saveCollection("banners", banners);
  return NextResponse.json({ success: true });
}
