import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
  Globe,
} from "lucide-react";

import BuiltByTechNerve from "@/components/branding/BuiltByTechNerve";
import Container from "./Container";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-neutral-950 text-white">
      <Container>

        <div className="grid gap-12 py-20 lg:grid-cols-5">

          {/* Brand */}
          <div className="lg:col-span-2">

            <Logo dark />

            <p className="mt-6 max-w-md leading-7 text-neutral-400">
              Africa's trusted marketplace for new & repairable
              vehicles, phones, electronics & appliances.
              Buy smarter, sell faster and trade with complete
              transparency.
            </p>

            {/* Contact */}

            <div className="mt-8 space-y-4">

              <div className="flex items-center gap-3 text-neutral-400">
                <Mail className="h-5 w-5 text-orange-500" />
                <span>hello@faultmart.ng</span>
              </div>

              <div className="flex items-center gap-3 text-neutral-400">
                <Phone className="h-5 w-5 text-orange-500" />
                <span>+234 9045903069</span>
              </div>

              <div className="flex items-center gap-3 text-neutral-400">
                <MapPin className="h-5 w-5 text-orange-500" />
                <span>Lagos, Nigeria</span>
              </div>

            </div>

            {/* Website */}

            <div className="mt-8">

              <Link
                href="/"
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-white/5
                  px-4
                  py-3
                  transition
                  hover:bg-orange-600
                "
              >
                <Globe className="h-5 w-5" />
                Visit FaultMart
              </Link>

            </div>

          </div>

          {/* Marketplace */}

          <div>

            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-orange-500">
              Marketplace
            </h3>

            <ul className="space-y-4 text-neutral-400">

              <li>
                <Link
                  href="/listings"
                  className="transition hover:text-orange-400"
                >
                  Browse Listings
                </Link>
              </li>

              <li>
                <Link
                  href="/categories"
                  className="transition hover:text-orange-400"
                >
                  Categories
                </Link>
              </li>

              <li>
                <Link
                  href="/sell"
                  className="transition hover:text-orange-400"
                >
                  Sell an Item
                </Link>
              </li>

              <li>
                <Link
                  href="/latest"
                  className="transition hover:text-orange-400"
                >
                  Latest Listings
                </Link>
              </li>

            </ul>

          </div>          {/* Company */}

          <div>

            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-orange-500">
              Company
            </h3>

            <ul className="space-y-4 text-neutral-400">

              <li>
                <Link
                  href="/about"
                  className="transition hover:text-orange-400"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="transition hover:text-orange-400"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  href="/careers"
                  className="transition hover:text-orange-400"
                >
                  Careers
                </Link>
              </li>

              <li>
                <Link
                  href="/blog"
                  className="transition hover:text-orange-400"
                >
                  Blog
                </Link>
              </li>

            </ul>

          </div>

          {/* Support */}

          <div>

            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-orange-500">
              Support
            </h3>

            <ul className="space-y-4 text-neutral-400">

              <li>
                <Link
                  href="/help"
                  className="transition hover:text-orange-400"
                >
                  Help Center
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy"
                  className="transition hover:text-orange-400"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="transition hover:text-orange-400"
                >
                  Terms of Service
                </Link>
              </li>

              <li>
                <Link
                  href="/report"
                  className="transition hover:text-orange-400"
                >
                  Report Abuse
                </Link>
              </li>

            </ul>

          </div>

        </div>

        {/* Bottom */}

        <div className="flex flex-col items-center justify-between gap-5 border-t border-white/10 py-8 md:flex-row">

  <p className="text-sm text-neutral-500">
    © {new Date().getFullYear()} FaultMart.
    All rights reserved.
  </p>

  <BuiltByTechNerve
    width={110}
    height={32}
    className="h-7 w-auto object-contain"
  />

</div>

      </Container>
    </footer>
  );
}