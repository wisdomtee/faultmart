"use client";

import Image from "next/image";
import Link from "next/link";

import { Eye, MapPin } from "lucide-react";

import { Listing } from "./types";

interface Props {
  listing: Listing;
}

export default function ListingCard({
  listing,
}: Props) {
  const image =
    listing.images?.[0]?.url ||
    "/images/placeholder.png";

  return (
    <Link
      href={`/listing/${listing.slug}`}
      className="group overflow-hidden rounded-xl border bg-white transition hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={listing.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="space-y-3 p-5">
        <h3 className="line-clamp-2 font-semibold">
          {listing.title}
        </h3>

        <div className="text-2xl font-bold text-primary">
          ₦{Number(listing.price).toLocaleString()}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="rounded bg-primary/10 px-2 py-1">
            {listing.condition}
          </span>

          {listing.faultSeverity && (
            <span className="rounded bg-red-100 px-2 py-1 text-red-600">
              {listing.faultSeverity}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />

          <span>
            {listing.city ||
              listing.state ||
              listing.location ||
              "Nigeria"}
          </span>
        </div>

        <div className="flex items-center justify-between border-t pt-3 text-sm">
          <span>
            {listing.seller?.firstName ??
              listing.seller?.username ??
              "FaultMart Seller"}
          </span>

          <span className="flex items-center gap-1 text-muted-foreground">
            <Eye className="h-4 w-4" />
            {listing.views ?? 0}
          </span>
        </div>
      </div>
    </Link>
  );
}