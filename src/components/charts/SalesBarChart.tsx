"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface SalesBarChartProps {
  data: { month: string; orders: number }[];
}

/** Recharts sales bar chart. */
export function SalesBarChart({ data }: SalesBarChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="month"
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickLine={false}
          />
          <Tooltip
            contentStyle={
              {
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: "0.75rem",
              } as React.CSSProperties
            }
          />
          <Bar
            dataKey="orders"
            fill="var(--primary)"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
