"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Eye, Package } from "lucide-react";

interface RecentListing {
  id: string;
  title: string;
  slug?: string;
  price?: number | string | null;
  views?: number;
  status?: string;
  images?: Array<{
    url: string;
  }>;
  category?: {
    name?: string;
  };
}

interface RecentListingsProps {
  listings: RecentListing[];
}

export default function RecentListings({
  listings,
}: RecentListingsProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
        <div>
          <h2 className="font-bold text-neutral-900">Recent Listings</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Your latest marketplace listings.
          </p>
        </div>

        <Link
          href="/dashboard/listings"
          className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
            <Package className="h-5 w-5 text-orange-600" />
          </div>

          <h3 className="mt-3 font-semibold text-neutral-900">
            No listings yet
          </h3>

          <p className="mt-1 text-sm text-neutral-500">
            Create your first listing to start selling on FaultMart.
          </p>

          <Link
            href="/listings/create"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700"
          >
            Create Listing
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-neutral-100">
          {listings.map((listing) => {
            const image = listing.images?.[0]?.url;
            const price =
              listing.price !== undefined && listing.price !== null
                ? Number(listing.price)
                : null;

            return (
              <Link
                key={listing.id}
                href={
                  listing.slug
                    ? `/listings/${listing.slug}`
                    : "/dashboard/listings"
                }
                className="flex gap-4 px-5 py-4 transition hover:bg-neutral-50"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                  {image ? (
                    <Image
                      src={image}
                      alt={listing.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package className="h-5 w-5 text-neutral-400" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="truncate font-semibold text-neutral-900">
                      {listing.title}
                    </h3>

                    {price !== null && Number.isFinite(price) && (
                      <span className="shrink-0 text-sm font-bold text-neutral-900">
                        ₦{price.toLocaleString("en-NG")}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                    {listing.category?.name && (
                      <span>{listing.category.name}</span>
                    )}

                    <span className="inline-flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {listing.views ?? 0} views
                    </span>

                    {listing.status && (
                      <span className="capitalize">
                        {listing.status.toLowerCase()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
