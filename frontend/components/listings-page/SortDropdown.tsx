"use client";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

export default function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const value =
    searchParams.get("sort") || "newest";

  const handleChange = (
    sort: string
  ) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (sort === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", sort);
    }

    params.set("page", "1");

    router.push(
      `/listings?${params.toString()}`
    );
  };

  return (
    <div className="flex items-center justify-between">

      <h2 className="text-3xl font-black">
        Marketplace
      </h2>

      <div className="flex items-center gap-3">

        <span className="text-sm font-medium text-gray-500">
          Sort by
        </span>

        <select
          value={value}
          onChange={(e) =>
            handleChange(e.target.value)
          }
          className="
            rounded-xl
            border
            border-gray-200
            bg-white
            px-4
            py-3
            font-medium
            outline-none
            transition
            focus:border-orange-500
          "
        >
          <option value="newest">
            Newest
          </option>

          <option value="oldest">
            Oldest
          </option>

          <option value="price_asc">
            Price: Low → High
          </option>

          <option value="price_desc">
            Price: High → Low
          </option>

          <option value="most_viewed">
            Most Viewed
          </option>

        </select>

      </div>

    </div>
  );
}