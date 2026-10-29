import { NextResponse } from "next/server";
import { getCollection, saveCollection } from "@/lib/db";
import { getAuth, unauthorized } from "@/lib/auth";
import type { Order } from "@/features/orders/types";
import { ORDER_STATUS } from "@/constants/orderStatus";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuth(request);
  if (!auth || auth.role !== "admin") return unauthorized();

  const { id } = await params;
  const body = (await request.json()) as { status?: string };

  const orders = await getCollection<Order>("orders");
  const order = orders.find((o) => o.id === id);
  if (!order) {
    return NextResponse.json({ message: "Order not found", status: 404 }, { status: 404 });
  }

  if (body?.status && Object.values(ORDER_STATUS).includes(body.status as never)) {
    order.status = body.status as Order["status"];
    order.updatedAt = new Date().toISOString();
    await saveCollection("orders", orders);
  }

  return NextResponse.json({ data: order });
}
