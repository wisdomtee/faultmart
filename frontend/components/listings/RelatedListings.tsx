import { Listing } from "@/types/listing";

import ListingCard from "./ListingCard";

interface Props {
  listings: Listing[];
}

export default function RelatedListings({
  listings,
}: Props) {
  if (!listings.length) {
    return null;
  }

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-black">
        Related Listings
      </h2>

      <div
        className="
          grid
          gap-6
          sm:grid-cols-2
          xl:grid-cols-3
        "
      >
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
          />
        ))}
      </div>
    </section>
  );
}