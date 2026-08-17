import {
  Search,
  Wrench,
  HandCoins,
  Recycle,
} from "lucide-react";

import Container from "@/components/layout/Container";

const points = [
  {
    icon: Search,
    title: "Find Hidden Value",
    description:
      "Discover products that may need repairs but still have significant value.",
  },
  {
    icon: Wrench,
    title: "Know the Fault",
    description:
      "Listings are designed to clearly communicate what works, what doesn't and what may need repair.",
  },
  {
    icon: HandCoins,
    title: "Negotiate Directly",
    description:
      "Buyers can communicate with sellers and make offers based on the condition of the item.",
  },
  {
    icon: Recycle,
    title: "Give Products a Second Life",
    description:
      "Repair instead of replacing. Turn faulty products into useful products again.",
  },
];

export default function WhatIsFaultMart() {
  return (
    <section className="bg-white py-24 sm:py-28">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          {/* INTRO */}
          <div>
            <div
              className="
                inline-flex
                rounded-full
                bg-orange-100
                px-4
                py-2
                text-sm
                font-bold
                text-orange-600
              "
            >
              What is FaultMart?
            </div>

            <h2
  className="
    mt-6
    text-4xl
    font-black
    tracking-tight
    text-neutral-900
    sm:text-5xl
  "
>
  Broken doesn't mean{" "}
  <span className="text-orange-600">
    worthless.
  </span>
</h2>

            <p className="mt-6 text-lg leading-8 text-neutral-600">
              Not everything that is broken is useless. FaultMart connects
              people who have repairable products with people who know how
              to repair, reuse or restore them.
            </p>

            <p className="mt-5 text-base leading-7 text-neutral-500">
              Instead of hiding faults or throwing useful products away,
              FaultMart makes the condition visible so buyers and sellers
              can make better decisions.
            </p>
          </div>

          {/* FEATURES */}
          <div className="grid gap-5 sm:grid-cols-2">
            {points.map((point) => {
              const Icon = point.icon;

              return (
                <div
                  key={point.title}
                  className="
                    rounded-3xl
                    border border-neutral-200
                    bg-neutral-50
                    p-7
                    transition
                    hover:-translate-y-1
                    hover:border-orange-200
                    hover:bg-white
                    hover:shadow-lg
                  "
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100">
                    <Icon className="h-6 w-6 text-orange-600" />
                  </div>

                  <h3 className="mt-5 text-lg font-black text-neutral-900">
                    {point.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-neutral-600">
                    {point.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}