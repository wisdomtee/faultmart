import Link from "next/link";
import {
  Search,
  Car,
  Smartphone,
  Refrigerator,
  Wrench,
} from "lucide-react";

import SearchBar from "./SearchBar";

import { Category } from "@/components/types/category";

interface Props {
  categories: Category[];
}

const icons = [
  Car,
  Refrigerator,
  Smartphone,
  Wrench,
];

export default function MarketplaceHero({
  categories,
}: Props) {
  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-[40px]
        bg-gradient-to-br
        from-orange-600
        via-orange-500
        to-amber-500
        p-8
        text-white
        md:p-12
      "
    >
      {/* Background */}

      <div
        className="
          absolute
          -top-32
          -right-24
          h-96
          w-96
          rounded-full
          bg-white/10
          blur-3xl
        "
      />

      <div
        className="
          absolute
          -bottom-20
          -left-20
          h-80
          w-80
          rounded-full
          bg-orange-300/20
          blur-3xl
        "
      />

      <div className="relative max-w-4xl">

        <div
          className="
            inline-flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-white/15
            backdrop-blur
          "
        >
          <Search className="h-8 w-8" />
        </div>

        <div
          className="
            mt-5
            inline-flex
            rounded-full
            bg-white/20
            px-4
            py-2
            text-sm
            font-bold
          "
        >
          FaultMart Marketplace
        </div>

        <h1
          className="
            mt-6
            text-4xl
            font-black
            tracking-tight
            md:text-6xl
          "
        >
          Discover Repairable
          <br />
          Products Across Nigeria
        </h1>

        <p
          className="
            mt-6
            max-w-2xl
            text-lg
            leading-8
            text-orange-100
          "
        >
          Buy faulty cars, appliances, electronics and
          repairable products from trusted sellers.
          Save money, reduce waste and give products
          a second life.
        </p>

        <div
          className="
            mt-8
            flex
            flex-wrap
            gap-8
          "
        >
          <div>
            <p className="text-3xl font-black">
              {categories.length}+
            </p>

            <p className="text-orange-100">
              Categories
            </p>
          </div>

          <div>
            <p className="text-3xl font-black">
              Thousands
            </p>

            <p className="text-orange-100">
              Listings
            </p>
          </div>

          <div>
            <p className="text-3xl font-black">
              Nationwide
            </p>

            <p className="text-orange-100">
              Coverage
            </p>
          </div>
        </div>

        <div
          className="
            mt-10
            rounded-3xl
            bg-white
            p-2
            shadow-2xl
          "
        >
          <SearchBar />
        </div>        {/* CATEGORY SHORTCUTS */}

        <div
          className="
            mt-10
            flex
            flex-wrap
            gap-3
          "
        >
          {categories
            .slice(0, 6)
            .map((category, index) => {
              const Icon =
                icons[index % icons.length];

              return (
                <Link
                  key={category.id}
                  href={`/listings?categoryId=${category.id}`}
                  className="
                    group
                    flex
                    items-center
                    gap-3
                    rounded-full
                    bg-white/15
                    px-5
                    py-3
                    font-bold
                    text-white
                    backdrop-blur
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:bg-white/25
                  "
                >
                  <div
                    className="
                      rounded-full
                      bg-white/20
                      p-2
                      transition
                      group-hover:scale-110
                    "
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <span>{category.name}</span>
                </Link>
              );
            })}
        </div>

        <div
          className="
            mt-10
            flex
            flex-wrap
            items-center
            gap-4
          "
        >
          <Link
            href="/listings"
            className="
              inline-flex
              items-center
              rounded-xl
              bg-white
              px-6
              py-3
              font-bold
              text-orange-600
              transition
              hover:bg-orange-50
            "
          >
            Browse All Listings
          </Link>

          <Link
            href="/categories"
            className="
              inline-flex
              items-center
              rounded-xl
              border
              border-white/30
              px-6
              py-3
              font-bold
              text-white
              transition
              hover:bg-white/10
            "
          >
            View Categories
          </Link>
        </div>

      </div>
    </section>
  );
}