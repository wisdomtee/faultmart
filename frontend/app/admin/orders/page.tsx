"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  User,
  Store,
  Package,
  Truck,
} from "lucide-react";

import { getAdminOrders } from "@/lib/api";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

interface Order {
  id: string;
  amount: string | number;
  currency: string;
  status: OrderStatus;
  createdAt: string;

  buyer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  seller: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  listing: {
    id: string;
    title: string;
    slug: string;
    price: string | number;
    currency: string;
  };

  delivery?: {
    id: string;
    status: string;
    courier?: string | null;
    trackingCode?: string | null;
    pickupDate?: string | null;
    deliveredAt?: string | null;
  } | null;

  offer?: {
    id: string;
    amount: string | number;
    status: string;
    createdAt: string;
  } | null;
}

interface OrdersResponse {
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] =
    useState<OrdersResponse["pagination"] | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<
    "" | OrderStatus
  >("");

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminOrders({
        page,
        limit: 10,
        search: search.trim() || undefined,
        status: status || undefined,
      });

      setOrders(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      console.error("ADMIN ORDERS ERROR:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, [page, status]);

  function handleSearchSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setPage(1);
    loadOrders();
  }

  function getStatusClasses(
    orderStatus: OrderStatus
  ) {
    switch (orderStatus) {
      case "PENDING":
        return "bg-amber-100 text-amber-700";

      case "CONFIRMED":
        return "bg-blue-100 text-blue-700";

      case "PROCESSING":
        return "bg-purple-100 text-purple-700";

      case "SHIPPED":
        return "bg-indigo-100 text-indigo-700";

      case "DELIVERED":
        return "bg-emerald-100 text-emerald-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  function formatAmount(
    amount: string | number,
    currency: string
  ) {
    const numericAmount = Number(amount);

    return `${currency} ${numericAmount.toLocaleString(
      "en-NG",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString(
      "en-NG",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <p className="text-sm font-medium text-emerald-600">
          FaultMart Administration
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Orders
        </h1>

        <p className="mt-2 text-slate-500">
          Monitor and manage marketplace orders.
        </p>
      </div>

      {/* Search / Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col gap-4 lg:flex-row"
        >
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search order, buyer, seller or listing..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <select
            value={status}
            onChange={(event) => {
              setStatus(
                event.target.value as
                  | ""
                  | OrderStatus
              );
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">
              All statuses
            </option>

            <option value="PENDING">
              Pending
            </option>

            <option value="CONFIRMED">
              Confirmed
            </option>

            <option value="PROCESSING">
              Processing
            </option>

            <option value="SHIPPED">
              Shipped
            </option>

            <option value="DELIVERED">
              Delivered
            </option>

            <option value="CANCELLED">
              Cancelled
            </option>
          </select>

          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Search
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="font-semibold">
              Unable to complete request
            </p>

            <p className="mt-1 text-sm">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Orders */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Table Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-3">
              <ShoppingBag
                size={22}
                className="text-slate-700"
              />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                All Orders
              </h2>

              <p className="text-sm text-slate-500">
                {pagination
                  ? `${pagination.total} orders`
                  : "Loading orders..."}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex items-center gap-3 text-slate-500">
              <Loader2
                size={22}
                className="animate-spin"
              />

              <span>
                Loading orders...
              </span>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
            <div className="rounded-full bg-slate-100 p-4">
              <ShoppingBag
                size={28}
                className="text-slate-400"
              />
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              No orders found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or status filter.
            </p>
          </div>
        ) : (
  <>
    {/* Desktop Table */}
    <div className="hidden overflow-x-auto lg:block">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
            <th className="px-5 py-4">Order</th>
            <th className="px-5 py-4">Listing</th>
            <th className="px-5 py-4">Buyer</th>
            <th className="px-5 py-4">Seller</th>
            <th className="px-5 py-4">Amount</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Delivery</th>
            <th className="px-5 py-4">Date</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-slate-100 transition hover:bg-slate-50"
            >
              <td className="px-5 py-5">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="block max-w-[150px]"
                >
                  <p className="truncate font-mono text-xs font-semibold text-slate-900 hover:text-emerald-600">
                    {order.id}
                  </p>

                  {order.offer && (
                    <p className="mt-1 text-xs text-emerald-600">
                      Offer order
                    </p>
                  )}
                </Link>
              </td>

              <td className="px-5 py-5">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="flex items-start gap-2"
                >
                  <Package
                    size={17}
                    className="mt-0.5 shrink-0 text-slate-400"
                  />

                  <div className="max-w-[200px]">
                    <p className="truncate text-sm font-semibold text-slate-900 hover:text-emerald-600">
                      {order.listing.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatAmount(
                        order.listing.price,
                        order.listing.currency
                      )}
                    </p>
                  </div>
                </Link>
              </td>

              <td className="px-5 py-5">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="flex items-start gap-2"
                >
                  <User
                    size={16}
                    className="mt-0.5 shrink-0 text-slate-400"
                  />

                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {order.buyer.firstName}{" "}
                      {order.buyer.lastName}
                    </p>

                    <p className="text-xs text-slate-500">
                      {order.buyer.email}
                    </p>
                  </div>
                </Link>
              </td>

              <td className="px-5 py-5">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="flex items-start gap-2"
                >
                  <Store
                    size={16}
                    className="mt-0.5 shrink-0 text-slate-400"
                  />

                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {order.seller.firstName}{" "}
                      {order.seller.lastName}
                    </p>

                    <p className="text-xs text-slate-500">
                      {order.seller.email}
                    </p>
                  </div>
                </Link>
              </td>

              <td className="whitespace-nowrap px-5 py-5">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="block"
                >
                  <p className="text-sm font-bold text-slate-900">
                    {formatAmount(
                      order.amount,
                      order.currency
                    )}
                  </p>

                  {order.offer && (
                    <p className="mt-1 text-xs text-slate-500">
                      Offer:{" "}
                      {formatAmount(
                        order.offer.amount,
                        order.currency
                      )}
                    </p>
                  )}
                </Link>
              </td>

              <td className="px-5 py-5">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="inline-block"
                >
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </Link>
              </td>

              <td className="px-5 py-5">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center gap-2"
                >
                  <Truck
                    size={16}
                    className="text-slate-400"
                  />

                  <span className="text-xs font-medium text-slate-600">
                    {order.delivery?.status ||
                      "Not created"}
                  </span>
                </Link>
              </td>

              <td className="whitespace-nowrap px-5 py-5 text-sm text-slate-500">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="block"
                >
                  {formatDate(order.createdAt)}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Mobile Cards */}
    <div className="divide-y divide-slate-100 lg:hidden">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/admin/orders/${order.id}`}
          className="block space-y-4 p-5 transition hover:bg-slate-50"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-semibold text-slate-900">
                #{order.id.slice(0, 8)}
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                {order.listing.title}
              </p>
            </div>

            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400">
                Buyer
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {order.buyer.firstName}{" "}
                {order.buyer.lastName}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Seller
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {order.seller.firstName}{" "}
                {order.seller.lastName}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <p className="text-xs text-slate-400">
                Amount
              </p>

              <p className="mt-1 font-bold text-slate-900">
                {formatAmount(
                  order.amount,
                  order.currency
                )}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-400">
                Delivery
              </p>

              <p className="mt-1 text-sm font-medium text-slate-700">
                {order.delivery?.status ||
                  "Not created"}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            {formatDate(order.createdAt)}
          </p>
        </Link>
      ))}
    </div>

    {/* Pagination */}
    {pagination && pagination.pages > 1 && (
      <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
        <p className="text-sm text-slate-500">
          Page {pagination.page} of{" "}
          {pagination.pages}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() =>
              setPage((current) =>
                Math.max(1, current - 1)
              )
            }
            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            disabled={
              page >= pagination.pages
            }
            onClick={() =>
              setPage((current) =>
                Math.min(
                  pagination.pages,
                  current + 1
                )
              )
            }
            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
              <ChevronRight size={18} />
            </button>
                    </div>
        </div>
      )}
    </>
  )}
      </div>
    </div>
  );
}