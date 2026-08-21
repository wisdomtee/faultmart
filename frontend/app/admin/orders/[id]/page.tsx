"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  Package,
  ShoppingBag,
  Store,
  Truck,
  User,
} from "lucide-react";

import { getAdminOrderById } from "@/lib/api";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  username?: string | null;
  email: string;
  phone?: string | null;
  profileImage?: string | null;
  status?: string;
  verificationStatus?: string;
  createdAt?: string;
}

interface Order {
  id: string;
  amount: string | number;
  currency: string;
  status: OrderStatus;
  shippingAddress?: string | null;
  createdAt: string;
  updatedAt: string;

  buyer: Person;
  seller: Person;

  listing: {
    id: string;
    title: string;
    slug: string;
    price: string | number;
    currency: string;
    description?: string | null;
    status?: string;
    createdAt?: string;
  };

  delivery?: {
    id: string;
    status: string;
    courier?: string | null;
    trackingCode?: string | null;
    pickupDate?: string | null;
    deliveredAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
  } | null;

  offer?: {
    id: string;
    amount: string | number;
    status: string;
    message?: string | null;
    createdAt: string;
    updatedAt?: string;
  } | null;

  reviews?: Array<{
    id: string;
    rating: number;
    comment?: string | null;
    type: string;
    createdAt: string;
    reviewer: Person;
    reviewee: Person;
  }>;
}

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const orderId = String(params.id);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrder() {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminOrderById(orderId);

      setOrder(response);
    } catch (err: any) {
      console.error("ADMIN ORDER DETAILS ERROR:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load order details."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

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

  function formatDate(date?: string | null) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-NG",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  }

  function getStatusClasses(status: string) {
    switch (status) {
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

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2
            size={24}
            className="animate-spin"
          />

          <span>Loading order details...</span>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Back to Orders
        </button>

        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          <AlertCircle
            size={22}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="font-semibold">
              Unable to load order
            </p>

            <p className="mt-1 text-sm">
              {error || "Order not found."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft size={17} />
            Back to Orders
          </button>

          <p className="text-sm font-medium text-emerald-600">
            FaultMart Administration
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Order Details
            </h1>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>

          <p className="mt-2 font-mono text-xs text-slate-400">
            {order.id}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-3">
              <ShoppingBag
                size={20}
                className="text-slate-700"
              />
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Order Amount
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900">
                {formatAmount(
                  order.amount,
                  order.currency
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-3">
              <CalendarDays
                size={20}
                className="text-slate-700"
              />
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Created
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-3">
              <Truck
                size={20}
                className="text-slate-700"
              />
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Delivery
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                {order.delivery?.status ||
                  "Not created"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Left */}
        <div className="space-y-6 xl:col-span-2">
          {/* Listing */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-100 p-3">
                  <Package
                    size={20}
                    className="text-slate-700"
                  />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Listing
                  </h2>

                  <p className="text-sm text-slate-500">
                    Product attached to this order
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <p className="text-lg font-bold text-slate-900">
                  {order.listing.title}
                </p>

                <p className="mt-1 font-mono text-xs text-slate-400">
                  {order.listing.id}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-400">
                    Listing Price
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {formatAmount(
                      order.listing.price,
                      order.listing.currency
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Listing Status
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {order.listing.status || "—"}
                  </p>
                </div>
              </div>

              {order.listing.description && (
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-400">
                    Description
                  </p>

                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                    {order.listing.description}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Buyer / Seller */}
          <div className="grid gap-6 md:grid-cols-2">
            <PersonCard
              title="Buyer"
              icon={<User size={20} />}
              person={order.buyer}
            />

            <PersonCard
              title="Seller"
              icon={<Store size={20} />}
              person={order.seller}
            />
          </div>

          {/* Delivery */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-100 p-3">
                  <Truck
                    size={20}
                    className="text-slate-700"
                  />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Delivery
                  </h2>

                  <p className="text-sm text-slate-500">
                    Delivery and tracking information
                  </p>
                </div>
              </div>
            </div>

            {order.delivery ? (
              <div className="grid gap-5 p-5 sm:grid-cols-2">
                <InfoItem
                  label="Status"
                  value={order.delivery.status}
                />

                <InfoItem
                  label="Courier"
                  value={
                    order.delivery.courier ||
                    "Not assigned"
                  }
                />

                <InfoItem
                  label="Tracking Code"
                  value={
                    order.delivery.trackingCode ||
                    "Not available"
                  }
                />

                <InfoItem
                  label="Pickup Date"
                  value={formatDate(
                    order.delivery.pickupDate
                  )}
                />

                <InfoItem
                  label="Delivered At"
                  value={formatDate(
                    order.delivery.deliveredAt
                  )}
                />
              </div>
            ) : (
              <div className="p-5 text-sm text-slate-500">
                No delivery record has been created for
                this order yet.
              </div>
            )}
          </section>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Order information */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h2 className="font-semibold text-slate-900">
                Order Information
              </h2>
            </div>

            <div className="space-y-4 p-5">
              <InfoItem
                label="Order ID"
                value={order.id}
                mono
              />

              <InfoItem
                label="Status"
                value={order.status}
              />

              <InfoItem
                label="Amount"
                value={formatAmount(
                  order.amount,
                  order.currency
                )}
              />

              <InfoItem
                label="Created"
                value={formatDate(order.createdAt)}
              />

              <InfoItem
                label="Last Updated"
                value={formatDate(order.updatedAt)}
              />

              <InfoItem
                label="Shipping Address"
                value={
                  order.shippingAddress ||
                  "Not provided"
                }
              />
            </div>
          </section>

          {/* Offer */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h2 className="font-semibold text-slate-900">
                Offer
              </h2>
            </div>

            {order.offer ? (
              <div className="space-y-4 p-5">
                <InfoItem
                  label="Offer Amount"
                  value={formatAmount(
                    order.offer.amount,
                    order.currency
                  )}
                />

                <InfoItem
                  label="Status"
                  value={order.offer.status}
                />

                <InfoItem
                  label="Created"
                  value={formatDate(
                    order.offer.createdAt
                  )}
                />

                {order.offer.message && (
                  <div>
                    <p className="text-xs text-slate-400">
                      Message
                    </p>

                    <p className="mt-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                      {order.offer.message}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-5 text-sm text-slate-500">
                This order was not created from an
                offer.
              </div>
            )}
          </section>

          {/* Reviews */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h2 className="font-semibold text-slate-900">
                Reviews
              </h2>
            </div>

            {order.reviews &&
            order.reviews.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {order.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {review.reviewer.firstName}{" "}
                          {review.reviewer.lastName}
                        </p>

                        <p className="text-xs text-slate-400">
                          {review.type}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-sm font-bold text-amber-600">
                        ★ {review.rating}/5
                      </div>
                    </div>

                    {review.comment && (
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {review.comment}
                      </p>
                    )}

                    <p className="mt-3 text-xs text-slate-400">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 text-sm text-slate-500">
                No reviews have been submitted for this
                order.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function PersonCard({
  title,
  icon,
  person,
}: {
  title: string;
  icon: React.ReactNode;
  person: Person;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
            {icon}
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              {title}
            </h2>

            <p className="text-sm text-slate-500">
              Account information
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <p className="text-base font-semibold text-slate-900">
            {person.firstName} {person.lastName}
          </p>

          {person.username && (
            <p className="mt-1 text-xs text-slate-400">
              @{person.username}
            </p>
          )}
        </div>

        <InfoItem
          label="Email"
          value={person.email}
        />

        <InfoItem
          label="Phone"
          value={person.phone || "Not provided"}
        />

        <div className="grid grid-cols-2 gap-4">
          <InfoItem
            label="Status"
            value={person.status || "—"}
          />

          <InfoItem
            label="Verification"
            value={
              person.verificationStatus || "—"
            }
          />
        </div>
      </div>
    </section>
  );
}

function InfoItem({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 break-words text-sm font-medium text-slate-800 ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}