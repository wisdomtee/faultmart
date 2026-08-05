import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedListings from "@/components/home/FeaturedListings";

import { getHomeData } from "@/lib/api";

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <>
      <Hero />

      <Categories categories={data.categories} />

      <FeaturedListings listings={data.featured} />
    </>
  );
}