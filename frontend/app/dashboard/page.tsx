"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  AlertCircle,
  Package,
  Eye,
  Heart,
  Tag,
  Wallet,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

import { getSellerDashboard } from "@/lib/api";

import DashboardStats from "@/components/dashboard/DashboardStats";
import SalesOverview from "@/components/dashboard/SalesOverview";
import RecentOrders from "@/components/dashboard/RecentOrders";
import Deliveries from "@/components/dashboard/Deliveries";
import RecentOffers from "@/components/dashboard/RecentOffers";

interface DashboardData {
  stats: {
    totalListings: number;
    activeListings: number;
    soldListings: number;
    draftListings: number;
    totalViews: number;
    totalFavorites: number;
    totalOffers: number;
    totalRevenue: number;
  };

  analytics: {
    salesTrend: Array<{
      createdAt: string;
      _sum?: {
        amount?: number | null;
      };
    }>;

    monthlyRevenue: {
      revenue: number;
      orders: number;
    };

    listingPerformance: Array<{
      id: string;
      title: string;
      slug: string;
      views: number;
      _count?: {
        favorites: number;
        offers: number;
      };
    }>;
  };

  recentListings: Array<{
    id: string;
    title: string;
    slug?: string;
    price?: number | string | null;
    status?: string;
    views?: number;
    images?: Array<{
      url: string;
    }>;
  }>;

    recentOffers: Array<{
    id: string;
    amount?: number | string | null;
    message?: string | null;
    status?: string;
    createdAt?: string;
    buyer?: {
      firstName?: string;
      lastName?: string;
      profileImage?: string | null;
    };
    listing?: {
      id: string;
      title: string;
      slug: string;
    };
  }>;

  recentOrders: Array<{
    id: string;
    amount?: number | string | null;
    status?: string;
    createdAt?: string;
    buyer?: {
      firstName?: string;
      lastName?: string;
      profileImage?: string | null;
    };
    listing?: {
      id: string;
      title: string;
      slug: string;
    };
  }>;

  deliveries: Array<{
    id: string;
    status?: string;
    createdAt?: string;
    order?: {
      id: string;
      buyer?: {
        firstName?: string;
        lastName?: string;
        profileImage?: string | null;
      };
      listing?: {
  id: string;
  title: string;
  slug: string;
  images?: Array<{
    url: string;
  }>;
};
    };
  }>;

  topListings: Array<{
    id: string;
    title: string;
    slug?: string;
    views?: number;
    price?: number | string | null;
    _count?: {
      favorites: number;
      offers: number;
    };
    images?: Array<{
      url: string;
    }>;
  }>;

  lowPerformingListings: Array<{
    id: string;
    title: string;
    slug?: string;
    views?: number;
    price?: number | string | null;
    _count?: {
      favorites: number;
      offers: number;
    };
    images?: Array<{
      url: string;
    }>;
  }>;
}

