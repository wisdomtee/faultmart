"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Loader2,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";

import {
  getAdminListings,
  approveListing,
  rejectListing,
} from "@/lib/api";

type ListingStatus =
  | "DRAFT"
  | "PENDING"
  | "ACTIVE"
  | "SOLD"
  | "RESERVED"
  | "EXPIRED"
  | "REJECTED"
  | "ARCHIVED";

interface Listing {
  id: string;
  sellerId: string;
  categoryId: string;
  title: string;
  slug: string;
  description?: string | null;
  price: number | string;
  currency?: string;
  condition?: string | null;
  faultSeverity?: string | null;
  status: ListingStatus;
  location?: string | null;
  state?: string | null;
  city?: string | null;
  createdAt: string;
  updatedAt: string;

  seller?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  } | null;

  images?: {
    id: string;
    url: string;
    position?: number;
  }[];
}

interface ListingsResponse {
  data: Listing[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const STATUS_OPTIONS: {
  value: ListingStatus | "ALL";
  label: string;
}[] = [
  {
    value: "ALL",
    label: "All Listings",
  },
  {
    value: "PENDING",
    label: "Pending",
  },
  {
    value: "ACTIVE",
    label: "Active",
  },
  {
    value: "REJECTED",
    label: "Rejected",
  },
  {
    value: "SOLD",
    label: "Sold",
  },
];

function formatDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Unknown date";
  }

  return parsed.toLocaleString();
}

function formatPrice(
  price: number | string,
  currency = "NGN"
) {
  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return `${currency} ${price}`;
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(numericPrice);
}

