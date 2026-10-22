import { NextResponse } from "next/server";
import { getCollection, paginate } from "@/lib/db";
import { getAuth, unauthorized } from "@/lib/auth";
import type { Order } from "@/features/orders/types";

export async function GET(request: Request) {
  const auth = await getAuth(request);
  if (!auth || auth.role !== "admin") return unauthorized();

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const status = searchParams.get("status");
  const search = searchParams.get("search")?.toLowerCase();

  let orders = getCollection<Order>("orders");

  if (status) {
    orders = orders.filter((o) => o.status === status);
  }
  if (search) {
    orders = orders.filter(
      (o) =>
        o.id.toLowerCase().includes(search) ||
        o.items.some((item) => item.name.toLowerCase().includes(search)),
    );
  }

  return NextResponse.json(paginate(orders, page, pageSize));
}
