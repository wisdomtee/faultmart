"use client";

import {
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  Truck,
  XCircle,
} from "lucide-react";

interface DeliveryBuyer {
  firstName?: string | null;
  lastName?: string | null;
}

interface DeliveryListing {
  title?: string | null;
  images?: {
    url?: string | null;
  }[];
}

interface DeliveryOrder {
  id?: string | null;
  buyer?: DeliveryBuyer | null;
  listing?: DeliveryListing | null;
}

interface Delivery {
  id: string;
  status?: string | null;
  createdAt?: string | null;
  trackingNumber?: string | null;
  estimatedDelivery?: string | null;
  deliveredAt?: string | null;
  address?: string | null;
  order?: DeliveryOrder | null;
}

interface DeliveriesProps {
  deliveries: Delivery[];
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

  IN_TRANSIT: {
    label: "In Transit",
    className: "bg-indigo-50 text-indigo-700",
    icon: Truck,
  },

  SHIPPED: {
    label: "Shipped",
    className: "bg-indigo-50 text-indigo-700",
    icon: Truck,
  },

  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    className: "bg-orange-50 text-orange-700",
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
  const normalizedStatus = status?.toUpperCase() || "PROCESSING";

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

export default function Deliveries({
  deliveries,
}: DeliveriesProps) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">
            Deliveries
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Recent delivery activity
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
          {deliveries.length}{" "}
          {deliveries.length === 1 ? "delivery" : "deliveries"}
        </span>
      </div>

      {/* Empty state */}
      {deliveries.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl bg-neutral-50 px-6 py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
            <Truck className="h-5 w-5 text-neutral-400" />
          </div>

          <p className="mt-4 text-sm font-medium text-neutral-700">
            No delivery activity yet
          </p>

          <p className="mt-1 max-w-sm text-xs text-neutral-500">
            Delivery information will appear here when your orders
            begin moving through the delivery process.
          </p>
        </div>
      ) : (
        /* Deliveries */
        <div className="mt-6 divide-y divide-neutral-100">
          {deliveries.map((delivery) => {
            const buyerName = [
              delivery.order?.buyer?.firstName,
              delivery.order?.buyer?.lastName,
            ]
              .filter(Boolean)
              .join(" ");

            const status = getStatusConfig(delivery.status);
            const StatusIcon = status.icon;

            const listingImage =
              delivery.order?.listing?.images?.[0]?.url;

            return (
              <div
                key={delivery.id}
                className="group flex flex-col gap-4 py-4 transition first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Left */}
                <div className="flex min-w-0 items-center gap-3">
                  {/* Listing image */}
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                    {listingImage ? (
                      <img
                        src={listingImage}
                        alt={
                          delivery.order?.listing?.title ||
                          "Listing"
                        }
                        className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-5 w-5 text-neutral-400" />
                      </div>
                    )}
                  </div>

                  {/* Delivery information */}
                  <div className="min-w-0">
                    <p className="truncate font-medium text-neutral-900">
                      {delivery.order?.listing?.title ||
                        "Order delivery"}
                    </p>

                    <p className="mt-0.5 truncate text-sm text-neutral-500">
                      {buyerName || "Customer"}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-400">
                      {delivery.order?.id && (
                        <span>
                          Order #
                          {delivery.order.id.slice(0, 8)}
                        </span>
                      )}

                      {delivery.createdAt && (
                        <>
                          <span className="hidden sm:inline">
                            •
                          </span>

                          <span>
                            {formatDate(delivery.createdAt)}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Tracking */}
                    {delivery.trackingNumber && (
                      <p className="mt-1 truncate text-xs text-neutral-400">
                        Tracking: {delivery.trackingNumber}
                      </p>
                    )}

                    {/* Address */}
                    {delivery.address && (
                      <div className="mt-1 flex min-w-0 items-center gap-1 text-xs text-neutral-400">
                        <MapPin className="h-3 w-3 shrink-0" />

                        <span className="truncate">
                          {delivery.address}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center justify-between gap-4 pl-15 sm:justify-end sm:pl-0">
                  <div>
                    <div
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />

                      <span>{status.label}</span>
                    </div>

                    {delivery.estimatedDelivery && (
                      <p className="mt-1 text-right text-xs text-neutral-400">
                        ETA{" "}
                        {formatDate(
                          delivery.estimatedDelivery
                        )}
                      </p>
                    )}

                    {delivery.deliveredAt && (
                      <p className="mt-1 text-right text-xs text-emerald-600">
                        Delivered{" "}
                        {formatDate(delivery.deliveredAt)}
                      </p>
                    )}
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