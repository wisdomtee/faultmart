"use client";

import Link from "next/link";
import {
  Eye,
  Heart,
  MapPin,
  User,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import ListingBadge from "./ListingBadge";
import ListingImage from "./ListingImage";
import ListingPrice from "./ListingPrice";
import FaultSeverityBadge from "./FaultSeverityBadge";

import { Listing } from "@/types/listing";
import { formatDistanceToNow } from "date-fns";

interface Props {
  listing: Listing;
}

export default function ListingCard({ listing }: Props) {
  const image =
    listing.images?.length > 0
      ? listing.images[0]?.url
      : undefined;

  const seller = listing.seller;

  const sellerName =
    seller?.name ||
    [seller?.firstName, seller?.lastName]
      .filter(Boolean)
      .join(" ") ||
    "FaultMart Seller";

  const location =
    listing.city ||
    listing.state ||
    listing.location ||
    "Location unavailable";

  const views = listing.views ?? 0;

  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="group block h-full"
    >
      <article
        className="
          flex
          h-full
          flex-col
          overflow-hidden
          rounded-[28px]
          border
          border-neutral-200
          bg-white
          transition-all
          duration-300
          hover:-translate-y-2
          hover:border-orange-300
          hover:shadow-xl
        "
      >
        {/* IMAGE */}

        <div
          className="
            relative
            aspect-[4/3]
            overflow-hidden
          "
        >
          <ListingImage
            src={image}
            alt={listing.title}
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black/50
              via-transparent
              opacity-0
              transition
              duration-300
              group-hover:opacity-100
            "
          />

          {/* BADGES */}

          <div
            className="
              absolute
              left-4
              top-4
              flex
              flex-col
              gap-2
            "
          >
            <ListingBadge
              condition={listing.condition ?? "UNKNOWN"}
            />

            <FaultSeverityBadge
              severity={listing.faultSeverity}
            />
          </div>

          {/* FAVOURITE */}

          <button
            type="button"
            aria-label="Save listing"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            className="
              absolute
              right-4
              top-4
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-white/95
              shadow-md
              transition
              hover:scale-110
              hover:bg-red-500
              hover:text-white
            "
          >
            <Heart className="h-5 w-5" />
          </button>
        </div>

        {/* CONTENT */}

        <div
          className="
            flex
            flex-1
            flex-col
            p-5
          "
        >
          <ListingPrice
            price={listing.price}
            currency={listing.currency}
          />

          <h3
            className="
              mt-3
              line-clamp-2
              text-lg
              font-extrabold
              leading-snug
              text-neutral-900
              transition
              group-hover:text-orange-600
            "
          >
            {listing.title}
          </h3>

          {/* CATEGORY / STATUS */}

          <div className="mt-4 flex flex-wrap gap-2">
            <span
              className="
                inline-flex
                rounded-full
                bg-orange-50
                px-3
                py-1
                text-xs
                font-bold
                text-orange-700
              "
            >
              {listing.category?.name ?? "Uncategorized"}
            </span>

            {listing.status && (
              <span
                className={`
                  inline-flex
                  rounded-full
                  px-3
                  py-1
                  text-xs
                  font-bold
                  ${
                    listing.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : listing.status === "SOLD"
                      ? "bg-neutral-200 text-neutral-700"
                      : "bg-yellow-100 text-yellow-700"
                  }
                `}
              >
                {listing.status.replaceAll("_", " ")}
              </span>
            )}
          </div>

          {/* LOCATION / DATE */}

          <div
            className="
              mt-4
              space-y-2
              text-sm
              text-neutral-500
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <MapPin
                className="
                  h-4
                  w-4
                  shrink-0
                  text-orange-500
                "
              />

              <span className="truncate">
                {location}
              </span>
            </div>

            <div
              className="
                text-xs
                font-medium
                text-neutral-400
              "
            >
              🕒 Posted{" "}
              {listing.createdAt
  ? formatDistanceToNow(
      new Date(listing.createdAt),
      {
        addSuffix: true,
      }
    )
  : "Recently"}
            </div>
          </div>

          <div className="flex-1" />

          {/* SELLER */}

          <div
            className="
              mt-6
              border-t
              border-neutral-100
              pt-5
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-orange-100
                    text-orange-600
                  "
                >
                  <User className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      max-w-[120px]
                      truncate
                      text-sm
                      font-bold
                      text-neutral-900
                    "
                  >
                    {sellerName}
                  </p>

                  <div
                    className="
                      flex
                      items-center
                      gap-1
                      text-xs
                      font-medium
                      text-green-600
                    "
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />

                    Verified Seller
                  </div>
                </div>
              </div>

              <div
                className="
                  flex
                  shrink-0
                  items-center
                  gap-1
                  rounded-full
                  bg-neutral-100
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-neutral-600
                "
              >
                <Eye className="h-4 w-4" />

                {views.toLocaleString()}
              </div>
            </div>

            {/* VIEW DETAILS */}

            <div
              className="
                mt-5
                flex
                items-center
                justify-between
                rounded-2xl
                bg-neutral-50
                px-4
                py-3
                transition
                group-hover:bg-orange-50
              "
            >
              <span
                className="
                  text-sm
                  font-bold
                  text-neutral-700
                "
              >
                View Details
              </span>

              <ArrowRight
                className="
                  h-5
                  w-5
                  text-orange-600
                  transition
                  group-hover:translate-x-1
                "
              />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
