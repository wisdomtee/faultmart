import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Clock3,
  MapPin,
} from "lucide-react";

import { getCareerBySlug } from "@/lib/api";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CareerDetailsPage({ params }: Props) {
  const { slug } = await params;

  const job = await getCareerBySlug(slug);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to careers
          </Link>

          <div className="mt-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              <BriefcaseBusiness className="h-4 w-4" />
              Open position
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              {job.title}
            </h1>

            <p className="mt-3 text-lg font-medium text-blue-600">
              {job.department}
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>

              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                {String(job.employmentType).replaceAll("_", " ")}
              </span>

              {job.salaryRange && (
                <span className="font-medium text-slate-800">
                  {job.salaryRange}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
          <article className="rounded-2xl border border-slate-200 bg-white p-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                About the role
              </h2>

              <div className="mt-4 whitespace-pre-line leading-8 text-slate-600">
                {job.description}
              </div>
            </section>

            <section className="mt-10 border-t pt-10">
              <h2 className="text-2xl font-bold text-slate-900">
                Responsibilities
              </h2>

              <div className="mt-4 whitespace-pre-line leading-8 text-slate-600">
                {job.responsibilities}
              </div>
            </section>

            <section className="mt-10 border-t pt-10">
              <h2 className="text-2xl font-bold text-slate-900">
                Requirements
              </h2>

              <div className="mt-4 whitespace-pre-line leading-8 text-slate-600">
                {job.requirements}
              </div>
            </section>
          </article>

          {/* Apply */}
          <aside>
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Interested in this role?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Submit your application and let the FaultMart team know why
                you're a great fit.
              </p>

              <Link
                href={`/careers/${job.slug}/apply`}
                className="mt-6 flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Apply for this position
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}