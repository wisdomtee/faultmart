"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  AlertCircle,
  Package,
  Eye,
  Heart,
  Tag,
  Pencil,
  Trash2,
  ArrowUpRight,
  Plus,
  RefreshCw,
} from "lucide-react";

import {
  getMyListings,
  deleteListing,
} from "@/lib/api";

interface ListingImage {
  id?: string;
  url: string;
  publicId?: string | null;
  position?: number;
}

interface Listing {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  price?: number | string | null;
  currency?: string;
  status?: string;
  condition?: string;
  faultSeverity?: string;
  location?: string;
  state?: string;
  city?: string;
  views?: number;
  isNegotiable?: boolean;
  createdAt?: string;
  updatedAt?: string;

  images?: ListingImage[];

  category?: {
    id: string;
    name: string;
    slug?: string;
  };
}

function formatCurrency(
  value: number | string | null | undefined
) {
  return `₦${Number(value ?? 0).toLocaleString("en-NG")}`;
}

function formatDate(value?: string) {
  if (!value) return "—";

  return new Date(value).toLocaleDateString(
    "en-NG",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

function formatStatus(status?: string) {
  if (!status) return "Unknown";

  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

function getStatusClasses(status?: string) {
  const normalized = status?.toLowerCase();

  if (
    normalized === "active" ||
    normalized === "approved" ||
    normalized === "delivered" ||
    normalized === "completed" ||
    normalized === "paid"
  ) {
    return "bg-green-50 text-green-700";
  }

  if (
    normalized === "pending" ||
    normalized === "processing" ||
    normalized === "in_progress"
  ) {
    return "bg-amber-50 text-amber-700";
  }

  if (
    normalized === "sold" ||
    normalized === "cancelled" ||
    normalized === "rejected" ||
    normalized === "failed"
  ) {
    return "bg-red-50 text-red-700";
  }

  if (normalized === "draft") {
    return "bg-neutral-100 text-neutral-600";
  }

  return "bg-blue-50 text-blue-700";
}

export default function MyListingsPage() {
  const [listings, setListings] = useState<Listing[]>(
    []
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  async function loadListings() {
    try {
      setLoading(true);
      setError(null);

      const result = await getMyListings();

      console.log(
        "MY LISTINGS:",
        result
      );

      setListings(
        Array.isArray(result)
          ? result
          : result?.items ?? []
      );
    } catch (err) {
      console.error(
        "My Listings Error:",
        err
      );

      setError(
        "Unable to load your listings."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadListings();
  }, []);

  async function handleDelete(
    listing: Listing
  ) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${listing.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(listing.id);

      await deleteListing(listing.id);

      setListings((current) =>
        current.filter(
          (item) =>
            item.id !== listing.id
        )
      );
    } catch (err) {
      console.error(
        "Delete Listing Error:",
        err
      );

      alert(
        "Unable to delete this listing. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="flex items-center gap-3 text-neutral-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading your listings...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-neutral-100 p-3">
                <Package className="h-6 w-6 text-neutral-700" />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
                  My Listings
                </h1>

                <p className="mt-1 text-sm text-neutral-500">
                  Manage everything you have listed
                  on FaultMart.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={loadListings}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>

            <Link
              href="/listings/create"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              <Plus className="h-4 w-4" />
              Create Listing
            </Link>

          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">

          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />

            <span>{error}</span>
          </div>

          <button
            type="button"
            onClick={loadListings}
            className="rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200"
          >
            Try again
          </button>

        </div>
      )}

      {/* Summary */}
      {!error && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-neutral-500">
                Total Listings
              </p>

              <Package className="h-5 w-5 text-neutral-400" />
            </div>

            <p className="mt-2 text-2xl font-bold text-neutral-900">
              {listings.length}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-neutral-500">
                Active
              </p>

              <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
            </div>

            <p className="mt-2 text-2xl font-bold text-neutral-900">
              {
                listings.filter(
                  (listing) =>
                    listing.status?.toLowerCase() ===
                    "active"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-neutral-500">
                Total Views
              </p>

              <Eye className="h-5 w-5 text-neutral-400" />
            </div>

            <p className="mt-2 text-2xl font-bold text-neutral-900">
              {listings
                .reduce(
                  (total, listing) =>
                    total +
                    Number(
                      listing.views ?? 0
                    ),
                  0
                )
                .toLocaleString()}
            </p>
          </div>

        </div>
      )}

      {/* Empty State */}
      {!error &&
        listings.length === 0 && (
          <section className="rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
              <Package className="h-8 w-8 text-neutral-400" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-neutral-900">
              You have no listings yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-neutral-500">
              Start selling on FaultMart by
              creating your first listing.
            </p>

            <Link
              href="/listings/create"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              <Plus className="h-4 w-4" />
              Create Your First Listing
            </Link>

          </section>
        )}

      {/* Listings */}
      {!error &&
        listings.length > 0 && (
          <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">

            {/* Desktop Header */}
            <div className="hidden border-b border-neutral-100 bg-neutral-50 px-6 py-4 md:grid md:grid-cols-[minmax(0,2fr)_120px_100px_130px_120px] md:items-center md:gap-4">

              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Listing
              </p>

              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Price
              </p>

              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Views
              </p>

              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Status
              </p>

              <p className="text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Actions
              </p>

            </div>

            <div className="divide-y divide-neutral-100">

              {listings.map((listing) => {
                const imageUrl =
                  listing.images?.[0]?.url;

                const isDeleting =
                  deletingId === listing.id;

                return (
                  <div
                    key={listing.id}
                    className="px-4 py-5 transition hover:bg-neutral-50 sm:px-6"
                  >

                    {/* Desktop */}
                    <div className="hidden md:grid md:grid-cols-[minmax(0,2fr)_120px_100px_130px_120px] md:items-center md:gap-4">

                      {/* Listing */}
                      <div className="flex min-w-0 items-center gap-4">

                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={listing.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Package className="h-6 w-6 text-neutral-300" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-neutral-900">
                            {listing.title}
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-500">

                            {listing.category?.name && (
                              <span>
                                {listing.category.name}
                              </span>
                            )}

                            {listing.condition && (
                              <>
                                <span>•</span>

                                <span>
                                  {formatStatus(
                                    listing.condition
                                  )}
                                </span>
                              </>
                            )}

                          </div>

                          <p className="mt-1 text-xs text-neutral-400">
                            Listed{" "}
                            {formatDate(
                              listing.createdAt
                            )}
                          </p>
                        </div>

                      </div>

                      {/* Price */}
                      <p className="text-sm font-bold text-neutral-900">
                        {formatCurrency(
                          listing.price
                        )}
                      </p>

                      {/* Views */}
                      <div className="flex items-center gap-1.5 text-sm text-neutral-600">
                        <Eye className="h-4 w-4 text-neutral-400" />

                        {Number(
                          listing.views ?? 0
                        ).toLocaleString()}
                      </div>

                      {/* Status */}
                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                          listing.status
                        )}`}
                      >
                        {formatStatus(
                          listing.status
                        )}
                      </span>

                      {/* Actions */}
                      <div className="flex justify-end gap-1">

                        {listing.slug && (
                          <Link
                            href={`/listings/${listing.slug}`}
                            title="View listing"
                            className="rounded-lg p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900"
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        )}

                        <Link
                          href={`/dashboard/listings/${listing.id}/edit`}
                          title="Edit listing"
                          className="rounded-lg p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>

                        <button
                          type="button"
                          title="Delete listing"
                          disabled={isDeleting}
                          onClick={() =>
                            handleDelete(
                              listing
                            )
                          }
                          className="rounded-lg p-2 text-neutral-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>

                      </div>

                    </div>

                    {/* Mobile */}
                    <div className="md:hidden">

                      <div className="flex gap-4">

                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={listing.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Package className="h-7 w-7 text-neutral-300" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex items-start justify-between gap-3">

                            <div className="min-w-0">
                              <p className="truncate font-semibold text-neutral-900">
                                {listing.title}
                              </p>

                              <p className="mt-1 text-lg font-bold text-neutral-900">
                                {formatCurrency(
                                  listing.price
                                )}
                              </p>
                            </div>

                            <span
                              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${getStatusClasses(
                                listing.status
                              )}`}
                            >
                              {formatStatus(
                                listing.status
                              )}
                            </span>

                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-500">

                            <span className="flex items-center gap-1">
                              <Eye className="h-3.5 w-3.5" />
                              {Number(
                                listing.views ?? 0
                              ).toLocaleString()}
                            </span>

                            {listing.category?.name && (
                              <span>
                                {listing.category.name}
                              </span>
                            )}

                            <span>
                              {formatDate(
                                listing.createdAt
                              )}
                            </span>

                          </div>

                        </div>

                      </div>

                      {/* Mobile Actions */}
                      <div className="mt-4 flex items-center gap-2 border-t border-neutral-100 pt-4">

                        {listing.slug && (
                          <Link
                            href={`/listings/${listing.slug}`}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-neutral-200 px-3 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Link>
                        )}

                        <Link
                          href={`/dashboard/listings/${listing.id}/edit`}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-neutral-900 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Link>

                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() =>
                            handleDelete(
                              listing
                            )
                          }
                          className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>

                      </div>

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