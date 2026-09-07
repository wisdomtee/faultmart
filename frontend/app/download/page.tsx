import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownToLine,
  CheckCircle2,
  Globe2,
  ShieldCheck,
  Smartphone,
  Store,
  Wrench,
} from "lucide-react";

const features = [
  {
    icon: Wrench,
    title: "Find repairable goods",
    description:
      "Discover faulty cars, appliances, electronics, and other items with repair potential.",
  },
  {
    icon: Store,
    title: "Buy and sell",
    description:
      "Connect with buyers and sellers looking for value in repairable products.",
  },
  {
    icon: ShieldCheck,
    title: "Built for trust",
    description:
      "Use listings, offers, orders, reviews, and seller information to make better decisions.",
  },
  {
    icon: Smartphone,
    title: "Made for mobile",
    description:
      "Take FaultMart with you and browse, save, buy, and manage your marketplace activity anywhere.",
  },
];

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div className="max-w-2xl">
              <Link
                href="/"
                className="mb-10 inline-flex items-center gap-3"
              >
                <Image
                  src="/images/branding/faultmart-logo.png"
                  alt="FaultMart"
                  width={52}
                  height={52}
                  className="h-12 w-12 object-contain"
                />
                <span className="text-2xl font-bold tracking-tight text-white">
                  FaultMart
                </span>
              </Link>

              <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300">
                <Smartphone className="mr-2 h-4 w-4" />
                FaultMart Android App
              </div>

              <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Faulty.
                <br />
                Repairable.
                <br />
                <span className="text-green-400">Valuable.</span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
                Buy and sell repairable goods with FaultMart — the marketplace
                built around products that still have value.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a
                  href="/downloads/faultmart.apk"
                  download="faultmart.apk"
                  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-green-500 px-7 py-4 text-base font-bold text-slate-950 shadow-lg shadow-green-500/20 transition hover:bg-green-400"
                >
                  <ArrowDownToLine className="h-5 w-5" />
                  Download FaultMart App
                </a>

                <Link
                  href="/"
                  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/5 px-7 py-4 text-base font-semibold text-white transition hover:bg-white/10"
                >
                  <Globe2 className="h-5 w-5" />
                  Browse on Web
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Android APK
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Free to download
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Google Play coming soon
                </span>
              </div>
            </div>

            {/* App visual */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-8 rounded-full bg-green-500/10 blur-3xl" />

                <div className="relative w-[280px] rounded-[2.5rem] border border-white/15 bg-slate-900 p-3 shadow-2xl shadow-black/40 sm:w-[320px]">
                  <div className="overflow-hidden rounded-[2rem] bg-white">
                    <div className="flex h-[560px] flex-col items-center justify-center px-8 text-center">
                      <Image
                        src="/images/branding/faultmart-logo.png"
                        alt="FaultMart app"
                        width={120}
                        height={120}
                        className="h-28 w-28 object-contain"
                      />

                      <h2 className="mt-7 text-2xl font-black text-slate-950">
                        FaultMart
                      </h2>

                      <p className="mt-3 text-sm leading-6 text-slate-500">
                        The marketplace for repairable goods.
                      </p>

                      <div className="mt-8 w-full space-y-3">
                        <div className="h-12 rounded-xl bg-slate-100" />
                        <div className="h-12 rounded-xl bg-slate-100" />
                        <div className="h-12 rounded-xl bg-slate-100" />
                      </div>

                      <div className="mt-8 w-full rounded-xl bg-green-500 px-5 py-3 text-sm font-bold text-slate-950">
                        Start Exploring
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 px-6 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-600">
              Everything in one app
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Your repairable marketplace, in your pocket.
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600">
              FaultMart makes it easier to discover opportunities, connect
              with sellers, manage listings, and keep track of your
              marketplace activity.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-slate-950">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section className="px-6 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-green-500 px-6 py-14 text-center shadow-xl shadow-green-500/10 sm:px-10">
          <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Ready to join FaultMart?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-900/75">
            Download the Android app and start discovering repairable goods
            today.
          </p>

          <a
            href="/downloads/faultmart.apk"
            download="faultmart.apk"
            className="mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-slate-950 px-8 py-4 text-base font-bold text-white transition hover:bg-slate-800"
          >
            <ArrowDownToLine className="h-5 w-5" />
            Download Android App
          </a>

          <p className="mt-4 text-sm font-medium text-slate-900/60">
            Google Play availability is coming soon.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-slate-950">FaultMart</p>
            <p className="mt-1 text-sm text-slate-500">
              The marketplace for repairable goods.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
            <Link href="/" className="transition hover:text-slate-950">
              Browse
            </Link>
            <Link href="/about" className="transition hover:text-slate-950">
              About
            </Link>
            <Link href="/how-it-works" className="transition hover:text-slate-950">
              How It Works
            </Link>
            <Link href="/help" className="transition hover:text-slate-950">
              Help
            </Link>
            <Link href="/contact" className="transition hover:text-slate-950">
              Contact
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-slate-100 pt-6 text-xs text-slate-400">
          © {new Date().getFullYear()} FaultMart. Powered by TechNerve.
        </div>
      </footer>
    </main>
  );
}