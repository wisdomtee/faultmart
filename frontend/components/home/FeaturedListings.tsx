import Container from "@/components/layout/Container";
import { ListingGrid, Listing } from "@/components/listings";

interface FeaturedListingsProps {
  listings: Listing[];
}

export default function FeaturedListings({
  listings,
}: FeaturedListingsProps) {
  return (
    <section className="py-20">
      <Container>
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold">
            Featured Listings
          </h2>

          <p className="mt-4 text-muted-foreground">
            Discover the best repairable products available now.
          </p>
        </div>

        <ListingGrid listings={listings} />
      </Container>
    </section>
  );
}