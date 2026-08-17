"use client";

import {
  X,
} from "lucide-react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";


const filters = [
  {
    key: "categoryId",
    label: "Category",
  },
  {
    key: "condition",
    label: "Condition",
  },
  {
    key: "faultSeverity",
    label: "Fault",
  },
  {
    key: "state",
    label: "State",
  },
  {
    key: "city",
    label: "City",
  },
  {
    key: "minPrice",
    label: "Min Price",
  },
  {
    key: "maxPrice",
    label: "Max Price",
  },
];


export default function ActiveFilters() {

  const router = useRouter();

  const searchParams =
    useSearchParams();


  const activeFilters =
    filters.filter(
      (filter) =>
        searchParams.get(filter.key)
    );



  if (!activeFilters.length) {
    return null;
  }



  const removeFilter = (
    key: string
  ) => {

    const params =
      new URLSearchParams(
        searchParams.toString()
      );


    params.delete(key);

    params.set(
      "page",
      "1"
    );


    router.push(
      `/listings?${params.toString()}`
    );

  };



  return (

    <div
      className="
        flex
        flex-wrap
        items-center
        gap-3
      "
    >

      <span
        className="
          text-sm
          font-bold
          text-neutral-500
        "
      >
        Active Filters:
      </span>


      {activeFilters.map(
        (filter) => (

          <button
            key={filter.key}
            onClick={() =>
              removeFilter(
                filter.key
              )
            }
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-orange-50
              px-4
              py-2
              text-sm
              font-bold
              text-orange-700
              transition
              hover:bg-orange-100
            "
          >

            {filter.label}:{" "}
            {searchParams.get(
              filter.key
            )}

            <X
              className="
                h-4
                w-4
              "
            />

          </button>

        )
      )}


    </div>

  );
}