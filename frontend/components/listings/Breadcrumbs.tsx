"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  category?: string;
  title?: string;
  items?: BreadcrumbItem[];
}

export default function Breadcrumbs({
  category,
  title,
  items,
}: Props) {
  const breadcrumbItems: BreadcrumbItem[] = items ?? [
    {
      label: "Listings",
      href: "/listings",
    },
    ...(category
      ? [
          {
            label: category,
          },
        ]
      : []),
    ...(title
      ? [
          {
            label: title,
          },
        ]
      : []),
  ];

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-sm text-gray-500"
    >
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-orange-600 transition-colors"
      >
        <Home className="h-4 w-4" />
        <span>Home</span>
      </Link>

      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;

        return (
          <div
            key={`${item.label}-${index}`}
            className="flex items-center gap-2 min-w-0"
          >
            <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />

            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-orange-600 transition-colors truncate"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  isLast
                    ? "font-semibold text-gray-900 truncate max-w-xs"
                    : "truncate"
                }
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}