import Link from "next/link";
import {
  ShoppingBag,
  Store,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import Container from "@/components/layout/Container";

export default function BuyerSeller() {
  return (
    <section className="bg-neutral-950 py-24 text-white sm:py-28">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex rounded-full bg-orange-500/10 px-4 py-2 text-sm font-bold text-orange-400">
            Built for both sides of the marketplace
          </div>

          <h2 className="mt-6 text-4xl font-black sm:text-5xl">
            Whether you're buying or selling,
            <span className="text-orange-500">
              {" "}FaultMart works for you.
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-neutral-400">
            Find opportunities, disclose faults honestly, negotiate directly
            and create more value from products that might otherwise be
            discarded.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* BUYER */}
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 sm:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10">
              <ShoppingBag className="h-7 w-7 text-orange-500" />
            </div>

            <h3 className="mt-7 text-2xl font-black">
              I'm a Buyer
            </h3>

            <p className="mt-4 leading-7 text-neutral-400">
              Find repairable products at prices that leave room for
              restoration and value creation.
            </p>

            <ul className="mt-7 space-y-4">
              {[
                "Browse repairable products",
                "Understand the reported fault",
                "View seller information",
                "Message the seller",
                "Make an offer",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-neutral-300"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-orange-500" />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/listings"
              className="
                mt-8
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-orange-600
                px-7
                py-3.5
                font-bold
                transition
                hover:bg-orange-700
              "
            >
              Start Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* SELLER */}
          <div className="rounded-[32px] border border-orange-500/20 bg-orange-500/10 p-8 sm:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500">
              <Store className="h-7 w-7 text-white" />
            </div>

            <h3 className="mt-7 text-2xl font-black">
              I'm a Seller
            </h3>

            <p className="mt-4 leading-7 text-orange-100/70">
              Turn faulty, unused or repairable products into money by
              connecting with buyers who understand their value.
            </p>

            <ul className="mt-7 space-y-4">
              {[
                "Create a detailed listing",
                "Upload product photos",
                "Explain the fault clearly",
                "Receive buyer messages",
                "Receive and manage offers",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-orange-50"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-orange-300" />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/login"
              className="
                mt-8
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-white
                px-7
                py-3.5
                font-bold
                text-orange-600
                transition
                hover:bg-orange-50
              "
            >
              Sell on FaultMart
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}