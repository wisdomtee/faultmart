import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Flag,
  ShieldCheck,
} from "lucide-react";

import Container from "@/components/layout/Container";

const reportTypes = [
  "Suspicious or fraudulent listing",
  "Misleading product information",
  "Abusive or inappropriate behavior",
  "Scam or attempted fraud",
  "Prohibited or illegal item",
  "Other marketplace concern",
];

export default function ReportPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-neutral-950 py-20 text-white md:py-28">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-5 py-2 text-sm font-bold text-orange-400">
              <ShieldCheck className="h-4 w-4" />
              Marketplace Safety
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">
              Report a Problem
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-400">
              Help us keep FaultMart safe and trustworthy by reporting listings,
              accounts or behavior that violate our marketplace standards.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
              <div className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm md:p-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                  <Flag className="h-7 w-7" />
                </div>

                <h2 className="mt-6 text-2xl font-black text-neutral-900 md:text-3xl">
                  What can you report?
                </h2>

                <p className="mt-4 leading-7 text-neutral-600">
                  You can report anything that appears suspicious, misleading,
                  abusive or inconsistent with the way FaultMart is intended
                  to operate.
                </p>

                <div className="mt-7 space-y-3">
                  {reportTypes.map((type) => (
                    <div
                      key={type}
                      className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3.5 text-sm font-medium text-neutral-700"
                    >
                      <AlertTriangle className="h-4 w-4 shrink-0 text-orange-500" />
                      {type}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-neutral-200 md:p-10">
                <h2 className="text-2xl font-black text-neutral-900">
                  Need to report something?
                </h2>

                <p className="mt-4 leading-7 text-neutral-600">
                  Provide as much useful information as possible, including the
                  listing, account or conversation involved and a short
                  explanation of the problem.
                </p>

                <div className="mt-7 rounded-2xl border border-orange-100 bg-orange-50 p-5">
                  <p className="text-sm font-bold text-orange-800">
                    Please do not include passwords or other sensitive account
                    credentials in a report.
                  </p>
                </div>

                <Link
                  href="/contact"
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 font-bold text-white transition hover:bg-orange-700"
                >
                  Contact FaultMart
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/help"
                  className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-neutral-200 px-6 py-3.5 font-bold text-neutral-800 transition hover:bg-neutral-50"
                >
                  Visit Help Center
                </Link>
              </div>
            </div>

            <div className="mt-10 rounded-3xl bg-neutral-900 p-8 text-white md:p-10">
              <h2 className="text-2xl font-black">
                Trading safely on FaultMart
              </h2>

              <p className="mt-4 max-w-3xl leading-7 text-neutral-400">
                Review listing details carefully, ask questions when something
                is unclear and avoid sharing unnecessary personal information.
                If something does not look right, report it rather than
                ignoring it.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
