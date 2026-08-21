import Hero from "@/components/home/Hero";
import WhatIsFaultMart from "@/components/home/WhatIsFaultMart";
import Categories from "@/components/home/Categories";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturedListings from "@/components/home/FeaturedListings";
import WhyChoose from "@/components/home/WhyChoose";
import BuyerSeller from "@/components/home/BuyerSeller";
import PopularListings from "@/components/home/PopularListings";
import MarketplaceStats from "@/components/home/MarketplaceStats";
import LatestListings from "@/components/home/LatestListings";
import CTA from "@/components/home/CTA";

import { getHomeData } from "@/lib/api";

export default async function HomePage() {
  const homeData = await getHomeData();

  return (
    <>
      {/* 1. Immediate explanation */}
      <Hero />

      {/* 2. Explain the business */}
      <WhatIsFaultMart />

      {/* 3. What can people buy? */}
      <Categories categories={homeData.categories} />

      {/* 4. Explain the process */}
      <HowItWorks />

      {/* 5. Featured marketplace inventory */}
      <FeaturedListings listings={homeData.featured} />

      {/* 6. Trust */}
      <WhyChoose />

      {/* 7. Buyer vs Seller */}
      <BuyerSeller />

      {/* 8. Popular products */}
      <PopularListings listings={homeData.popular} />

      {/* 9. Marketplace credibility */}
      <MarketplaceStats statistics={homeData.statistics} />

      {/* 10. Fresh inventory */}
      <LatestListings listings={homeData.latest} />

      {/* 11. Final conversion */}
      <CTA />
    </>
  );
}