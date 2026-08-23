import {
  MapPin,
  CalendarDays,
} from "lucide-react";

import FaultSeverityBadge from "./FaultSeverityBadge";
import ViewCounter from "./ViewCounter";

import { Listing } from "@/types/listing";

interface Props {
  listing: Listing;
}

export default function ListingInfo({
  listing,
}: Props) {
  const location =
    listing.city ||
    listing.state ||
    listing.location ||
    "Location unavailable";

  return (
    <section className="rounded-3xl border bg-white p-8">

      <div className="flex flex-wrap items-center gap-3">

        <FaultSeverityBadge
          severity={listing.faultSeverity}
        />

        <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
          {listing.condition}
        </span>

      </div>

      <h1 className="mt-5 text-4xl font-black leading-tight">
        {listing.title}
      </h1>

      <p className="mt-6 text-4xl font-black text-orange-600">
        {listing.currency}{" "}
        {Number(listing.price).toLocaleString()}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-6 text-gray-500">

        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {location}
        </div>

        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          {listing.createdAt
  ? new Date(listing.createdAt).toLocaleDateString()
  : "—"}
        </div>

        <ViewCounter
  views={listing.views ?? 0}
/>

      </div>

    </section>
  );
}