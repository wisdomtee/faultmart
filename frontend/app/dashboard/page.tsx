"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Loader2,
  Package,
  Truck,
  XCircle,
} from "lucide-react";

import {
  getMyOrders,
  cancelOrder,
  updateOrderStatus,
  confirmReceipt,
} from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | string;

type OrderItem = {
  id?: string;
  listingId?: string;
  quantity?: number;
  price?: number | string;
  listing?: {
    id?: string;
    title?: string;
    slug?: string;
    images?: Array<{
      url?: string;
    }>;
  };
};

type Order = {
  id: string;
  status: OrderStatus;
  totalAmount?: number | string;
  total?: number | string;
  createdAt: string;
  updatedAt?: string;

  buyerId?: string;
  sellerId?: string;

  buyer?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };

  seller?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };

  items?: OrderItem[];

  listing?: {
    id?: string;
    title?: string;
    slug?: string;
    images?: Array<{
      url?: string;
    }>;
  };
};

type Tab = "ALL" | "BUYING" | "SELLING";

type ActionKey =
  | "cancel"
  | "confirm"
  | "processing"
  | "shipped"
  | "delivered"
  | "receipt";

const statusConfig: Record<
  string,
  {
    label: string;
    className: string;
  }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-blue-100 text-blue-800",
  },
  PROCESSING: {
    label: "Processing",
    className: "bg-purple-100 text-purple-800",
  },
  SHIPPED: {
    label: "Shipped",
    className: "bg-indigo-100 text-indigo-800",
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-green-100 text-green-800",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800",
  },
};

function formatCurrency(value: number | string | undefined) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getOrderTitle(order: Order) {
  if (order.items && order.items.length > 0) {
    return (
      order.items[0]?.listing?.title ||
      `Order ${order.id.slice(0, 8)}`
    );
  }

  return order.listing?.title || `Order ${order.id.slice(0, 8)}`;
}

function getOrderImage(order: Order) {
  if (order.items && order.items.length > 0) {
    return order.items[0]?.listing?.images?.[0]?.url;
  }

  return order.listing?.images?.[0]?.url;
}

function getCustomerName(order: Order, isBuyer: boolean) {
  const person = isBuyer ? order.seller : order.buyer;

  if (!person) return isBuyer ? "Seller" : "Buyer";

  const fullName = `${person.firstName ?? ""} ${
    person.lastName ?? ""
  }`.trim();

  return fullName || person.email || (isBuyer ? "Seller" : "Buyer");
}

