import Link from "next/link";
import {
  ArrowRight,
  Bike,
  Car,
  Cpu,
  Hammer,
  Home,
  Laptop,
  Refrigerator,
  Settings,
  Smartphone,
  Tv,
  Wrench,
} from "lucide-react";

import Container from "@/components/layout/Container";
import { getCategories } from "@/lib/api";

type Category = {
  id: string;
  name: string;
  slug: string;
  count: number;
};

function getCategoryIcon(category: Category) {
  const value = `${category.slug} ${category.name}`.toLowerCase();

  if (
    value.includes("vehicle") ||
    value.includes("car") ||
    value.includes("auto")
  ) {
    return Car;
  }

  if (value.includes("motor") || value.includes("bike")) {
    return Bike;
  }

  if (value.includes("phone") || value.includes("mobile")) {
    return Smartphone;
  }

  if (value.includes("computer") || value.includes("laptop")) {
    return Laptop;
  }

  if (value.includes("tv") || value.includes("television")) {
    return Tv;
  }

  if (value.includes("electronic")) {
    return Cpu;
  }

  if (
    value.includes("fridge") ||
    value.includes("refrigerator") ||
    value.includes("washing")
  ) {
    return Refrigerator;
  }

  if (
    value.includes("part") ||
    value.includes("accessory")
  ) {
    return Settings;
  }

  if (
    value.includes("home") ||
    value.includes("furniture")
  ) {
    return Home;
  }

  if (
    value.includes("machine") ||
    value.includes("tool")
  ) {
    return Hammer;
  }

  return Wrench;
}

function getIconStyle(category: Category) {
  const value = `${category.slug} ${category.name}`.toLowerCase();

  if (
    value.includes("car") ||
    value.includes("vehicle")
  ) {
    return "from-blue-500 to-cyan-500";
  }

  if (value.includes("phone")) {
    return "from-green-500 to-emerald-500";
  }

  if (
    value.includes("computer") ||
    value.includes("laptop")
  ) {
    return "from-purple-500 to-indigo-500";
  }

  if (value.includes("tv")) {
    return "from-pink-500 to-red-500";
  }

  if (value.includes("home")) {
    return "from-yellow-500 to-orange-500";
  }

  return "from-orange-500 to-red-500";
}

export default async function CategoriesPage() {
  const result = await getCategories();

  const categories: Category[] = result?.categories || result || [];

  return (
    <main className="min-h-screen bg-gray-50 py-12 md:py-16">
      <Container>
        {/* HERO */}
        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 px-8 py-14 text-white md:px-14 md:py-20">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-orange-900/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <div className="inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-bold backdrop-blur">
              FaultMart Marketplace
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">
              Browse Categories
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-orange-50 md:text-xl">
              Explore repairable vehicles, phones, electronics,
              appliances, tools and more from sellers across Nigeria.
            </p>
          </div>
        </section>

        {/* CATEGORY GRID */}
        <section className="mt-12">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-neutral-900">
              All Categories
            </h2>

            <p className="mt-2 text-neutral-500">
              Find the type of repairable product you're looking for.
            </p>
          </div>

          {categories.length === 0 ? (
            <div className="rounded-3xl border border-dashed bg-white px-6 py-20 text-center">
              <h3 className="text-2xl font-bold text-neutral-900">
                No categories available
              </h3>

              <p className="mt-3 text-neutral-500">
                Categories will appear here when they are available.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map((category) => {
                const Icon = getCategoryIcon(category);
                const iconStyle = getIconStyle(category);

                return (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="group relative overflow-hidden rounded-[28px] border border-neutral-200 bg-white p-7 transition-all duration-300 hover:-translate-y-2 hover:border-orange-300 hover:shadow-xl"
                  >
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-50 transition duration-300 group-hover:scale-150" />

                    <div className="relative">
                      <div
                        className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${iconStyle} text-white shadow-lg transition duration-300 group-hover:scale-110 group-hover:rotate-2`}
                      >
                        <Icon className="h-8 w-8" />
                      </div>

                      <h3 className="mt-7 text-xl font-black text-neutral-900 transition group-hover:text-orange-600">
                        {category.name}
                      </h3>

                      <p className="mt-2 text-sm text-neutral-500">
                        {category.count}{" "}
                        {category.count === 1 ? "listing" : "listings"}
                      </p>

                      <div className="mt-6 flex items-center gap-2 text-sm font-bold text-orange-600">
                        Explore category

                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* BROWSE LISTINGS */}
        <div className="mt-12 text-center">
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-7 py-3.5 font-bold text-white transition hover:bg-orange-700"
          >
            Browse All Listings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </main>
  );
}