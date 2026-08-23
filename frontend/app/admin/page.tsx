"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import {
  Users,
  Car,
  ShoppingCart,
  DollarSign,
  CheckCircle,
  Clock,
  Loader2,
  AlertCircle,
  Activity,
  TrendingUp,
  PackageCheck,
  RefreshCw,
} from "lucide-react";

import { getAdminDashboard } from "@/lib/api";

interface ActivityItem {
  id: string;
  action?: string;
  description?: string | null;
  createdAt?: string;
  user?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  } | null;
}

interface DashboardData {
  users: {
    total: number;
    active: number;
  };

  listings: {
    total: number;
    active: number;
    pending: number;
  };

  orders: {
    total: number;
    completed: number;
  };

  revenue: number;

  recentActivities: ActivityItem[];
}

function formatNumber(value: number) {
  return value.toLocaleString();
}

function formatCurrency(value: number) {
  return `₦${value.toLocaleString()}`;
}

function formatActivityDate(date?: string) {
  if (!date) return "Unknown date";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Unknown date";
  }

  return parsed.toLocaleString();
}

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = async (
    showRefresh = false
  ) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getAdminDashboard();

      setDashboard(data);
    } catch (error: unknown) {
  console.error(
    "ADMIN DASHBOARD ERROR:",
    error
  );

  const message =
    error instanceof AxiosError
      ? error.response?.data?.message
      : error instanceof Error
        ? error.message
        : undefined;

  setError(
    message ||
      "Failed to load admin dashboard."
  );
} finally {
  setLoading(false);
}
  };

  useEffect(() => {
  const timer = window.setTimeout(() => {
    void loadDashboard();
  }, 0);

  return () => window.clearTimeout(timer);
}, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2
            size={24}
            className="animate-spin"
          />

          <span className="font-medium">
            Loading admin dashboard...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle size={24} />

            <h2 className="font-semibold">
              Unable to load dashboard
            </h2>
          </div>

          <p className="mt-3 text-sm leading-6 text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={() => loadDashboard()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <RefreshCw size={16} />
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  const stats = [
    {
      title: "Total Users",
      value: formatNumber(
        dashboard.users.total
      ),
      description: `${formatNumber(
        dashboard.users.active
      )} active`,
      icon: Users,
    },
    {
      title: "Active Users",
      value: formatNumber(
        dashboard.users.active
      ),
      description: "Currently active",
      icon: CheckCircle,
    },
    {
      title: "Total Listings",
      value: formatNumber(
        dashboard.listings.total
      ),
      description: `${formatNumber(
        dashboard.listings.active
      )} active`,
      icon: Car,
    },
    {
      title: "Pending Listings",
      value: formatNumber(
        dashboard.listings.pending
      ),
      description: "Awaiting approval",
      icon: Clock,
    },
    {
      title: "Total Orders",
      value: formatNumber(
        dashboard.orders.total
      ),
      description: `${formatNumber(
        dashboard.orders.completed
      )} completed`,
      icon: ShoppingCart,
    },
    {
      title: "Completed Orders",
      value: formatNumber(
        dashboard.orders.completed
      ),
      description: "Successfully delivered",
      icon: PackageCheck,
    },
    {
      title: "Revenue",
      value: formatCurrency(
        dashboard.revenue
      ),
      description: "From completed orders",
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            FaultMart Administration
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Monitor and manage the FaultMart marketplace.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadDashboard(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-500">
                    {item.title}
                  </p>

                  <h2 className="mt-2 truncate text-2xl font-bold text-slate-900">
                    {item.value}
                  </h2>

                  <p className="mt-2 text-xs text-slate-400">
                    {item.description}
                  </p>
                </div>

                <div className="shrink-0 rounded-xl bg-slate-100 p-3">
                  <Icon
                    size={21}
                    className="text-slate-700"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Marketplace overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Listings */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5">
              <Car
                size={20}
                className="text-blue-600"
              />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Listings Overview
              </h2>

              <p className="text-sm text-slate-500">
                Marketplace inventory
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Total listings
              </span>

              <span className="font-semibold text-slate-900">
                {formatNumber(
                  dashboard.listings.total
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Active listings
              </span>

              <span className="font-semibold text-emerald-600">
                {formatNumber(
                  dashboard.listings.active
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Pending approval
              </span>

              <span className="font-semibold text-amber-600">
                {formatNumber(
                  dashboard.listings.pending
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-2.5">
              <ShoppingCart
                size={20}
                className="text-emerald-600"
              />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Orders Overview
              </h2>

              <p className="text-sm text-slate-500">
                Marketplace transactions
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Total orders
              </span>

              <span className="font-semibold text-slate-900">
                {formatNumber(
                  dashboard.orders.total
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Completed orders
              </span>

              <span className="font-semibold text-emerald-600">
                {formatNumber(
                  dashboard.orders.completed
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Revenue
              </span>

              <span className="font-semibold text-slate-900">
                {formatCurrency(
                  dashboard.revenue
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center gap-3 border-b border-slate-200 p-6">
          <div className="rounded-xl bg-violet-50 p-2.5">
            <Activity
              size={20}
              className="text-violet-600"
            />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Recent Activity
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest administrative actions.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {dashboard.recentActivities.length === 0 ? (
            <div className="p-10 text-center">
              <Activity
                size={28}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 text-sm font-medium text-slate-500">
                No recent activity
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Administrative actions will appear here.
              </p>
            </div>
          ) : (
            dashboard.recentActivities.map(
              (activity) => (
                <div
                  key={activity.id}
                  className="p-5 transition hover:bg-slate-50"
                >
                  <div className="flex items-start gap-4">

                    <div className="mt-1 rounded-full bg-slate-100 p-2">
                      <TrendingUp
                        size={15}
                        className="text-slate-600"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <p className="font-medium text-slate-900">
                          {activity.action ||
                            "Administrative action"}
                        </p>

                        <time className="text-xs text-slate-400">
                          {formatActivityDate(
                            activity.createdAt
                          )}
                        </time>
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        {activity.description ||
                          "Administrative activity"}
                      </p>

                      {activity.user && (
                        <p className="mt-2 text-xs text-slate-400">
                          By{" "}
                          <span className="font-medium text-slate-500">
                            {[
                              activity.user.firstName,
                              activity.user.lastName,
                            ]
                              .filter(Boolean)
                              .join(" ") ||
                              activity.user.email ||
                              "Unknown user"}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </section>
    </div>
  );
}