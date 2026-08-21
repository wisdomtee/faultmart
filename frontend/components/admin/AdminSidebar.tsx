"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Car,
  ShoppingCart,
  Flag,
} from "lucide-react";

import FaultMartLogo from "@/components/branding/FaultMartLogo";
import BuiltByTechNerve from "@/components/branding/BuiltByTechNerve";

const links = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Listings",
    href: "/admin/listings",
    icon: Car,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "Reports",
    href: "/admin/reports",
    icon: Flag,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-64 flex-col bg-slate-950 text-white">

      {/* Brand */}
      <div className="border-b border-white/10 px-6 py-6">

        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <FaultMartLogo
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
          />

          <div>
            <div className="text-xl font-bold tracking-tight">
              <span className="text-red-500">
                Fault
              </span>

              <span className="text-white">
                Mart
              </span>
            </div>

            <p className="mt-0.5 text-xs text-slate-400">
              Administration
            </p>
          </div>
        </Link>

      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-6">

        <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Management
        </p>

        {links.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3
                rounded-xl
                px-4 py-3
                text-sm font-medium
                transition
                ${
                  isActive
                    ? "bg-red-600 text-white shadow-lg shadow-red-950/30"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }
              `}
            >
              <Icon size={19} />

              <span>
                {item.name}
              </span>
            </Link>
          );
        })}

      </nav>

      {/* Bottom Branding */}
      <div className="border-t border-white/10 p-5">

        <BuiltByTechNerve
          width={105}
          height={30}
        />

        <Link
          href="/"
          className="mt-4 block text-center text-xs text-slate-500 transition hover:text-white"
        >
          ← Back to FaultMart
        </Link>

      </div>

    </aside>
  );
}