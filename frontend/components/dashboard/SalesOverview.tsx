"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface SalesOverviewProps {
  analytics: {
    salesTrend: Array<{
      createdAt: string;
      _sum?: {
        amount?: number | null;
      };
    }>;

    monthlyRevenue: {
      revenue: number;
      orders: number;
    };
  };
}

interface ChartData {
  date: string;
  revenue: number;
}

export default function SalesOverview({
  analytics,
}: SalesOverviewProps) {
  const salesTrend = analytics?.salesTrend ?? [];

  const chartData: ChartData[] = salesTrend.map((item) => ({
    date: new Date(item.createdAt).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
    }),
    revenue: Number(item._sum?.amount ?? 0),
  }));

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-neutral-900">
          Sales Overview
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          Revenue generated from delivered orders
        </p>
      </div>

      {/* Chart */}
      <div className="h-[320px] w-full">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-neutral-500">
            No sales data available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: number) =>
                  `₦${value.toLocaleString("en-NG")}`
                }
              />

              <Tooltip
                formatter={(value) =>
                  `₦${Number(value).toLocaleString("en-NG")}`
                }
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="currentColor"
                fill="currentColor"
                fillOpacity={0.12}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Revenue Summary */}
      <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-5">
        <div>
          <p className="text-sm text-neutral-500">
            Monthly Revenue
          </p>

          <p className="mt-1 text-xl font-bold text-neutral-900">
            ₦
            {Number(
              analytics.monthlyRevenue.revenue ?? 0
            ).toLocaleString("en-NG")}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-neutral-500">
            Delivered Orders
          </p>

          <p className="mt-1 text-xl font-bold text-neutral-900">
            {Number(
              analytics.monthlyRevenue.orders ?? 0
            ).toLocaleString("en-NG")}
          </p>
        </div>
      </div>
    </div>
  );
}