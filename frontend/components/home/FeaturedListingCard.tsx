import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  Heart,
  MapPin,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface FeaturedListing {
  id: string;
  slug: string;
  title: string;

  price: number;

  location: string;

  image: string;

  category: string;

  condition: string;

  verified: boolean;

  views: number;
}

interface Props {
  listing: FeaturedListing;
}

export default function FeaturedListingCard({
  listing,
}: Props) {
  return (
  <div
    className="
      group
      overflow-hidden
      rounded-3xl
      border
      border-neutral-200
      bg-white
      shadow-sm
      transition-all
      duration-300
      hover:-translate-y-2
      hover:border-orange-500
      hover:shadow-2xl
    "
  >

    {/* Image */}

    <div className="relative h-60 overflow-hidden">

        <Image
          src={listing.image}
          alt={listing.title}
          fill
          className="
            object-cover
            transition-transform
            duration-500
            group-hover:scale-110
          "
        />

        {/* Dark Gradient */}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Category */}

        <Badge
          className="
            absolute
            left-4
            top-4
            border-0
            bg-orange-600
            text-white
          "
        >
          {listing.category}
        </Badge>

        {/* Favourite */}

        <button
          className="
            absolute
            right-4
            top-4
            rounded-full
            bg-white/90
            p-2
            transition
            hover:bg-red-500
            hover:text-white
          "
        >
          <Heart className="h-5 w-5" />
        </button>

        {/* Condition */}

        <div className="absolute bottom-4 left-4">

          <Badge
            variant="secondary"
            className="bg-white text-neutral-900"
          >
            {listing.condition}
          </Badge>

        </div>

      </div>

      {/* Content */}

      <div className="space-y-5 p-6">

        <h3
          className="
            line-clamp-2
            text-xl
            font-bold
            transition-colors
            group-hover:text-orange-600
          "
        >
          {listing.title}
        </h3>

        <p className="text-3xl font-black text-orange-600">
          ₦{listing.price.toLocaleString()}
        </p>

        <div className="flex items-center gap-2 text-sm text-neutral-500">

          <MapPin className="h-4 w-4" />

          <span>{listing.location}</span>
          

        </div>
                </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t pt-5">
          <div className="space-y-1">
            {listing.verified && (
              <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                <ShieldCheck className="h-4 w-4" />
                Verified Seller
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <Eye className="h-4 w-4" />
              <span>{listing.views.toLocaleString()} views</span>
            </div>
          </div>

          <Link href={`/listings/${listing.slug}`}>
            <Button className="bg-orange-600 hover:bg-orange-700">
              View
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
                </div>

      </div>
  );
}