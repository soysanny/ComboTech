import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import { getAuth, unauthorized } from "@/lib/auth";
import type { Product } from "@/features/products/types";
import type { Order } from "@/features/orders/types";
import type { AdminStats } from "@/features/admin/types";

interface UserRecord {
  role: string;
}

export async function GET(request: Request) {
  const auth = await getAuth(request);
  if (!auth || auth.role !== "admin") return unauthorized();

  const products = await getCollection<Product>("products");
  const orders = await getCollection<Order>("orders");
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + (o.grandTotal ?? 0), 0);

  const monthlyMap = new Map<string, { revenue: number; orders: number }>();
  for (const order of orders) {
    if (order.status === "cancelled") continue;
    const date = new Date(order.createdAt);
    const key = date.toLocaleString("en-US", { month: "short" });
    const entry = monthlyMap.get(key) ?? { revenue: 0, orders: 0 };
    entry.revenue += order.grandTotal ?? 0;
    entry.orders += 1;
    monthlyMap.set(key, entry);
  }

  const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlySales = monthOrder
    .filter((m) => monthlyMap.has(m))
    .map((month) => ({ month, ...monthlyMap.get(month)! }));

  const bestSellers = [...products]
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 5)
    .map((product) => ({
      productId: product.id,
      name: product.name,
      soldCount: product.soldCount,
      revenue: product.soldCount * product.price,
    }));

  const stats: AdminStats = {
    totalRevenue,
    totalOrders: orders.length,
    totalCustomers: (await getCollection<UserRecord>("users")).filter((u) => u.role === "user").length,
    totalProducts: products.length,
    monthlySales,
    bestSellers,
  };

  return NextResponse.json(stats);
}
