import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedListings from "@/components/home/FeaturedListings";
import LatestListings from "@/components/home/LatestListings";
import PopularListings from "@/components/home/PopularListings";
import WhyChoose from "@/components/home/WhyChoose";
import MarketplaceStats from "@/components/home/MarketplaceStats";
import CTA from "@/components/home/CTA";
import HowItWorks from "@/components/home/HowItWorks";

import { getHomeData } from "@/lib/api";

export default async function HomePage() {

  const data = await getHomeData();

  return (
    <>

      <Hero />

      <Categories
        categories={data.categories}
      />


      <HowItWorks />


      <FeaturedListings
        listings={data.featured}
      />


      <WhyChoose />


      <PopularListings
        listings={data.popular}
      />


      <MarketplaceStats />


      <LatestListings
        listings={data.latest}
      />


      <CTA />

    </>
  );
}