function formatCurrency(
  value: number | string | null | undefined
) {
  return `₦${Number(value ?? 0).toLocaleString("en-NG")}`;
}

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatStatus(status?: string) {
  if (!status) return "Unknown";

  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
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
    normalized === "canceled" ||
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

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        const result = await getSellerDashboard();

        console.log("SELLER DASHBOARD:", result);

        setData(result);
      } catch (err) {
        console.error("Dashboard Error:", err);

        setError("Unable to load your dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-neutral-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl p-8">
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />

          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
              Seller Dashboard
            </h1>

            <p className="mt-2 text-neutral-500">
              Manage your listings, sales and marketplace performance.
            </p>
          </div>

          <a
            href="/listings/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            <Package className="h-4 w-4" />
            Create Listing
          </a>
        </div>
      </div>

      {/* =========================================================
          MAIN STATISTICS
      ========================================================= */}
      <DashboardStats stats={data.stats} />

      {/* =========================================================
          SALES ANALYTICS
      ========================================================= */}
      {/* Sales Analytics */}
{/* Sales Analytics */}
<div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
  <div className="lg:col-span-2">
    <SalesOverview analytics={data.analytics} />
  </div>

  {/* Monthly Revenue */}
  <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-neutral-500">
          Monthly Revenue
        </p>

        <h2 className="mt-2 text-3xl font-bold text-neutral-900">
          {formatCurrency(data.analytics.monthlyRevenue.revenue)}
        </h2>
      </div>

      <div className="rounded-xl bg-neutral-100 p-3">
        <Wallet className="h-5 w-5 text-neutral-700" />
      </div>
    </div>

    <div className="mt-8 flex items-center justify-between border-t border-neutral-100 pt-5">
      <div>
        <p className="text-sm text-neutral-500">
          Delivered orders
        </p>

        <p className="mt-1 text-xl font-bold text-neutral-900">
          {data.analytics.monthlyRevenue.orders}
        </p>
      </div>

      <div className="flex items-center gap-1 text-sm font-medium text-green-600">
        <TrendingUp className="h-4 w-4" />
        Revenue
      </div>
    </div>
  </div>
</div>

      {/* =========================================================
          RECENT LISTINGS + RECENT OFFERS
      ========================================================= */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Listings */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">
                Recent Listings
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Your latest marketplace listings.
              </p>
            </div>

            <Package className="h-5 w-5 text-neutral-400" />
          </div>

          {data.recentListings.length === 0 ? (
            <div className="py-10 text-center">
              <Package className="mx-auto h-8 w-8 text-neutral-300" />

              <p className="mt-3 text-sm text-neutral-500">
                No listings yet.
              </p>

              <a
                href="/listings/create"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                <Package className="h-4 w-4" />
                Create your first listing
              </a>
            </div>
          ) : (
            <div className="mt-5 divide-y divide-neutral-100">
              {data.recentListings.map((listing) => {
                const imageUrl = listing.images?.[0]?.url;

                return (
                  <div
                    key={listing.id}
                    className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    {/* Listing Image */}
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

                    {/* Listing Details */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-neutral-900">
                        {listing.title}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
                        <span className="font-semibold text-neutral-900">
                          {formatCurrency(listing.price)}
                        </span>

                        {typeof listing.views === "number" && (
                          <span className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            {listing.views.toLocaleString()} views
                          </span>
                        )}
                      </div>

                      {listing.status && (
                        <span
                          className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${getStatusClasses(
                            listing.status
                          )}`}
                        >
                          {formatStatus(listing.status)}
                        </span>
                      )}
                    </div>

                    {/* View Listing */}
                    {listing.slug && (
                      <a
                        href={`/listings/${listing.slug}`}
                        aria-label={`View ${listing.title}`}
                        className="shrink-0 rounded-lg p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

               {/* Recent Offers */}
        <div className="mt-8">
          <RecentOffers offers={data.recentOffers} />
        </div>
      </div>

      {/* =========================================================
          RECENT ORDERS + DELIVERIES
      {/* =========================================================
          RECENT ORDERS + DELIVERIES

      {/* =========================================================
          RECENT ORDERS + DELIVERIES
          
          IMPORTANT:
          These are now handled by the reusable components.
          Do NOT add another inline Orders/Deliveries section here.
      ========================================================= */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentOrders orders={data.recentOrders} />

        <Deliveries deliveries={data.deliveries} />
      </div>

      {/* =========================================================
          LISTING PERFORMANCE
      ========================================================= */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Performing Listings */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">
                Top Performing Listings
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Your listings with the highest visibility.
              </p>
            </div>

            <TrendingUp className="h-5 w-5 text-neutral-400" />
          </div>

          {data.topListings.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-500">
              No listing performance data yet.
            </p>
          ) : (
            <div className="space-y-3">
              {data.topListings.map((listing, index) => (
                <div
                  key={listing.id}
                  className="flex items-center gap-4 rounded-xl border border-neutral-100 p-4"
                >
                  {/* Ranking */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-sm font-bold text-neutral-600">
                    {index + 1}
                  </div>

                  {/* Listing Details */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-neutral-900">
                      {listing.title}
                    </p>

                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {listing.views ?? 0} views
                      </span>

                      <span className="flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5" />
                        {listing._count?.favorites ?? 0}
                      </span>

                      <span className="flex items-center gap-1">
                        <Tag className="h-3.5 w-3.5" />
                        {listing._count?.offers ?? 0}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  {listing.price !== undefined && (
                    <p className="shrink-0 text-sm font-semibold text-neutral-900">
                      {formatCurrency(listing.price)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Listings Needing Attention */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">
                Listings Needing Attention
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Active listings with lower visibility.
              </p>
            </div>

            <Eye className="h-5 w-5 text-neutral-400" />
          </div>

          {data.lowPerformingListings.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-500">
              No low-performing listings.
            </p>
          ) : (
            <div className="space-y-3">
              {data.lowPerformingListings.map((listing) => (
                <div
                  key={listing.id}
                  className="rounded-xl border border-neutral-100 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-neutral-900">
                        {listing.title}
                      </p>

                      <p className="mt-1 text-sm text-neutral-500">
                        {formatCurrency(listing.price)}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                      {listing.views ?? 0} views
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" />
                      {listing._count?.favorites ?? 0} favorites
                    </span>

                    <span className="flex items-center gap-1">
                      <Tag className="h-3.5 w-3.5" />
                      {listing._count?.offers ?? 0} offers
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}