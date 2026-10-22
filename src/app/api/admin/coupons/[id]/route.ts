import { NextResponse } from "next/server";
import { getCollection, saveCollection } from "@/lib/db";
import { getAuth, unauthorized } from "@/lib/auth";
import type { Coupon } from "@/features/admin/types";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuth(request);
  if (!auth || auth.role !== "admin") return unauthorized();

  const { id } = await params;
  const body = (await request.json()) as Partial<Coupon>;

  const coupons = getCollection<Coupon>("coupons");
  const index = coupons.findIndex((c) => c.id === id);
  if (index === -1) {
    return NextResponse.json({ message: "Coupon not found", status: 404 }, { status: 404 });
  }

  coupons[index] = { ...coupons[index], ...body, id };
  saveCollection("coupons", coupons);

  return NextResponse.json({ data: coupons[index] });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuth(request);
  if (!auth || auth.role !== "admin") return unauthorized();

  const { id } = await params;
  const coupons = getCollection<Coupon>("coupons");
  const index = coupons.findIndex((c) => c.id === id);
  if (index === -1) {
    return NextResponse.json({ message: "Coupon not found", status: 404 }, { status: 404 });
  }

  coupons.splice(index, 1);
  saveCollection("coupons", coupons);
  return NextResponse.json({ success: true });
}
