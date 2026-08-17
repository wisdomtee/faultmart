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

export default function HomePage() {
  // Temporary static data for the public landing page.
  // Real marketplace data will come from the backend
  // once the API is deployed.
  const categories = [
    {
      id: "vehicles",
      name: "Vehicles",
      slug: "vehicles",
      count: 0,
    },
    {
      id: "electronics",
      name: "Electronics",
      slug: "electronics",
      count: 0,
    },
    {
      id: "appliances",
      name: "Appliances",
      slug: "appliances",
      count: 0,
    },
    {
      id: "parts",
      name: "Parts & Tools",
      slug: "parts",
      count: 0,
    },
  ];

  return (
    <>
      {/* 1. Immediate explanation */}
      <Hero />

      {/* 2. Explain the business */}
      <WhatIsFaultMart />

      {/* 3. What can people buy? */}
      <Categories categories={categories} />

      {/* 4. Explain the process */}
      <HowItWorks />

      {/* 5. Marketplace inventory */}
      <FeaturedListings listings={[]} />

      {/* 6. Trust */}
      <WhyChoose />

      {/* 7. Buyer vs Seller */}
      <BuyerSeller />

      {/* 8. Popular products */}
      <PopularListings listings={[]} />

      {/* 9. Marketplace credibility */}
      <MarketplaceStats />

      {/* 10. Fresh inventory */}
      <LatestListings listings={[]} />

      {/* 11. Final conversion */}
      <CTA />
    </>
  );
}