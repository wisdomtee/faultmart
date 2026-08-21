import Link from "next/link";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

import {
  ArrowRight,
  Car,
  CheckCircle2,
  Eye,
  Heart,
  MapPin,
  Refrigerator,
  Search,
  ShieldCheck,
  Smartphone,
  Tv,
  Wrench,
} from "lucide-react";

export default function Hero() {
  const quickCategories = [
    {
      name: "Vehicles",
      icon: Car,
    },
    {
      name: "Phones",
      icon: Smartphone,
    },
    {
      name: "Electronics",
      icon: Tv,
    },
    {
      name: "Appliances",
      icon: Refrigerator,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white">
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <div
          className="
            absolute
            inset-0
            bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)]
            bg-[size:64px_64px]
          "
        />

        <div
          className="
            absolute
            -left-48
            top-20
            h-[500px]
            w-[500px]
            rounded-full
            bg-orange-600/15
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -right-40
            top-0
            h-[600px]
            w-[600px]
            rounded-full
            bg-orange-500/10
            blur-3xl
          "
        />
      </div>

      <Container>
        <div
          className="
            relative
            grid
            items-center
            gap-16
            py-20
            lg:grid-cols-[1.05fr_0.95fr]
            lg:gap-12
            lg:py-28
            xl:py-32
          "
        >
          {/* LEFT */}
          <div className="max-w-2xl">
            {/* BADGE */}
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-orange-500/30
                bg-orange-500/10
                px-4
                py-2
                text-xs
                font-bold
                uppercase
                tracking-[0.16em]
                text-orange-400
                sm:text-sm
              "
            >
              <Wrench className="h-4 w-4" />

              Africa's Repairable Goods Marketplace
            </div>

            {/* HEADING */}
            <h1
              className="
                mt-7
                text-5xl
                font-black
                leading-[0.98]
                tracking-tight
                sm:text-6xl
                xl:text-7xl
              "
            >
              Faulty
              <br />

              <span className="text-orange-500">
                doesn't mean
              </span>

              <br />

              worthless.
            </h1>

            {/* DESCRIPTION */}
            <p
              className="
                mt-7
                max-w-xl
                text-lg
                leading-8
                text-neutral-300
                sm:text-xl
              "
            >
              Buy and sell vehicles, phones, electronics and appliances
              that still have value — even when they need repair.
            </p>

            <p
              className="
                mt-4
                max-w-xl
                text-base
                leading-7
                text-neutral-400
              "
            >
              See the fault. Understand the condition. Connect with the
              seller. Make an informed offer.
            </p>

            {/* ACTIONS */}
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/listings">
                <Button
                  size="lg"
                  className="
                    h-14
                    rounded-xl
                    bg-orange-600
                    px-7
                    text-base
                    font-bold
                    hover:bg-orange-700
                  "
                >
                  Explore Marketplace

                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Link href="/login">
                <Button
                  size="lg"
                  variant="secondary"
                  className="
                    h-14
                    rounded-xl
                    px-7
                    text-base
                    font-bold
                  "
                >
                  Sell a Repairable Item
                </Button>
              </Link>
            </div>

            {/* QUICK CATEGORIES */}
            <div className="mt-9">
              <p
                className="
                  mb-3
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-neutral-500
                "
              >
                Explore categories
              </p>

              <div className="flex flex-wrap gap-2.5">
                {quickCategories.map((category) => {
                  const Icon = category.icon;

                  return (
                    <Link
                      key={category.name}
                      href="/listings"
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-white/10
                        bg-white/5
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-neutral-300
                        transition
                        hover:border-orange-500/40
                        hover:bg-orange-600
                        hover:text-white
                      "
                    >
                      <Icon className="h-4 w-4" />

                      {category.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* TRUST */}
            <div
              className="
                mt-8
                flex
                flex-wrap
                items-center
                gap-x-6
                gap-y-3
                text-sm
                text-neutral-400
              "
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                Transparent listings
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-orange-500" />
                Direct negotiation
              </div>
            </div>
          </div>

          {/* RIGHT — MARKETPLACE VISUAL */}
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            {/* Decorative glow */}
            <div
              className="
                absolute
                left-1/2
                top-1/2
                h-[360px]
                w-[360px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-orange-500/20
                blur-3xl
              "
            />

            {/* Main marketplace card */}
            <div
              className="
                relative
                overflow-hidden
                rounded-[32px]
                border
                border-white/10
                bg-white/[0.06]
                p-4
                shadow-2xl
                backdrop-blur-xl
                sm:p-5
              "
            >
              {/* Fake browser/header */}
              <div
                className="
                  mb-4
                  flex
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  border-white/10
                  bg-black/30
                  px-4
                  py-3
                "
              >
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                  <span className="text-sm font-bold text-white">
                    FaultMart Marketplace
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                  Trusted
                </div>
              </div>

              {/* Product visual */}
              <div
                className="
                  relative
                  overflow-hidden
                  rounded-[24px]
                  border
                  border-white/10
                  bg-neutral-900
                "
              >
                <div
                  className="
                    flex
                    aspect-[4/3]
                    items-center
                    justify-center
                    bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.22),transparent_55%)]
                  "
                >
                  <Car
                    className="
                      h-32
                      w-32
                      text-orange-500
                      drop-shadow-[0_0_30px_rgba(249,115,22,0.35)]
                      sm:h-40
                      sm:w-40
                    "
                    strokeWidth={1}
                  />
                </div>

                {/* Condition badge */}
                <div className="absolute left-4 top-4">
                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      bg-orange-600
                      px-3
                      py-1.5
                      text-xs
                      font-bold
                      text-white
                      shadow-lg
                    "
                  >
                    <Wrench className="h-3.5 w-3.5" />
                    Needs Repair
                  </div>
                </div>

                {/* Favorite */}
                <div
                  className="
                    absolute
                    right-4
                    top-4
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-black/50
                    text-white
                    backdrop-blur
                  "
                >
                  <Heart className="h-4.5 w-4.5" />
                </div>
              </div>

              {/* Product information */}
              <div className="px-1 pb-1 pt-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xl font-black text-white sm:text-2xl">
                      2016 Toyota Camry
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-sm text-neutral-400">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      Lagos, Nigeria
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-medium text-neutral-500">
                      Asking price
                    </p>

                    <p className="mt-1 text-lg font-black text-orange-500">
                      ₦4.2M
                    </p>
                  </div>
                </div>

                {/* Fault report */}
                <div
                  className="
                    mt-5
                    rounded-2xl
                    border
                    border-orange-500/20
                    bg-orange-500/5
                    p-4
                  "
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-orange-500" />

                      <span className="text-sm font-bold text-white">
                        Fault Report
                      </span>
                    </div>

                    <span className="rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-bold text-orange-400">
                      Moderate
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-neutral-400">
                    Engine requires attention. Exterior and interior remain
                    in usable condition.
                  </p>
                </div>

                {/* Bottom stats */}
                <div
                  className="
                    mt-4
                    grid
                    grid-cols-3
                    divide-x
                    divide-white/10
                    rounded-2xl
                    border
                    border-white/10
                    bg-black/20
                    py-3
                  "
                >
                  <div className="text-center">
                    <p className="text-xs text-neutral-500">
                      Condition
                    </p>

                    <p className="mt-1 text-xs font-bold text-white">
                      Repairable
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-neutral-500">
                      Views
                    </p>

                    <div className="mt-1 flex items-center justify-center gap-1 text-xs font-bold text-white">
                      <Eye className="h-3.5 w-3.5" />
                      128
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-neutral-500">
                      Seller
                    </p>

                    <p className="mt-1 text-xs font-bold text-green-500">
                      Verified
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating transparency card */}
            <div
              className="
                absolute
                -bottom-6
                -left-5
                hidden
                rounded-2xl
                border
                border-white/10
                bg-neutral-900/95
                p-4
                shadow-2xl
                backdrop-blur-xl
                sm:block
                lg:-left-8
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-green-500/10
                  "
                >
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                </div>

                <div>
                  <p className="text-xs font-medium text-neutral-500">
                    Transparency
                  </p>

                  <p className="text-sm font-bold text-white">
                    Know the fault before you buy
                  </p>
                </div>
              </div>
            </div>

            {/* Floating search card */}
            <div
              className="
                absolute
                -right-4
                -top-5
                hidden
                rounded-2xl
                border
                border-white/10
                bg-neutral-900/95
                p-3
                shadow-2xl
                backdrop-blur-xl
                sm:block
                lg:-right-7
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-orange-500/10
                  "
                >
                  <Search className="h-4 w-4 text-orange-500" />
                </div>

                <div>
                  <p className="text-xs text-neutral-500">
                    Marketplace
                  </p>

                  <p className="text-sm font-bold text-white">
                    Find something worth fixing
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}