function getSellerName(
  seller?: Listing["seller"]
) {
  if (!seller) {
    return "Unknown seller";
  }

  const name = [
    seller.firstName,
    seller.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return name || seller.email || "Unknown seller";
}

function getStatusLabel(status: ListingStatus) {
  switch (status) {
    case "DRAFT":
      return "Draft";

    case "PENDING":
      return "Pending";

    case "ACTIVE":
      return "Active";

    case "SOLD":
      return "Sold";

    case "RESERVED":
      return "Reserved";

    case "EXPIRED":
      return "Expired";

    case "REJECTED":
      return "Rejected";

    case "ARCHIVED":
      return "Archived";

    default:
      return status;
  }
}

function getStatusClasses(status: ListingStatus) {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "ACTIVE":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "SOLD":
      return "bg-slate-100 text-slate-700 border-slate-200";

    case "REJECTED":
      return "bg-red-50 text-red-700 border-red-200";

    case "RESERVED":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "EXPIRED":
      return "bg-orange-50 text-orange-700 border-orange-200";

    case "ARCHIVED":
      return "bg-slate-100 text-slate-500 border-slate-200";

    case "DRAFT":
      return "bg-purple-50 text-purple-700 border-purple-200";

    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

function getListingLocation(listing: Listing) {
  return (
    listing.city ||
    listing.state ||
    listing.location ||
    "Location unavailable"
  );
}

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>(
    []
  );

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [searchInput, setSearchInput] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<ListingStatus | "ALL">("ALL");

  const [page, setPage] =
    useState(1);

  const [pagination, setPagination] =
    useState<
      ListingsResponse["pagination"] | null
    >(null);

  const limit = 20;

  async function loadListings(showRefresh = false) {
  try {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    const response = await getAdminListings({
      page,
      limit,
      ...(search.trim()
        ? {
            search: search.trim(),
          }
        : {}),
      ...(statusFilter !== "ALL"
        ? {
            status: statusFilter,
          }
        : {}),
    });

    setListings(response.data || []);

    setPagination(response.pagination || null);
  } catch (error: unknown) {
    console.error("ADMIN LISTINGS ERROR:", error);

    const message =
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof error.response === "object" &&
      error.response !== null &&
      "data" in error.response &&
      typeof error.response.data === "object" &&
      error.response.data !== null &&
      "message" in error.response.data &&
      typeof error.response.data.message === "string"
        ? error.response.data.message
        : "Failed to load listings.";

    setError(message);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
}

useEffect(() => {
  let cancelled = false;

  async function fetchListings() {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminListings({
        page,
        limit,
        ...(search.trim()
          ? { search: search.trim() }
          : {}),
        ...(statusFilter !== "ALL"
          ? { status: statusFilter }
          : {}),
      });

      if (cancelled) return;

      setListings(response.data || []);
      setPagination(response.pagination || null);
    } catch (error: unknown) {
      if (cancelled) return;

      console.error("ADMIN LISTINGS ERROR:", error);

      setError("Failed to load listings.");
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  void fetchListings();

  return () => {
    cancelled = true;
  };
}, [page, search, statusFilter]);
  function handleSearchSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setPage(1);
    setSearch(searchInput);
  }

  function handleFilterChange(
    value: ListingStatus | "ALL"
  ) {
    setStatusFilter(value);
    setPage(1);
  }

  async function handleApprove(
    listingId: string
  ) {
    try {
      setUpdatingId(listingId);
      setError("");

      const updated =
        await approveListing(listingId);

      setListings((current) =>
        current.map((listing) =>
          listing.id === listingId
            ? {
                ...listing,
                ...updated,
                status: "ACTIVE",
              }
            : listing
        )
      );
    } catch (error: unknown) {
  console.error(
    "REJECT LISTING ERROR:",
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
      "Failed to reject listing."
  );
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleReject(
    listingId: string
  ) {
    try {
      setUpdatingId(listingId);
      setError("");

      const updated =
        await rejectListing(listingId);

      setListings((current) =>
        current.map((listing) =>
          listing.id === listingId
            ? {
                ...listing,
                ...updated,
                status: "REJECTED",
              }
            : listing
        )
      );
    } catch (error: unknown) {
  console.error(
    "REJECT LISTING ERROR:",
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
      "Failed to reject listing."
  );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-orange-600">
            Marketplace Moderation
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Listings
          </h1>

          <p className="mt-2 text-slate-500">
            Review marketplace listings and
            manage their approval status.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            loadListings(true)
          }
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

          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Listings
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {pagination?.total ?? 0}
              </p>
            </div>

            <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
              <Eye size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Pending
              </p>

              <p className="mt-2 text-2xl font-bold text-amber-600">
                {statusFilter === "PENDING"
                  ? listings.length
                  : "—"}
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <Clock size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Active
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-600">
                {statusFilter === "ACTIVE"
                  ? listings.length
                  : "—"}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle2 size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Rejected
              </p>

              <p className="mt-2 text-2xl font-bold text-red-600">
                {statusFilter === "REJECTED"
                  ? listings.length
                  : "—"}
              </p>
            </div>

            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <XCircle size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-3 text-red-700">
            <AlertCircle size={20} />

            <p className="text-sm font-medium">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Search + Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(
                    event.target.value
                  )
                }
                placeholder="Search listings by title..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Search size={16} />
              Search
            </button>
          </form>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <span className="text-sm font-semibold text-slate-700">
              Filter listings
            </span>

            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map(
                (option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      handleFilterChange(
                        option.value
                      )
                    }
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      statusFilter ===
                      option.value
                        ? "bg-orange-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {option.label}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[350px] items-center justify-center">
            <div className="flex items-center gap-3 text-slate-600">
              <Loader2
                size={24}
                className="animate-spin"
              />

              <span className="font-medium">
                Loading listings...
              </span>
            </div>
          </div>
        ) : listings.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
            <div className="rounded-full bg-slate-100 p-4 text-slate-400">
              <Eye size={28} />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No listings found
            </h2>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              There are no listings matching
              the selected search or filter.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Listing
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Seller
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Price
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Location
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {listings.map(
                    (listing) => {
                      const image =
                        listing.images &&
                        listing.images.length >
                          0
                          ? listing.images[0]
                              .url
                          : null;

                      return (
                        <tr
                          key={listing.id}
                          className="transition hover:bg-slate-50"
                        >
                          {/* Listing */}
                          <td className="px-6 py-5">
                            <div className="flex min-w-[280px] items-center gap-4">
                              <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                                {image ? (
                                  <img
                                    src={image}
                                    alt={
                                      listing.title
                                    }
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center text-xs text-slate-400">
                                    No image
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="line-clamp-2 font-semibold text-slate-900">
                                  {listing.title}
                                </p>

                                {listing.condition && (
                                  <p className="mt-1 text-xs text-slate-500">
                                    {listing.condition.replace(
                                      "_",
                                      " "
                                    )}
                                  </p>
                                )}

                                <p className="mt-1 font-mono text-xs text-slate-400">
                                  #
                                  {listing.id.slice(
                                    0,
                                    8
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Seller */}
                          <td className="px-6 py-5">
                            <div>
                              <p className="font-medium text-slate-900">
                                {getSellerName(
                                  listing.seller
                                )}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {
                                  listing
                                    .seller
                                    ?.email
                                }
                              </p>
                            </div>
                          </td>

                          {/* Price */}
                          <td className="whitespace-nowrap px-6 py-5">
                            <p className="font-semibold text-slate-900">
                              {formatPrice(
                                listing.price,
                                listing.currency
                              )}
                            </p>
                          </td>

                          {/* Location */}
                          <td className="px-6 py-5">
                            <p className="max-w-[160px] truncate text-sm text-slate-600">
                              {getListingLocation(
                                listing
                              )}
                            </p>
                          </td>

                          {/* Date */}
                          <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-500">
                            {formatDate(
                              listing.createdAt
                            )}
                          </td>

                          {/* Status */}
                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                listing.status
                              )}`}
                            >
                              {getStatusLabel(
                                listing.status
                              )}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {listing.status ===
                                "PENDING" && (
                                <>
                                  <button
                                    type="button"
                                    disabled={
                                      updatingId ===
                                      listing.id
                                    }
                                    onClick={() =>
                                      handleApprove(
                                        listing.id
                                      )
                                    }
                                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    {updatingId ===
                                    listing.id ? (
                                      <Loader2
                                        size={14}
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <CheckCircle2
                                        size={14}
                                      />
                                    )}

                                    Approve
                                  </button>

                                  <button
                                    type="button"
                                    disabled={
                                      updatingId ===
                                      listing.id
                                    }
                                    onClick={() =>
                                      handleReject(
                                        listing.id
                                      )
                                    }
                                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    {updatingId ===
                                    listing.id ? (
                                      <Loader2
                                        size={14}
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <XCircle
                                        size={14}
                                      />
                                    )}

                                    Reject
                                  </button>
                                </>
                              )}

                              {listing.status ===
                                "ACTIVE" && (
                                <span className="text-xs font-medium text-emerald-600">
                                  Approved
                                </span>
                              )}

                              {listing.status ===
                                "REJECTED" && (
                                <span className="text-xs font-medium text-red-500">
                                  Rejected
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination &&
              pagination.pages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
                  <p className="text-sm text-slate-500">
                    Page{" "}
                    <span className="font-semibold text-slate-700">
                      {pagination.page}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-700">
                      {pagination.pages}
                    </span>
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={
                        pagination.page <= 1
                      }
                      onClick={() =>
                        setPage(
                          (current) =>
                            Math.max(
                              1,
                              current - 1
                            )
                        )
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft
                        size={16}
                      />

                      Previous
                    </button>

                    <button
                      type="button"
                      disabled={
                        pagination.page >=
                        pagination.pages
                      }
                      onClick={() =>
                        setPage(
                          (current) =>
                            Math.min(
                              pagination.pages,
                              current + 1
                            )
                        )
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next

                      <ChevronRight
                        size={16}
                      />
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