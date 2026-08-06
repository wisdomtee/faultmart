"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Props {
  category: string;
  title: string;
}

export default function Breadcrumbs({
  category,
  title,
}: Props) {
  return (
    <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-500">
      <Link
        href="/"
        className="hover:text-orange-600"
      >
        Home
      </Link>

      <ChevronRight className="h-4 w-4" />

      <Link
        href="/listings"
        className="hover:text-orange-600"
      >
        Listings
      </Link>

      <ChevronRight className="h-4 w-4" />

      <span>{category}</span>

      <ChevronRight className="h-4 w-4" />

      <span className="font-semibold text-gray-900 truncate max-w-xs">
        {title}
      </span>
    </nav>
  );
}