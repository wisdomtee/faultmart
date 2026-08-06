import { getListingBySlug } from "@/lib/api";

import {
  Breadcrumbs,
  ListingGallery,
  ListingInfo,
  ListingSpecs,
  SellerCard,
  ListingActions,
  RelatedListings,
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

      <div className="grid gap-8 lg:grid-cols-[2fr_380px]">
        {/* LEFT COLUMN */}
        <div className="space-y-8">
          <ListingGallery
            images={listing.images}
            title={listing.title}
          />

          <ListingInfo listing={listing} />

          <ListingSpecs listing={listing} />

          <section className="rounded-3xl border bg-white p-8">
            <h2 className="text-2xl font-black">
              Description
            </h2>

            <p className="mt-5 whitespace-pre-wrap leading-8 text-gray-600">
              {listing.description ||
                "No description provided."}
            </p>
          </section>

          {listing.faultDescription && (
            <section className="rounded-3xl border border-orange-200 bg-orange-50 p-8">
              <h2 className="text-2xl font-black">
                Fault Information
              </h2>

              <p className="mt-5 whitespace-pre-wrap leading-8">
                {listing.faultDescription}
              </p>
            </section>
          )}

          <RelatedListings
            listings={listing.relatedListings ?? []}
          />
        </div>

        {/* RIGHT COLUMN */}
        <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
          <SellerCard seller={listing.seller} />

          <ListingActions
            listingId={listing.id}
            phone={listing.seller.phone}
          />
        </aside>
      </div>
    </main>
  );
}