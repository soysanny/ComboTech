"use client";

import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  ArrowRight,
} from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueLineChart } from "@/components/charts/RevenueLineChart";
import { SalesBarChart } from "@/components/charts/SalesBarChart";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/shared/Skeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAdminStats } from "@/features/admin";
import { formatCurrency } from "@/utils/formatCurrency";
import { ROUTES } from "@/constants/routes";

export function AdminDashboardContent() {
  const { data, isLoading, isError, error } = useAdminStats();

  if (isLoading) {
    return (
      <PageWrapper contained={false}>
        <Skeleton className="mb-6 h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </PageWrapper>
    );
  }

  if (isError || !data) {
    return (
      <PageWrapper contained={false}>
        <EmptyState
          title="Failed to load dashboard"
          description={error?.message ?? "Unable to fetch admin statistics."}
          action={
            <Button onClick={() => window.location.reload()}>Try again</Button>
          }
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper contained={false} className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of revenue, orders, customers, and sales analytics.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={ROUTES.adminOrders}>
            View orders
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total revenue"
          value={formatCurrency(data.totalRevenue, "USD")}
          icon={DollarSign}
        />
        <StatCard
          label="Total orders"
          value={data.totalOrders.toLocaleString()}
          icon={ShoppingBag}
        />
        <StatCard
          label="Customers"
          value={data.totalCustomers.toLocaleString()}
          icon={Users}
        />
        <StatCard
          label="Products"
          value={data.totalProducts.toLocaleString()}
          icon={Package}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="text-primary size-5" />
              Revenue trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueLineChart data={data.monthlySales} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingBag className="text-primary size-5" />
              Orders by month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SalesBarChart data={data.monthlySales} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Best selling products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-semibold">Product</th>
                  <th className="pb-3 font-semibold">Sold</th>
                  <th className="pb-3 font-semibold text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {data.bestSellers.map((product) => (
                  <tr key={product.productId} className="border-b last:border-0">
                    <td className="py-3 font-medium text-foreground">
                      {product.name}
                    </td>
                    <td className="py-3">{product.soldCount}</td>
                    <td className="py-3 text-right">
                      {formatCurrency(product.revenue, "USD")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
