"use client";

import {
  Eye,
  Heart,
  Tag,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

interface ListingPerformance {
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
}

interface ListingPerformanceProps {
  topListings: ListingPerformance[];
  lowPerformingListings: ListingPerformance[];
}

function formatCurrency(
  value: number | string | null | undefined
) {
  return `₦${Number(value ?? 0).toLocaleString("en-NG")}`;
}

function ListingImage({
  listing,
}: {
  listing: ListingPerformance;
}) {
  const image = listing.images?.[0]?.url;

  if (!image) {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
        <Tag className="h-5 w-5 text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
      <img
        src={image}
        alt={listing.title}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

function PerformanceMetrics({
  listing,
}: {
  listing: ListingPerformance;
}) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
      <span className="flex items-center gap-1">
        <Eye className="h-3.5 w-3.5" />
        {listing.views ?? 0} views
      </span>

      <span className="flex items-center gap-1">
        <Heart className="h-3.5 w-3.5" />
        {listing._count?.favorites ?? 0} favorites
      </span>

      <span className="flex items-center gap-1">
        <Tag className="h-3.5 w-3.5" />
        {listing._count?.offers ?? 0} offers
      </span>
    </div>
  );
}

export default function ListingPerformance({
  topListings,
  lowPerformingListings,
}: ListingPerformanceProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Top Performing */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">
              Top Performing Listings
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Listings getting the most attention from buyers.
            </p>
          </div>

          <div className="rounded-xl bg-emerald-50 p-2.5">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>
        </div>

        {topListings.length === 0 ? (
          <div className="mt-6 rounded-xl bg-neutral-50 px-6 py-10 text-center">
            <TrendingUp className="mx-auto h-8 w-8 text-neutral-300" />

            <p className="mt-3 text-sm font-medium text-neutral-700">
              No performance data yet
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              Your best-performing listings will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {topListings.map((listing, index) => (
              <div
                key={listing.id}
                className="group flex items-center gap-3 rounded-xl border border-neutral-100 p-3 transition hover:border-neutral-200 hover:bg-neutral-50 sm:gap-4 sm:p-4"
              >
                {/* Rank */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-sm font-bold text-neutral-600">
                  {index + 1}
                </div>

                <ListingImage listing={listing} />

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-neutral-900">
                    {listing.title}
                  </p>

                  <PerformanceMetrics listing={listing} />
                </div>

                <div className="hidden shrink-0 text-right sm:block">
                  <p className="text-sm font-semibold text-neutral-900">
                    {formatCurrency(listing.price)}
                  </p>

                  <p className="mt-1 text-xs text-emerald-600">
                    High visibility
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Low Performing */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">
              Listings Needing Attention
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Listings receiving less buyer engagement.
            </p>
          </div>

          <div className="rounded-xl bg-orange-50 p-2.5">
            <TrendingDown className="h-5 w-5 text-orange-600" />
          </div>
        </div>

        {lowPerformingListings.length === 0 ? (
          <div className="mt-6 rounded-xl bg-neutral-50 px-6 py-10 text-center">
            <TrendingDown className="mx-auto h-8 w-8 text-neutral-300" />

            <p className="mt-3 text-sm font-medium text-neutral-700">
              Nothing needs attention
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              Your listings are currently getting good visibility.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {lowPerformingListings.map((listing) => (
              <div
                key={listing.id}
                className="group flex items-center gap-3 rounded-xl border border-neutral-100 p-3 transition hover:border-neutral-200 hover:bg-neutral-50 sm:gap-4 sm:p-4"
              >
                <ListingImage listing={listing} />

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-neutral-900">
                    {listing.title}
                  </p>

                  <PerformanceMetrics listing={listing} />
                </div>

                <div className="hidden shrink-0 text-right sm:block">
                  <p className="text-sm font-semibold text-neutral-900">
                    {formatCurrency(listing.price)}
                  </p>

                  <p className="mt-1 text-xs text-orange-600">
                    Low visibility
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}