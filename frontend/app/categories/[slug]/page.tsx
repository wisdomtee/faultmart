import { notFound } from "next/navigation";
import Link from "next/link";

import { getCategoryListings } from "@/lib/api";

import ListingCard from "@/components/listings/ListingCard";
import Breadcrumbs from "@/components/listings/Breadcrumbs";
import CategoryPagination from "@/components/categories/CategoryPagination";

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
    <main className="mx-auto max-w-7xl px-6 py-10">
      <Breadcrumbs
        items={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Categories",
            href: "/categories",
          },
          {
            label: data.category.name,
          },
        ]}
      />

      {/* HERO */}
      <section
        className="
          mt-8
          overflow-hidden
          rounded-3xl
          bg-gradient-to-r
          from-orange-600
          via-orange-500
          to-amber-500
          p-10
          text-white
        "
      >
        <div className="max-w-3xl">
          <span
            className="
              inline-flex
              rounded-full
              bg-white/20
              px-4
              py-2
              text-sm
              font-semibold
            "
          >
            Category
          </span>

          <h1
            className="
              mt-5
              text-5xl
              font-black
              tracking-tight
            "
          >
            {data.category.name}
          </h1>

          <p
            className="
              mt-5
              text-lg
              text-orange-100
            "
          >
            {data.category.description ||
              `Browse all ${data.category.name.toLowerCase()} listings on FaultMart.`}
          </p>

          <div
            className="
              mt-8
              inline-flex
              rounded-2xl
              bg-white
              px-6
              py-4
              text-orange-600
            "
          >
            <div>
              <p className="text-sm font-medium">Active Listings</p>

              <p className="text-3xl font-black">
                {data.pagination.total}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HEADER */}
      <div
        className="
          mt-10
          flex
          flex-col
          gap-4
          rounded-2xl
          border
          bg-white
          p-6
          md:flex-row
          md:items-center
          md:justify-between
        "
      >
        <div>
          <h2
            className="
              text-2xl
              font-bold
            "
          >
            Listings
          </h2>

          <p className="text-gray-500">
            {data.pagination.total} listing
            {data.pagination.total !== 1 && "s"} found
          </p>
        </div>

        <Link
          href="/categories"
          className="
            rounded-xl
            bg-orange-600
            px-6
            py-3
            font-semibold
            text-white
            transition
            hover:bg-orange-700
          "
        >
          Browse All Categories
        </Link>
      </div>

      {/* LISTINGS */}
      {data.items.length === 0 ? (
        <div
          className="
            mt-12
            rounded-3xl
            border
            border-dashed
            py-24
            text-center
          "
        >
          <h3 className="text-2xl font-bold">
            No listings found
          </h3>

          <p className="mt-3 text-gray-500">
            There are currently no active listings in this category.
          </p>
        </div>
      ) : (
        <div
          className="
            mt-10
            grid
            gap-8
            md:grid-cols-2
            xl:grid-cols-4
          "
        >
          {data.items.map((listing: any) => (
            <ListingCard
              key={listing.id}
              listing={listing}
            />
          ))}
        </div>
      )}

      <CategoryPagination pagination={data.pagination} />
    </main>
  );
}
