"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Loader2,
  Package,
  Truck,
  XCircle,
} from "lucide-react";

import {
  getMyOrders,
  updateOrderStatus,
  cancelOrder,
} from "@/lib/api";

interface Order {
  id: string;
  amount?: number | string | null;
  status?: string | null;
  createdAt?: string | null;
  shippingAddress?: string | null;

  buyer?: {
    firstName?: string | null;
    lastName?: string | null;
  } | null;

  seller?: {
    firstName?: string | null;
    lastName?: string | null;
  } | null;

  listing?: {
    id?: string;
    title?: string | null;
    slug?: string | null;
    images?: {
      url?: string | null;
    }[];
  } | null;
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
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-blue-50 text-blue-700",
    icon: CheckCircle2,
  },
  PROCESSING: {
    label: "Processing",
    className: "bg-blue-50 text-blue-700",
    icon: Package,
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
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700",
    icon: XCircle,
  },
  REFUNDED: {
    label: "Refunded",
    className: "bg-red-50 text-red-700",
    icon: XCircle,
  },
};

function getStatusConfig(status?: string | null) {
  const normalized = status?.toUpperCase() || "PENDING";

  return (
    statusConfig[normalized] ?? {
      label:
        normalized.charAt(0) +
        normalized.slice(1).toLowerCase(),
      className: "bg-neutral-100 text-neutral-600",
      icon: Clock3,
    }
  );
}

function formatAmount(amount?: number | string | null) {
  return `₦${Number(amount ?? 0).toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date?: string | null) {
  if (!date) return "Date unavailable";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Date unavailable";
  }

  return parsed.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatName(
  person?: {
    firstName?: string | null;
    lastName?: string | null;
  } | null
) {
  return (
    [person?.firstName, person?.lastName]
      .filter(Boolean)
      .join(" ") || "Unknown"
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(
    null
  );

  async function loadOrders() {
    try {
      setLoading(true);
      setError(null);

      const result = await getMyOrders();

      console.log("MY ORDERS:", result);

      setOrders(result ?? []);
    } catch (err) {
      console.error("Orders Error:", err);
      setError("Unable to load your orders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function handleStatusUpdate(
    orderId: string,
    status: string
  ) {
    try {
      setUpdatingId(orderId);

      await updateOrderStatus(orderId, status);

      await loadOrders();
    } catch (err) {
      console.error("Update Order Error:", err);
      setError("Unable to update the order.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleCancel(orderId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setUpdatingId(orderId);

      await cancelOrder(orderId);

      await loadOrders();
    } catch (err) {
      console.error("Cancel Order Error:", err);
      setError("Unable to cancel the order.");
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-neutral-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading orders...
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Orders
          </h1>

          <p className="mt-2 text-neutral-500">
            Manage orders connected to your marketplace listings.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
        >
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Empty */}
      {orders.length === 0 ? (
        <section className="rounded-2xl border border-neutral-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
            <Package className="h-6 w-6 text-neutral-400" />
          </div>

          <h2 className="mt-5 text-lg font-bold text-neutral-900">
            No orders yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-neutral-500">
            Orders will appear here when you purchase an item or
            someone purchases one of your listings.
          </p>
        </section>
      ) : (
        /* Orders */
        <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-100 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">
                  Your Orders
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  {orders.length}{" "}
                  {orders.length === 1 ? "order" : "orders"}
                </p>
              </div>

              <Package className="h-5 w-5 text-neutral-400" />
            </div>
          </div>

          <div className="divide-y divide-neutral-100">
            {orders.map((order) => {
              const status = getStatusConfig(order.status);
              const StatusIcon = status.icon;

              const imageUrl =
                order.listing?.images?.[0]?.url;

              return (
                <div
                  key={order.id}
                  className="p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    {/* Listing */}
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={
                              order.listing?.title ||
                              "Listing"
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Package className="h-6 w-6 text-neutral-400" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-neutral-900">
                          {order.listing?.title ||
                            "Listing"}
                        </p>

                        <p className="mt-1 text-sm text-neutral-500">
                          Order #{order.id.slice(0, 8)}
                        </p>

                        <p className="mt-1 text-xs text-neutral-400">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:flex lg:items-center">
                      <div>
                        <p className="text-xs text-neutral-400">
                          Amount
                        </p>

                        <p className="mt-1 font-semibold text-neutral-900">
                          {formatAmount(order.amount)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-neutral-400">
                          Buyer
                        </p>

                        <p className="mt-1 text-sm font-medium text-neutral-700">
                          {formatName(order.buyer)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-neutral-400">
                          Status
                        </p>

                        <div
                          className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status.label}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-neutral-100 pt-5">
                    {order.status === "PENDING" && (
                      <>
                        <button
                          disabled={updatingId === order.id}
                          onClick={() =>
                            handleStatusUpdate(
                              order.id,
                              "CONFIRMED"
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updatingId === order.id && (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          )}
                          Confirm Order
                        </button>

                        <button
                          disabled={updatingId === order.id}
                          onClick={() =>
                            handleCancel(order.id)
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {order.status === "CONFIRMED" && (
                      <button
                        disabled={updatingId === order.id}
                        onClick={() =>
                          handleStatusUpdate(
                            order.id,
                            "PROCESSING"
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {updatingId === order.id && (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        )}
                        Start Processing
                      </button>
                    )}

                    {order.status === "PROCESSING" && (
                      <button
                        disabled={updatingId === order.id}
                        onClick={() =>
                          handleStatusUpdate(
                            order.id,
                            "SHIPPED"
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {updatingId === order.id && (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        )}
                        Mark as Shipped
                      </button>
                    )}

                    {order.status === "SHIPPED" && (
                      <button
                        disabled={updatingId === order.id}
                        onClick={() =>
                          handleStatusUpdate(
                            order.id,
                            "DELIVERED"
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {updatingId === order.id && (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        )}
                        Mark as Delivered
                      </button>
                    )}

                    {["PENDING", "CONFIRMED", "PROCESSING"].includes(
                      order.status || ""
                    ) && (
                      <button
                        disabled={updatingId === order.id}
                        onClick={() =>
                          handleCancel(order.id)
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
