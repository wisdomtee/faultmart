import Link from "next/link";
import {
  ArrowRight,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import Container from "@/components/layout/Container";

const contactOptions = [
  {
    icon: Mail,
    title: "Email",
    value: "hello@faultmart.ng",
    description: "For general questions, partnerships and marketplace enquiries.",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+234 9045903069",
    description: "For enquiries that are better handled directly.",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "Lagos, Nigeria",
    description: "FaultMart is being built for the African marketplace, starting from Nigeria.",
  },
];

const reasons = [
  "General marketplace questions",
  "Seller or buyer support",
  "Partnership and business enquiries",
  "Feedback about FaultMart",
  "Technical issues",
  "Other marketplace enquiries",
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      {/* HERO */}
      <section className="relative overflow-hidden bg-neutral-950 py-24 text-white md:py-32">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-orange-600/10 blur-3xl" />

        <Container>
          <div className="relative mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-5 py-2 text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
              <MessageCircle className="h-4 w-4" />
              Contact FaultMart
            </div>

            <h1 className="mt-7 text-4xl font-black tracking-tight md:text-6xl">
              We&apos;d love to
              <span className="block text-orange-500">hear from you.</span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-neutral-400 md:text-xl">
              Have a question, suggestion or business enquiry? Get in touch
              with the FaultMart team.
            </p>
          </div>
        </Container>
      </section>

      {/* CONTACT DETAILS */}
      <section className="py-20 md:py-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {contactOptions.map((option) => {
              const Icon = option.icon;

              return (
                <div
                  key={option.title}
                  className="rounded-[28px] border border-neutral-200 bg-white p-7 shadow-sm md:p-8"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                    <Icon className="h-7 w-7" />
                  </div>

                  <h2 className="mt-6 text-xl font-black text-neutral-900">
                    {option.title}
                  </h2>

                  <p className="mt-2 break-words font-bold text-orange-600">
                    {option.value}
                  </p>

                  <p className="mt-3 leading-7 text-neutral-600">
                    {option.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* MESSAGE SECTION */}
      <section className="border-y border-neutral-200 bg-white py-20 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-orange-600">
                Get in touch
              </p>

              <h2 className="mt-4 text-3xl font-black text-neutral-900 md:text-4xl">
                Tell us what&apos;s on your mind.
              </h2>

              <p className="mt-6 text-lg leading-8 text-neutral-600">
                Whether you are using FaultMart as a buyer, seller or business
                partner, your feedback helps us build a better marketplace.
              </p>

              <div className="mt-8 space-y-4">
                {reasons.map((reason) => (
                  <div
                    key={reason}
                    className="flex items-center gap-3 text-neutral-700"
                  >
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-neutral-200 bg-neutral-50 p-7 md:p-9">
              <h3 className="text-2xl font-black text-neutral-900">
                Contact us
              </h3>

              <p className="mt-3 leading-7 text-neutral-600">
                Send us an email and include as much useful information as
                possible so we can understand your enquiry.
              </p>

              <a
                href="mailto:hello@faultmart.ng"
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-4 font-bold text-white transition hover:bg-orange-700"
              >
                Email FaultMart
                <Mail className="h-5 w-5" />
              </a>

              <p className="mt-4 text-center text-sm text-neutral-500">
                We&apos;ll get back to you as soon as possible.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* HELP CTA */}
      <section className="py-20 md:py-24">
        <Container>
          <div className="rounded-[36px] bg-neutral-900 px-8 py-14 text-center text-white md:px-14">
            <h2 className="text-3xl font-black md:text-4xl">
              Looking for help with the marketplace?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-neutral-400">
              Before contacting us, you may find a quick answer in the
              FaultMart Help Center.
            </p>

            <Link
              href="/help"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-7 py-4 font-bold text-white transition hover:bg-orange-700"
            >
              Visit Help Center
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