export default function OrdersPage() {
  const { user } = useAuthStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] = useState<{
    orderId: string;
    action: ActionKey;
  } | null>(null);

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const currentUserId = user?.id;

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyOrders();

      const data = Array.isArray(response)
        ? response
        : response?.data ?? [];

      setOrders(data as Order[]);
    } catch (err: any) {
      console.error("Failed to load orders:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      loadOrders();
    }
  }, [currentUserId]);

  const getRole = (order: Order) => {
    if (!currentUserId) {
      return {
        isBuyer: false,
        isSeller: false,
      };
    }

    const isBuyer =
      order.buyerId === currentUserId ||
      order.buyer?.id === currentUserId;

    const isSeller =
      order.sellerId === currentUserId ||
      order.seller?.id === currentUserId;

    return {
      isBuyer,
      isSeller,
    };
  };

  const filteredOrders = useMemo(() => {
    if (activeTab === "ALL") {
      return orders;
    }

    return orders.filter((order) => {
      const { isBuyer, isSeller } = getRole(order);

      if (activeTab === "BUYING") {
        return isBuyer;
      }

      if (activeTab === "SELLING") {
        return isSeller;
      }

      return true;
    });
  }, [orders, activeTab, currentUserId]);

  const counts = useMemo(() => {
    let buying = 0;
    let selling = 0;

    orders.forEach((order) => {
      const { isBuyer, isSeller } = getRole(order);

      if (isBuyer) buying += 1;
      if (isSeller) selling += 1;
    });

    return {
      all: orders.length,
      buying,
      selling,
    };
  }, [orders, currentUserId]);

  const runAction = async (
    orderId: string,
    action: ActionKey,
    actionFn: () => Promise<any>
  ) => {
    try {
      setActionLoading({
        orderId,
        action,
      });

      setError("");

      await actionFn();

      await loadOrders();
    } catch (err: any) {
      console.error(`Order ${action} failed:`, err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to complete this action."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = (order: Order) => {
    runAction(order.id, "cancel", () => cancelOrder(order.id));
  };

  const handleConfirm = (order: Order) => {
    runAction(order.id, "confirm", () => updateOrderStatus(order.id, "CONFIRMED"))
  };

  const handleProcessing = (order: Order) => {
    runAction(order.id, "processing", () =>
      updateOrderStatus(order.id, "PROCESSING")
    );
  };

  const handleShipped = (order: Order) => {
    runAction(order.id, "shipped", () =>
      updateOrderStatus(order.id, "SHIPPED")
    );
  };

  const handleDelivered = (order: Order) => {
    runAction(order.id, "delivered", () =>
      updateOrderStatus(order.id, "DELIVERED")
    );
  };

  const handleReceipt = (order: Order) => {
    runAction(order.id, "receipt", () =>
      confirmReceipt(order.id)
    );
  };

  const isActionLoading = (
    orderId: string,
    action: ActionKey
  ) => {
    return (
      actionLoading?.orderId === orderId &&
      actionLoading?.action === action
    );
  };

  const renderActions = (order: Order) => {
    const { isBuyer, isSeller } = getRole(order);

    const status = order.status;

    /*
     * BUYER ACTIONS
     *
     * Buyer can cancel only while the order is PENDING.
     *
     * Buyer can confirm receipt after the seller has marked
     * the order as delivered.
     */
    if (isBuyer) {
      return (
        <div className="flex flex-wrap gap-2">
          {status === "PENDING" && (
            <button
              type="button"
              onClick={() => handleCancel(order)}
              disabled={!!actionLoading}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isActionLoading(order.id, "cancel") ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}

              Cancel Order
            </button>
          )}

          {status === "DELIVERED" && (
            <button
              type="button"
              onClick={() => handleReceipt(order)}
              disabled={!!actionLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isActionLoading(order.id, "receipt") ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}

              Confirm Receipt
            </button>
          )}
        </div>
      );
    }

    /*
     * SELLER ACTIONS
     *
     * PENDING     -> Confirm Order
     * CONFIRMED   -> Start Processing
     * PROCESSING  -> Mark as Shipped
     * SHIPPED     -> Mark as Delivered
     */
    if (isSeller) {
      return (
        <div className="flex flex-wrap gap-2">
          {status === "PENDING" && (
            <button
              type="button"
              onClick={() => handleConfirm(order)}
              disabled={!!actionLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isActionLoading(order.id, "confirm") ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}

              Confirm Order
            </button>
          )}

          {status === "CONFIRMED" && (
            <button
              type="button"
              onClick={() => handleProcessing(order)}
              disabled={!!actionLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isActionLoading(order.id, "processing") ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Package className="h-4 w-4" />
              )}

              Start Processing
            </button>
          )}

          {status === "PROCESSING" && (
            <button
              type="button"
              onClick={() => handleShipped(order)}
              disabled={!!actionLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isActionLoading(order.id, "shipped") ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Truck className="h-4 w-4" />
              )}

              Mark as Shipped
            </button>
          )}

          {status === "SHIPPED" && (
            <button
              type="button"
              onClick={() => handleDelivered(order)}
              disabled={!!actionLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isActionLoading(order.id, "delivered") ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}

              Mark as Delivered
            </button>
          )}
        </div>
      );
    }

    return null;
  };

  if (!currentUserId) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Orders
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your purchases and sales.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div className="flex-1">
            <p className="text-sm font-medium">{error}</p>
          </div>

          <button
            type="button"
            onClick={() => setError("")}
            className="text-sm font-medium text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex min-w-max gap-2 rounded-xl border border-gray-200 bg-white p-1">
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === "ALL"
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            All Orders ({counts.all})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("BUYING")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === "BUYING"
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Buying ({counts.buying})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("SELLING")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === "SELLING"
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Selling ({counts.selling})
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-gray-200 bg-white">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />

            <p className="text-sm text-gray-500">
              Loading orders...
            </p>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        /* Empty state */
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 text-center">
          <div className="mb-4 rounded-full bg-gray-100 p-4">
            <Package className="h-8 w-8 text-gray-500" />
          </div>

          <h2 className="text-lg font-semibold text-gray-900">
            No orders found
          </h2>

          <p className="mt-1 max-w-md text-sm text-gray-500">
            {activeTab === "BUYING"
              ? "You don't have any purchases yet."
              : activeTab === "SELLING"
              ? "You don't have any sales yet."
              : "You don't have any orders yet."}
          </p>
        </div>
      ) : (
        /* Orders */
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const { isBuyer, isSeller } = getRole(order);

            const image = getOrderImage(order);

            const isExpanded =
              expandedOrder === order.id;

            const status =
              statusConfig[order.status] ??
              {
                label: order.status,
                className:
                  "bg-gray-100 text-gray-800",
              };

            const orderTotal =
              order.totalAmount ?? order.total ?? 0;

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                {/* Order header */}
                <div className="flex flex-col gap-4 p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 gap-4">
                      {/* Image */}
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        {image ? (
                          <img
                            src={image}
                            alt={getOrderTitle(order)}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Package className="h-7 w-7 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Main info */}
                      <div className="min-w-0">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                          >
                            {status.label}
                          </span>

                          {isBuyer && (
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                              Purchase
                            </span>
                          )}

                          {isSeller && (
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                              Sale
                            </span>
                          )}
                        </div>

                        <h2 className="truncate text-base font-semibold text-gray-900 sm:text-lg">
                          {getOrderTitle(order)}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          Order #{order.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="shrink-0 sm:text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(orderTotal)}
                      </p>

                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-500 sm:justify-end">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Buyer / Seller info */}
                  <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-100 pt-4 text-sm">
                    <div>
                      <span className="text-gray-500">
                        {isBuyer ? "Seller" : "Buyer"}:
                      </span>{" "}
                      <span className="font-medium text-gray-900">
                        {getCustomerName(order, isBuyer)}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-500">
                        Items:
                      </span>{" "}
                      <span className="font-medium text-gray-900">
                        {order.items?.length ?? 1}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>{renderActions(order)}</div>

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedOrder(
                          isExpanded ? null : order.id
                        )
                      }
                      className="inline-flex items-center gap-2 self-start rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:self-auto"
                    >
                      {isExpanded
                        ? "Hide Details"
                        : "View Details"}

                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          isExpanded
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4 sm:p-5">
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Order information */}
                      <div>
                        <h3 className="mb-3 text-sm font-semibold text-gray-900">
                          Order Information
                        </h3>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between gap-4">
                            <span className="text-gray-500">
                              Order ID
                            </span>

                            <span className="break-all text-right font-medium text-gray-900">
                              {order.id}
                            </span>
                          </div>

                          <div className="flex justify-between gap-4">
                            <span className="text-gray-500">
                              Status
                            </span>

                            <span className="font-medium text-gray-900">
                              {status.label}
                            </span>
                          </div>

                          <div className="flex justify-between gap-4">
                            <span className="text-gray-500">
                              Created
                            </span>

                            <span className="font-medium text-gray-900">
                              {formatDate(order.createdAt)}
                            </span>
                          </div>

                          {order.updatedAt && (
                            <div className="flex justify-between gap-4">
                              <span className="text-gray-500">
                                Last Updated
                              </span>

                              <span className="font-medium text-gray-900">
                                {formatDate(
                                  order.updatedAt
                                )}
                              </span>
                            </div>
                          )}

                          <div className="flex justify-between gap-4 border-t border-gray-200 pt-2">
                            <span className="font-medium text-gray-700">
                              Total
                            </span>

                            <span className="font-bold text-gray-900">
                              {formatCurrency(orderTotal)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div>
                        <h3 className="mb-3 text-sm font-semibold text-gray-900">
                          Items
                        </h3>

                        {order.items &&
                        order.items.length > 0 ? (
                          <div className="space-y-3">
                            {order.items.map(
                              (item, index) => (
                                <div
                                  key={
                                    item.id ??
                                    `${order.id}-${index}`
                                  }
                                  className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-3"
                                >
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-gray-900">
                                      {item.listing
                                        ?.title ||
                                        "Listing"}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                      Quantity:{" "}
                                      {item.quantity ??
                                        1}
                                    </p>
                                  </div>

                                  {item.price !==
                                    undefined && (
                                    <span className="shrink-0 text-sm font-semibold text-gray-900">
                                      {formatCurrency(
                                        item.price
                                      )}
                                    </span>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-500">
                            No item details available.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status timeline */}
                    <div className="mt-6 border-t border-gray-200 pt-5">
                      <h3 className="mb-4 text-sm font-semibold text-gray-900">
                        Order Progress
                      </h3>

                      <div className="flex flex-wrap gap-3">
                        <StatusStep
                          label="Pending"
                          active={[
                            "PENDING",
                            "CONFIRMED",
                            "PROCESSING",
                            "SHIPPED",
                            "DELIVERED",
                          ].includes(order.status)}
                        />

                        <StatusStep
                          label="Confirmed"
                          active={[
                            "CONFIRMED",
                            "PROCESSING",
                            "SHIPPED",
                            "DELIVERED",
                          ].includes(order.status)}
                        />

                        <StatusStep
                          label="Processing"
                          active={[
                            "PROCESSING",
                            "SHIPPED",
                            "DELIVERED",
                          ].includes(order.status)}
                        />

                        <StatusStep
                          label="Shipped"
                          active={[
                            "SHIPPED",
                            "DELIVERED",
                          ].includes(order.status)}
                        />

                        <StatusStep
                          label="Delivered"
                          active={
                            order.status === "DELIVERED"
                          }
                        />

                        {order.status ===
                          "CANCELLED" && (
                          <StatusStep
                            label="Cancelled"
                            active
                            cancelled
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusStep({
  label,
  active,
  cancelled = false,
}: {
  label: string;
  active: boolean;
  cancelled?: boolean;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
        cancelled
          ? "border-red-200 bg-red-50 text-red-700"
          : active
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-gray-200 bg-white text-gray-400"
      }`}
    >
      {cancelled ? (
        <XCircle className="h-3.5 w-3.5" />
      ) : active ? (
        <CheckCircle2 className="h-3.5 w-3.5" />
      ) : (
        <Clock3 className="h-3.5 w-3.5" />
      )}

      {label}
    </div>
  );
}