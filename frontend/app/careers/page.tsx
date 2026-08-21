import Link from "next/link";
import {
  BriefcaseBusiness,
  MapPin,
  Clock3,
  ArrowRight,
} from "lucide-react";

import { getCareers } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function CareersPage() {
  const result = await getCareers({
    page: 1,
    limit: 50,
  });

  const jobs = result?.jobs ?? [];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              <BriefcaseBusiness className="h-4 w-4" />
              Careers at FaultMart
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Build the future of repairable goods with us.
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              We are building a marketplace that makes it easier for people
              across Africa to buy, sell, repair, and reuse faulty vehicles
              and appliances.
            </p>
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Open positions
          </h2>

          <p className="mt-2 text-slate-600">
            Explore opportunities to join the FaultMart team.
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <BriefcaseBusiness className="h-7 w-7 text-slate-500" />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-900">
              No open positions right now
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              We don't have any open positions at the moment. Please check
              back later for new opportunities at FaultMart.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Back to home
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {jobs.map((job: any) => (
              <Link
                key={job.id}
                href={`/careers/${job.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600">
                      {job.title}
                    </h3>

                    <p className="mt-2 text-sm font-medium text-blue-600">
                      {job.department}
                    </p>
                  </div>

                  <ArrowRight className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
                </div>

                <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="h-4 w-4" />
                    {String(job.employmentType).replaceAll("_", " ")}
                  </span>
                </div>

                {job.salaryRange && (
                  <p className="mt-4 text-sm font-medium text-slate-700">
                    {job.salaryRange}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}