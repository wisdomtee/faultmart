"use client";

import { BarChart3, TrendingUp } from "lucide-react";

interface SalesTrendItem {
  createdAt: string | Date;
  _sum?: {
    amount?: number | null;
  };
}

interface SalesOverviewProps {
  analytics: {
    salesTrend?: SalesTrendItem[];
    monthlyRevenue?: {
      revenue: number;
      orders: number;
    };
  };
}

export default function SalesOverview({
  analytics,
}: SalesOverviewProps) {
  const salesTrend = analytics?.salesTrend ?? [];

  const monthlyRevenue = analytics?.monthlyRevenue ?? {
    revenue: 0,
    orders: 0,
  };

  const revenue = Number(monthlyRevenue.revenue ?? 0);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">
            Sales Overview
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Delivered order performance
          </p>
        </div>

        <div className="rounded-xl bg-neutral-100 p-3">
          <BarChart3 className="h-5 w-5 text-neutral-700" />
        </div>
      </div>

      {/* Sales Trend */}
      {salesTrend.length === 0 ? (
        <div className="flex min-h-[220px] items-center justify-center text-sm text-neutral-500">
          No sales data available yet.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {salesTrend.slice(-7).map((item, index) => {
            const amount = Number(item._sum?.amount ?? 0);

            const date = new Date(item.createdAt);

            const percentage =
              revenue > 0
                ? Math.min(
                    Math.max((amount / revenue) * 100 * 5, 4),
                    100
                  )
                : 4;

            return (
              <div
                key={`${date.toISOString()}-${index}`}
                className="flex items-center gap-4"
              >
                {/* Date */}
                <div className="w-24 shrink-0 text-xs text-neutral-500">
                  {date.toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                  })}
                </div>

                {/* Bar */}
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-neutral-900 transition-all"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                {/* Amount */}
                <div className="w-28 shrink-0 text-right text-sm font-semibold text-neutral-900">
                  ₦{amount.toLocaleString("en-NG")}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary */}
      <div className="mt-8 border-t border-neutral-100 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500">
              Revenue this month
            </p>

            <p className="mt-1 text-2xl font-bold text-neutral-900">
              ₦{revenue.toLocaleString("en-NG")}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-600">
            <TrendingUp className="h-4 w-4" />

            {monthlyRevenue.orders.toLocaleString("en-NG")}{" "}
            {monthlyRevenue.orders === 1 ? "order" : "orders"}
          </div>
        </div>
      </div>
    </div>
  );
}