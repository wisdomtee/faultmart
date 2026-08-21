import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Wrench,
  ShieldCheck,
  Users,
  Search,
} from "lucide-react";

import Container from "@/components/layout/Container";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 py-20 text-white md:py-28">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 text-sm font-bold backdrop-blur">
              <Wrench className="h-4 w-4" />
              About FaultMart
            </div>

            <h1 className="mt-7 text-4xl font-black tracking-tight md:text-6xl">
              Giving Repairable Products
              <span className="block text-orange-100">
                A Second Chance.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-orange-50 md:text-xl">
              FaultMart is a marketplace built to connect buyers with
              repairable vehicles, electronics, appliances and other
              faulty products across Nigeria.
            </p>
          </div>
        </Container>
      </section>

      {/* STORY */}
      <section className="py-20 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-orange-600">
                What is FaultMart?
              </p>

              <h2 className="mt-4 text-3xl font-black text-neutral-900 md:text-4xl">
                A marketplace for things that can still be fixed.
              </h2>

              <p className="mt-6 text-lg leading-8 text-neutral-600">
                Many products are discarded simply because they are faulty,
                damaged or no longer working perfectly. FaultMart creates a
                dedicated marketplace where these products can find buyers
                who have the skills, resources or interest to repair them.
              </p>

              <p className="mt-5 text-lg leading-8 text-neutral-600">
                Our goal is simple: make it easier to discover repairable
                products while helping sellers reach buyers who understand
                their value.
              </p>

              <Link
                href="/listings"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 font-bold text-white transition hover:bg-orange-700"
              >
                Browse Listings
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm md:p-10">
              <div className="grid gap-7">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                    <Search className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="font-black text-neutral-900">
                      Discover
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-neutral-500">
                      Find repairable products from sellers across the
                      marketplace.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                    <Users className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="font-black text-neutral-900">
                      Connect
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-neutral-500">
                      Buyers and sellers can communicate and negotiate
                      directly.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                    <ShieldCheck className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="font-black text-neutral-900">
                      Trade
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-neutral-500">
                      Move from discovery and negotiation toward a
                      marketplace transaction.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* VALUES */}
      <section className="border-y bg-white py-20 md:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-orange-600">
              Why FaultMart?
            </p>

            <h2 className="mt-4 text-3xl font-black text-neutral-900 md:text-4xl">
              Built around repair, reuse and opportunity.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Wrench,
                title: "Repair First",
                text: "We make it easier to find products that still have useful life when repaired.",
              },
              {
                icon: Users,
                title: "Connect People",
                text: "We bring buyers, sellers, technicians and repair-minded people together.",
              },
              {
                icon: CheckCircle2,
                title: "Create Value",
                text: "A faulty product does not always mean a worthless product.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-neutral-200 bg-gray-50 p-8"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="mt-6 text-xl font-black text-neutral-900">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-7 text-neutral-600">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20">
        <Container>
          <div className="rounded-[32px] bg-neutral-900 px-8 py-14 text-center text-white md:px-14">
            <h2 className="text-3xl font-black md:text-4xl">
              Ready to explore FaultMart?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-neutral-400">
              Browse repairable products or list something that deserves
              a second chance.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/listings"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-7 py-3.5 font-bold text-white transition hover:bg-orange-700"
              >
                Browse Listings
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/listings/create"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-700 px-7 py-3.5 font-bold text-white transition hover:bg-neutral-800"
              >
                Sell on FaultMart
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}