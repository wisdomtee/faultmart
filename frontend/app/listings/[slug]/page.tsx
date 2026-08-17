import { getListingBySlug } from "@/lib/api";

import {
  Breadcrumbs,
  ListingGallery,
  ListingInfo,
  ListingSpecs,
  SellerCard,
  ListingActions,
} from "@/components/listings";

export default async function ListingDetailsPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;

  const listing = await getListingBySlug(slug);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">

      <Breadcrumbs
        category={listing.category.name}
        title={listing.title}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-3">

        <div className="space-y-8 lg:col-span-2">

          <ListingGallery
            images={listing.images}
            title={listing.title}
          />

          <ListingInfo
            listing={listing}
          />

          <ListingSpecs
            listing={listing}
          />

        </div>

        <aside className="space-y-6">

          <SellerCard
            seller={listing.seller}
          />

          <ListingActions
            listingId={listing.id}
            sellerId={listing.sellerId}
            phone={listing.seller.phone}
          />

        </aside>

      </div>

    </main>
  );
}