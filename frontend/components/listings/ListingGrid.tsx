import { SearchX } from "lucide-react";

import { Listing } from "@/types/listing";
import ListingCard from "./ListingCard";

interface Props {
  listings: Listing[];
}

export default function ListingGrid({
  listings,
}: Props) {

  if (!listings.length) {
    return (
      <div
        className="
          flex
          min-h-[360px]
          items-center
          justify-center
          rounded-[32px]
          border
          border-dashed
          border-orange-200
          bg-orange-50/40
          p-10
          text-center
        "
      >

        <div className="max-w-md">

          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-orange-100
              text-orange-600
            "
          >
            <SearchX className="h-8 w-8" />
          </div>


          <h3
            className="
              mt-6
              text-xl
              font-black
              text-neutral-900
            "
          >
            No listings found
          </h3>


          <p
            className="
              mt-3
              text-sm
              leading-6
              text-neutral-500
            "
          >
            We couldn&apos;t find any products matching your search.
            Try another category or check back later for new
            repairable items.
          </p>


        </div>

      </div>
    );
  }


  return (

    <div
      className="
        grid
        gap-6
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        2xl:gap-8
      "
    >

      {listings.map((listing) => (

        <div
          key={listing.id}
          className="
            animate-in
            fade-in
            duration-500
          "
        >

          <ListingCard
            listing={listing}
          />

        </div>

      ))}

    </div>

  );
}