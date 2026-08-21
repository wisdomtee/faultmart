import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  Search,
  ShieldCheck,
  ShoppingBag,
  Wrench,
} from "lucide-react";

import Container from "@/components/layout/Container";

const topics = [
  {
    icon: ShoppingBag,
    title: "Buying on FaultMart",
    description:
      "Learn how to discover listings, review product conditions, contact sellers and make offers.",
  },
  {
    icon: Wrench,
    title: "Selling on FaultMart",
    description:
      "Learn how to create listings, upload photos, describe faults and communicate with interested buyers.",
  },
  {
    icon: MessageCircle,
    title: "Offers & Communication",
    description:
      "Understand offers, negotiations, conversations and what happens when an offer is accepted.",
  },
  {
    icon: ShieldCheck,
    title: "Safety & Trust",
    description:
      "Learn how to trade responsibly, identify suspicious activity and report problematic listings or users.",
  },
];

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-neutral-950 py-20 text-white md:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-5 py-2 text-sm font-bold text-orange-400">
              <Search className="h-4 w-4" />
              FaultMart Support
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">
              How can we help?
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-400">
              Find answers about buying, selling, offers, communication and
              staying safe on FaultMart.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-24">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-6 md:grid-cols-2">
              {topics.map((topic) => {
                const Icon = topic.icon;

                return (
                  <div
                    key={topic.title}
                    className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                      <Icon className="h-7 w-7" />
                    </div>

                    <h2 className="mt-6 text-xl font-black text-neutral-900">
                      {topic.title}
                    </h2>

                    <p className="mt-3 leading-7 text-neutral-600">
                      {topic.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-neutral-200 md:p-12">
              <h2 className="text-2xl font-black text-neutral-900 md:text-3xl">
                Still need help?
              </h2>

              <p className="mx-auto mt-4 max-w-xl leading-7 text-neutral-600">
                If you cannot find what you are looking for, get in touch with
                the FaultMart team and we will help you find the right answer.
              </p>

              <Link
                href="/contact"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 font-bold text-white transition hover:bg-orange-700"
              >
                Contact FaultMart
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
