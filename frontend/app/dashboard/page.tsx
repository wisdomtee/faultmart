"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Eye,
  Heart,
  ListChecks,
  Package,
  Plus,
  ShoppingBag,
  Tag,
  UserCircle,
} from "lucide-react";

import { getSellerDashboard } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentListings from "@/components/dashboard/RecentListings";
import RecentOffers from "@/components/dashboard/RecentOffers";
import RecentOrders from "@/components/dashboard/RecentOrders";
import ListingPerformance from "@/components/dashboard/ListingPerformance";
import SalesOverview from "@/components/dashboard/SalesOverview";
import Deliveries from "@/components/dashboard/Deliveries";

type DashboardData = {
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
  analytics: {
    salesTrend: Array<{
      createdAt: string;
      _sum?: {
        amount?: number | null;
      };
    }>;
    monthlyRevenue: {
      revenue: number;
      orders: number;
    };
    listingPerformance: Array<{
      id: string;
      title: string;
      slug?: string;
      views?: number;
      price?: number | string | null;
      _count?: {
        favorites: number;
        offers: number;
      };
      images?: Array<{
        url: string;
      }>;
    }>;
  };
  recentListings: unknown[];
  deliveries: unknown[];
  recentOffers: unknown[];
  recentOrders: unknown[];
  topListings: Array<{
    id: string;
    title: string;
    slug?: string;
    views?: number;
    price?: number | string | null;
    _count?: {
      favorites: number;
      offers: number;
    };
    images?: Array<{
      url: string;
    }>;
  }>;
  lowPerformingListings: Array<{
    id: string;
    title: string;
    slug?: string;
    views?: number;
    price?: number | string | null;
    _count?: {
      favorites: number;
      offers: number;
    };
    images?: Array<{
      url: string;
    }>;
  }>;
};

const quickActions = [
  {
    href: "/listings",
    label: "Browse Listings",
    description: "Find repairable items",
    icon: ShoppingBag,
  },
  {
    href: "/listings/create",
    label: "Sell an Item",
    description: "Create a new listing",
    icon: Plus,
  },
  {
    href: "/dashboard/listings",
    label: "My Listings",
    description: "Manage your listings",
    icon: ListChecks,
  },
  {
    href: "/dashboard/orders",
    label: "My Orders",
    description: "Track purchases and sales",
    icon: Package,
  },
  {
    href: "/dashboard/offers",
    label: "Offers",
    description: "Review buyer offers",
    icon: Tag,
  },
  {
    href: "/dashboard/profile",
    label: "Profile",
    description: "Manage your account",
    icon: UserCircle,
  },
];

export default function DashboardPage() {
  const { user } = useAuthStore();

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const response = await getSellerDashboard();

        if (!cancelled) {
          setDashboard(response as DashboardData);
        }
      } catch (err) {
        console.error("Failed to load dashboard:", err);

        if (!cancelled) {
          setError(
            "We couldn't load your seller overview right now. Your account is still active."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const firstName = user?.firstName || "there";

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">
                FaultMart Dashboard
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-neutral-900">
                Welcome back, {firstName}
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-neutral-500 sm:text-base">
                Manage your marketplace activity, listings, orders, offers,
                and account from one place.
              </p>
            </div>

            <Link
              href="/listings/create"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              <Plus className="h-4 w-4" />
              Sell an Item
            </Link>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-neutral-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Jump straight to what you want to do.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="rounded-xl bg-orange-50 p-3">
                      <Icon className="h-5 w-5 text-orange-600" />
                    </div>

                    <ArrowRight className="h-5 w-5 text-neutral-300 transition group-hover:translate-x-1 group-hover:text-orange-500" />
                  </div>

                  <h3 className="mt-4 font-semibold text-neutral-900">
                    {action.label}
                  </h3>

                  <p className="mt-1 text-sm text-neutral-500">
                    {action.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Seller Overview */}
        {loading ? (
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="animate-pulse">
              <div className="h-5 w-40 rounded bg-neutral-200" />
              <div className="mt-2 h-4 w-64 rounded bg-neutral-100" />

              <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-24 rounded-2xl bg-neutral-100"
                  />
                ))}
              </div>
            </div>
          </section>
        ) : error ? (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-start gap-3">
              <BarChart3 className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

              <div>
                <h2 className="font-semibold text-amber-900">
                  Dashboard overview unavailable
                </h2>

                <p className="mt-1 text-sm text-amber-700">
                  {error}
                </p>

                <Link
                  href="/dashboard/listings"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:underline"
                >
                  Manage your listings
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        ) : dashboard ? (
          <>
            <section className="mb-8">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-neutral-900">
                  Seller Overview
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  A snapshot of your marketplace performance.
                </p>
              </div>

              <DashboardStats stats={dashboard.stats} />
            </section>

            <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <RecentListings
                listings={dashboard.recentListings as never[]}
              />

              <RecentOffers
                offers={dashboard.recentOffers as never[]}
              />
            </section>

            <section className="mb-8">
              <RecentOrders
                orders={dashboard.recentOrders as never[]}
              />
            </section>

            <section className="mb-8">
              <SalesOverview analytics={dashboard.analytics} />
            </section>

            <section className="mb-8">
              <ListingPerformance
                topListings={dashboard.topListings}
                lowPerformingListings={dashboard.lowPerformingListings}
              />
            </section>

            <section>
              <Deliveries
                deliveries={dashboard.deliveries as never[]}
              />
            </section>
          </>
        ) : (
          <section className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50">
              <Eye className="h-6 w-6 text-orange-600" />
            </div>

            <h2 className="mt-4 text-lg font-bold text-neutral-900">
              Your dashboard is ready
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-neutral-500">
              Start by browsing FaultMart or create your first listing.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
