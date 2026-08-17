"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  pagination: {
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function CategoryPagination({
  pagination,
}: Props) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const goTo = (page: number) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("page", page.toString());

    router.push(`?${params.toString()}`);
  };

  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div
      className="
        mt-12
        flex
        items-center
        justify-center
        gap-4
      "
    >
      <button
        disabled={!pagination.hasPrev}
        onClick={() => goTo(pagination.page - 1)}
        className="
          flex
          items-center
          gap-2
          rounded-xl
          border
          px-5
          py-3
          hover:bg-gray-50
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        <ChevronLeft className="h-5 w-5" />
        Previous
      </button>

      <div
        className="
          rounded-xl
          bg-orange-600
          px-6
          py-3
          font-bold
          text-white
        "
      >
        {pagination.page} / {pagination.totalPages}
      </div>

      <button
        disabled={!pagination.hasNext}
        onClick={() => goTo(pagination.page + 1)}
        className="
          flex
          items-center
          gap-2
          rounded-xl
          border
          px-5
          py-3
          hover:bg-gray-50
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        Next
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}