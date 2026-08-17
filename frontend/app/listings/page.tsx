import {
  getListings,
  getCategories,
} from "@/lib/api";

import ListingResults from "@/components/listings-page/ListingResults";
import MarketplaceHero from "@/components/listings-page/MarketplaceHero";
import FilterSidebar from "@/components/listings-page/FilterSidebar";
import SortDropdown from "@/components/listings-page/SortDropdown";
import Pagination from "@/components/listings-page/Pagination";
import MobileFilters from "@/components/listings-page/MobileFilters";

interface Props {
  searchParams: Promise<{
    page?: string;
    search?: string;
    categoryId?: string;
    state?: string;
    city?: string;
    condition?: string;
    faultSeverity?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export default async function ListingsPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const [data, categories] =
await Promise.all([

  getListings({
    page:
      Number(params.page || 1),

    search:
      params.search,

    categoryId:
      params.categoryId,

    state:
      params.state,

    city:
      params.city,

    condition:
      params.condition,

    faultSeverity:
      params.faultSeverity,

    sort:
      params.sort,

    minPrice:
      params.minPrice
        ? Number(params.minPrice)
        : undefined,

    maxPrice:
      params.maxPrice
        ? Number(params.maxPrice)
        : undefined,
  }),

  getCategories(),

]);

  return (
  <main className="mx-auto max-w-7xl px-6 py-10">

    <MarketplaceHero
      categories={categories}
    />

    <div className="mt-6">
      <MobileFilters
        categories={categories}
      />
    </div>


    <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">

      <FilterSidebar
        categories={categories}
      />


      <div className="space-y-8">

        <SortDropdown />

        <ListingResults
  listings={data.items}
  total={data.pagination.total}
/>

                <Pagination
          pagination={data.pagination}
        />

      </div>

    </div>

  </main>
  );
}