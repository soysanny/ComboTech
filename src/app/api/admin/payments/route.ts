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

  const orders = await getCollection<Order>("orders");
  const payments = orders.map((order) => ({
    id: `pay-${order.id.replace("order-", "")}`,
    orderId: order.id,
    method: "Bakong KHQR",
    amount: order.grandTotal,
    currency: "USD",
    status: order.status === "cancelled" ? "failed" as const : "paid" as const,
    createdAt: order.createdAt,
  }));

  return NextResponse.json(paginate(payments, page, pageSize));
}
