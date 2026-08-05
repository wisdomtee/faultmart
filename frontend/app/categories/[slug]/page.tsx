import { notFound } from "next/navigation";
import { getCategoryListings } from "@/lib/api";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const data = await getCategoryListings(slug);

  if (!data) {
    notFound();
  }

  return (
    <main className="container mx-auto py-12">
      <h1 className="mb-8 text-4xl font-bold">
        {data.category.name}
      </h1>

      <p className="mb-8 text-muted-foreground">
        {data.category.description}
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {data.listings.map((listing: any) => (
          <div
            key={listing.id}
            className="rounded-xl border p-5"
          >
            <img
              src={
                listing.images[0]?.url ??
                "/placeholder.jpg"
              }
              alt={listing.title}
              className="mb-4 h-48 w-full rounded-lg object-cover"
            />

            <h3 className="font-semibold">
              {listing.title}
            </h3>

            <p className="mt-2 font-bold text-primary">
              ₦{Number(listing.price).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}