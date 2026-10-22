import { NextResponse } from "next/server";
import { getCollection, saveCollection, paginate } from "@/lib/db";
import { getAuth, unauthorized } from "@/lib/auth";
import type { Coupon, CreateCouponInput } from "@/features/admin/types";

export async function GET(request: Request) {
  const auth = await getAuth(request);
  if (!auth || auth.role !== "admin") return unauthorized();

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");

  const coupons = getCollection<Coupon>("coupons");
  return NextResponse.json(paginate(coupons, page, pageSize));
}

export async function POST(request: Request) {
  const auth = await getAuth(request);
  if (!auth || auth.role !== "admin") return unauthorized();

  const body = (await request.json()) as CreateCouponInput;
  const newCoupon: Coupon = {
    ...body,
    id: `coupon-${Date.now()}`,
    usedCount: 0,
  };

  const coupons = getCollection<Coupon>("coupons");
  coupons.unshift(newCoupon);
  saveCollection("coupons", coupons);

  return NextResponse.json({ data: newCoupon }, { status: 201 });
}
