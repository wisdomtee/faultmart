"use client";

import {
  Eye,
  Heart,
  ListChecks,
  MessageSquare,
  PackageCheck,
  ShoppingBag,
  Wallet,
} from "lucide-react";

interface DashboardStatsProps {
  stats: {
    totalListings: number;
    activeListings: number;
    soldListings: number;
    draftListings: number;
    totalViews: number;
    totalFavorites: number;
    totalOffers: number;
    totalRevenue: number;
  };
}

const cards = [
  {
    key: "totalListings",
    label: "Total Listings",
    icon: ListChecks,
  },
  {
    key: "activeListings",
    label: "Active Listings",
    icon: ShoppingBag,
  },
  {
    key: "soldListings",
    label: "Sold",
    icon: PackageCheck,
  },
  {
    key: "totalViews",
    label: "Total Views",
    icon: Eye,
  },
  {
    key: "totalFavorites",
    label: "Favorites",
    icon: Heart,
  },
  {
    key: "totalOffers",
    label: "Offers",
    icon: MessageSquare,
  },
  {
    key: "totalRevenue",
    label: "Revenue",
    icon: Wallet,
  },
] as const;

export default function DashboardStats({
  stats,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = stats[card.key];

        const formattedValue =
          card.key === "totalRevenue"
            ? `₦${Number(value).toLocaleString()}`
            : Number(value).toLocaleString();

        return (
          <div
            key={card.key}
            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500">
                  {card.label}
                </p>

                <p className="mt-2 text-2xl font-bold text-neutral-900">
                  {formattedValue}
                </p>
              </div>

              <div className="rounded-xl bg-neutral-100 p-3">
                <Icon className="h-5 w-5 text-neutral-700" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}