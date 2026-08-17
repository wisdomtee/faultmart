"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

interface Props {
  pagination: {
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function Pagination({
  pagination,
}: Props) {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  const goTo = (page: number) => {
    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    params.set(
      "page",
      page.toString()
    );

    router.push(
      `/listings?${params.toString()}`
    );
  };

  if (
    pagination.totalPages <= 1
  ) {
    return null;
  }

  return (
    <div
      className="
        flex
        items-center
        justify-center
        gap-4
        py-10
      "
    >

      <button
        disabled={
          !pagination.hasPrev
        }
        onClick={() =>
          goTo(
            pagination.page - 1
          )
        }
        className="
          flex
          items-center
          gap-2
          rounded-xl
          border
          px-5
          py-3
          disabled:cursor-not-allowed
          disabled:opacity-40
          hover:bg-gray-50
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
        {pagination.page}
        {" / "}
        {pagination.totalPages}
      </div>

      <button
        disabled={
          !pagination.hasNext
        }
        onClick={() =>
          goTo(
            pagination.page + 1
          )
        }
        className="
          flex
          items-center
          gap-2
          rounded-xl
          border
          px-5
          py-3
          disabled:cursor-not-allowed
          disabled:opacity-40
          hover:bg-gray-50
        "
      >
        Next

        <ChevronRight className="h-5 w-5" />
      </button>

    </div>
  );
}