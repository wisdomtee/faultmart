import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FilePlus2,
  Handshake,
  MessagesSquare,
  Search,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import Container from "@/components/layout/Container";

const steps = [
  {
    number: "01",
    title: "List What You Have",
    description:
      "Create a clear listing with photos, pricing, location, condition and an honest description of what works and what needs repair.",
    icon: FilePlus2,
  },
  {
    number: "02",
    title: "Connect & Negotiate",
    description:
      "Interested buyers can ask questions, communicate with sellers and make offers based on the item's condition and value.",
    icon: MessagesSquare,
  },
  {
    number: "03",
    title: "Make the Deal",
    description:
      "Agree on the right offer, complete the transaction and give a useful product a second chance instead of letting it go to waste.",
    icon: Handshake,
  },
];

const buyerPoints = [
  "Browse vehicles, electronics, appliances and other repairable products.",
  "Review photos, descriptions, condition and fault information before deciding.",
  "Contact sellers when you need more information.",
  "Make an offer when negotiation makes sense.",
  "Complete the transaction and give the product a second life.",
];

const sellerPoints = [
  "Create a listing with accurate information about your product.",
  "Upload clear photos so buyers know what they are considering.",
  "Explain the condition and faults honestly.",
  "Respond to interested buyers and negotiate when appropriate.",
  "Turn unused or faulty items into value instead of leaving them idle.",
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-neutral-950 py-24 text-white md:py-32">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-orange-600/10 blur-3xl" />

        <Container>
          <div className="relative mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-5 py-2 text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
              <CheckCircle2 className="h-4 w-4" />
              Simple Process
            </div>

            <h1 className="mt-7 text-4xl font-black tracking-tight md:text-6xl">
              How FaultMart
              <span className="block text-orange-500">Works</span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-neutral-400 md:text-xl">
              FaultMart makes it easier to buy and sell repairable products
              through a simple, transparent marketplace built around real
              conversations and real value.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/listings"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-7 py-4 font-bold text-white transition hover:bg-orange-700"
              >
                Browse Listings
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="/listings/create"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-7 py-4 font-bold text-white transition hover:bg-white/10"
              >
                Sell on FaultMart
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* CORE PROCESS */}
      <section className="py-24 md:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-orange-600">
              The FaultMart Journey
            </p>

            <h2 className="mt-4 text-3xl font-black text-neutral-900 md:text-5xl">
              From faulty product to useful opportunity.
            </h2>

            <p className="mt-6 text-lg leading-8 text-neutral-600">
              Whether you are selling something that needs repair or looking
              for your next project, FaultMart keeps the journey straightforward.
            </p>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="group relative overflow-hidden rounded-[32px] border border-neutral-200 bg-neutral-50 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-orange-200 hover:shadow-xl"
                >
                  <div className="absolute right-6 top-3 text-7xl font-black text-neutral-200/70">
                    {step.number}
                  </div>

                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-lg shadow-orange-600/20 transition group-hover:scale-105">
                    <Icon className="h-8 w-8" />
                  </div>

                  <h3 className="relative mt-8 text-2xl font-black text-neutral-900">
                    {step.title}
                  </h3>

                  <p className="mt-4 leading-7 text-neutral-600">
                    {step.description}
                  </p>

                  <div className="mt-8 flex items-center gap-2 text-sm font-bold text-orange-600">
                    Step {step.number}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* BUYER / SELLER */}
      <section className="border-y border-neutral-200 bg-neutral-50 py-24 md:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-orange-600">
              Built For Both Sides
            </p>

            <h2 className="mt-4 text-3xl font-black text-neutral-900 md:text-5xl">
              One marketplace. Two simple journeys.
            </h2>

            <p className="mt-6 text-lg leading-8 text-neutral-600">
              FaultMart connects people who have something to sell with people
              who see value in fixing, reusing or restoring it.
            </p>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            {/* BUYER */}
            <div className="rounded-[32px] border border-neutral-200 bg-white p-8 shadow-sm md:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <Search className="h-7 w-7" />
              </div>

              <h3 className="mt-7 text-2xl font-black text-neutral-900">
                For Buyers
              </h3>

              <p className="mt-3 leading-7 text-neutral-600">
                Find products with potential, understand their condition and
                connect directly with sellers.
              </p>

              <div className="mt-8 space-y-4">
                {buyerPoints.map((point) => (
                  <div key={point} className="flex gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-orange-600" />
                    <p className="leading-7 text-neutral-700">{point}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/listings"
                className="mt-8 inline-flex items-center gap-2 font-bold text-orange-600 transition hover:text-orange-700"
              >
                Start browsing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* SELLER */}
            <div className="rounded-[32px] border border-neutral-200 bg-white p-8 shadow-sm md:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <FilePlus2 className="h-7 w-7" />
              </div>

              <h3 className="mt-7 text-2xl font-black text-neutral-900">
                For Sellers
              </h3>

              <p className="mt-3 leading-7 text-neutral-600">
                Turn faulty, damaged or unused products into opportunities by
                putting them in front of people who understand their value.
              </p>

              <div className="mt-8 space-y-4">
                {sellerPoints.map((point) => (
                  <div key={point} className="flex gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-orange-600" />
                    <p className="leading-7 text-neutral-700">{point}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/listings/create"
                className="mt-8 inline-flex items-center gap-2 font-bold text-orange-600 transition hover:text-orange-700"
              >
                Create a listing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* TRUST */}
      <section className="py-24 md:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-orange-600">
                Why The Process Matters
              </p>

              <h2 className="mt-4 text-3xl font-black text-neutral-900 md:text-5xl">
                Transparency starts with the listing.
              </h2>

              <p className="mt-6 text-lg leading-8 text-neutral-600">
                A faulty product is not automatically a worthless product.
                Buyers need honest information, and sellers need a marketplace
                where the right audience can find what they have.
              </p>

              <p className="mt-5 text-lg leading-8 text-neutral-600">
                FaultMart is designed around that connection: clear listings,
                direct communication and informed decisions.
              </p>
            </div>

            <div className="rounded-[36px] bg-neutral-950 p-8 text-white md:p-10">
              <div className="grid gap-7 sm:grid-cols-2">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-600">
                    <ShieldCheck className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 text-xl font-black">
                    Honest Information
                  </h3>

                  <p className="mt-2 leading-7 text-neutral-400">
                    Understand what works, what does not and what may need
                    attention.
                  </p>
                </div>

                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-600">
                    <MessagesSquare className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 text-xl font-black">
                    Direct Communication
                  </h3>

                  <p className="mt-2 leading-7 text-neutral-400">
                    Ask questions and discuss the product before making a
                    decision.
                  </p>
                </div>

                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-600">
                    <Handshake className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 text-xl font-black">
                    Better Deals
                  </h3>

                  <p className="mt-2 leading-7 text-neutral-400">
                    Buyers and sellers can work toward a price that makes
                    sense for both sides.
                  </p>
                </div>

                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-600">
                    <Wrench className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 text-xl font-black">
                    Second Chances
                  </h3>

                  <p className="mt-2 leading-7 text-neutral-400">
                    Keep repairable products in use and create value from what
                    might otherwise be discarded.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-24 md:pb-28">
        <Container>
          <div className="rounded-[36px] bg-orange-600 px-8 py-16 text-center text-white md:px-14">
            <h2 className="text-3xl font-black md:text-5xl">
              Ready to give something a second chance?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-orange-50">
              Explore the marketplace, find your next repair project or list
              something that still has value.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/listings"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 px-7 py-4 font-bold text-white transition hover:bg-neutral-900"
              >
                Browse Listings
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="/listings/create"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-7 py-4 font-bold text-white transition hover:bg-white/10"
              >
                Sell an Item
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}