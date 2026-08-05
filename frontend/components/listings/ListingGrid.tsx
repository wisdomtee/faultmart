import ListingCard from "./ListingCard";
import { Listing } from "./types";

interface Props {
  listings: Listing[];
}

export default function ListingGrid({
  listings,
}: Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
        />
      ))}
    </div>
  );
}