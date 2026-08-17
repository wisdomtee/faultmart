"use client";

import {
  CheckCircle2,
  Clock3,
  Package,
  Truck,
  XCircle,
} from "lucide-react";

interface OrderBuyer {
  firstName?: string | null;
  lastName?: string | null;
}

interface OrderListing {
  title?: string | null;
  images?: {
    url?: string | null;
  }[];
}

interface RecentOrder {
  id: string;
  amount?: number | string | null;
  status?: string | null;
  createdAt?: string | null;
  buyer?: OrderBuyer | null;
  listing?: OrderListing | null;
}

interface RecentOrdersProps {
  orders: RecentOrder[];
}

const statusConfig: Record<
  string,
  {
    label: string;
    className: string;
    icon: typeof Clock3;
  }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700",
    icon: Clock3,
  },

  PROCESSING: {
    label: "Processing",
    className: "bg-blue-50 text-blue-700",
    icon: Package,
  },

  CONFIRMED: {
    label: "Confirmed",
    className: "bg-blue-50 text-blue-700",
    icon: CheckCircle2,
  },

  SHIPPED: {
    label: "Shipped",
    className: "bg-indigo-50 text-indigo-700",
    icon: Truck,
  },

  DELIVERED: {
    label: "Delivered",
    className: "bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },

  COMPLETED: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },

  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700",
    icon: XCircle,
  },

  CANCELED: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700",
    icon: XCircle,
  },
};

function getStatusConfig(status?: string | null) {
  const normalizedStatus = status?.toUpperCase() || "PENDING";

  return (
    statusConfig[normalizedStatus] ?? {
      label:
        normalizedStatus.charAt(0) +
        normalizedStatus.slice(1).toLowerCase(),
      className: "bg-neutral-100 text-neutral-600",
      icon: Clock3,
    }
  );
}

function formatDate(date?: string | null) {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(amount?: number | string | null) {
  const numericAmount = Number(amount ?? 0);

  return `₦${numericAmount.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export default function RecentOrders({
  orders,
}: RecentOrdersProps) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">
            Recent Orders
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Your latest customer orders
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
          {orders.length}{" "}
          {orders.length === 1 ? "order" : "orders"}
        </span>
      </div>

      {/* Empty state */}
      {orders.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl bg-neutral-50 px-6 py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
            <Package className="h-5 w-5 text-neutral-400" />
          </div>

          <p className="mt-4 text-sm font-medium text-neutral-700">
            No orders yet
          </p>

          <p className="mt-1 max-w-sm text-xs text-neutral-500">
            Customer orders will appear here once someone purchases
            one of your listings.
          </p>
        </div>
      ) : (
        /* Orders */
        <div className="mt-6 divide-y divide-neutral-100">
          {orders.map((order) => {
            const buyerName = [
              order.buyer?.firstName,
              order.buyer?.lastName,
            ]
              .filter(Boolean)
              .join(" ");

            const status = getStatusConfig(order.status);
            const StatusIcon = status.icon;

            const listingImage =
              order.listing?.images?.[0]?.url;

            return (
              <div
                key={order.id}
                className="group flex flex-col gap-4 py-4 transition first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Left */}
                <div className="flex min-w-0 items-center gap-3">
                  {/* Listing image / fallback */}
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                    {listingImage ? (
                      <img
                        src={listingImage}
                        alt={order.listing?.title || "Listing"}
                        className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-5 w-5 text-neutral-400" />
                      </div>
                    )}
                  </div>

                  {/* Order information */}
                  <div className="min-w-0">
                    <p className="truncate font-medium text-neutral-900">
                      {order.listing?.title || "Listing"}
                    </p>

                    <p className="mt-0.5 truncate text-sm text-neutral-500">
                      {buyerName || "Customer"}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-400">
                      <span>
                        Order #{order.id.slice(0, 8)}
                      </span>

                      <span className="hidden sm:inline">
                        •
                      </span>

                      <span>
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center justify-between gap-4 pl-15 sm:justify-end sm:pl-0">
                  <div className="text-left sm:text-right">
                    <p className="font-semibold text-neutral-900">
                      {formatAmount(order.amount)}
                    </p>

                    <div
                      className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />

                      <span>{status.label}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}