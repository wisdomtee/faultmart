"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const handleSearch = () => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (search.trim()) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    params.set("page", "1");

    router.push(`/listings?${params.toString()}`);
  };

  return (
    <section className="rounded-3xl border bg-white p-6 shadow-sm">

      <div className="flex flex-col gap-4 md:flex-row">

        <div className="relative flex-1">

          <Search
            className="
              absolute
              left-4
              top-1/2
              h-5
              w-5
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="text"
            value={search}
            placeholder="Search cars, phones, appliances..."
            onChange={(e) =>
              setSearch(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="
              h-14
              w-full
              rounded-2xl
              border
              border-gray-200
              pl-12
              pr-4
              outline-none
              transition
              focus:border-orange-500
              focus:ring-4
              focus:ring-orange-100
            "
          />

        </div>

        <button
          onClick={handleSearch}
          className="
            h-14
            rounded-2xl
            bg-orange-600
            px-8
            font-bold
            text-white
            transition
            hover:bg-orange-700
          "
        >
          Search
        </button>

      </div>

    </section>
  );
}