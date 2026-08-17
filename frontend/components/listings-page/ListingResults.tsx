"use client";

import { useState } from "react";
import Link from "next/link";
import { Filter } from "lucide-react";

import { useSearchParams } from "next/navigation";

import ListingGrid from "@/components/listings/ListingGrid";
import ListingListCard from "@/components/listings/ListingListCard";
import ViewToggle from "./ViewToggle";


interface Props {
  listings: any[];
  total: number;
}


export default function ListingResults({
  listings,
  total,
}: Props) {

  const [view, setView] =
    useState<"grid" | "list">("grid");


  const searchParams =
    useSearchParams();


  const activeFilters = [
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
  ].filter(
    (filter) =>
      searchParams.get(filter.key)
  );


  return (

    <div
      className="
        space-y-6
      "
    >


      <div
        className="
          flex
          flex-col
          gap-4
          rounded-3xl
          border
          bg-white
          p-6
          md:flex-row
          md:items-center
          md:justify-between
        "
      >

        <div>

          <h2
            className="
              text-2xl
              font-black
            "
          >
            {total} Listings Found
          </h2>



          {activeFilters.length > 0 && (

            <div
              className="
                mt-3
                flex
                flex-wrap
                gap-2
              "
            >

              <span
                className="
                  flex
                  items-center
                  gap-1
                  text-sm
                  font-semibold
                  text-neutral-500
                "
              >

                <Filter
                  className="
                    h-4
                    w-4
                  "
                />

                Filters:

              </span>


              {activeFilters.map(
                (filter) => (

                  <span
                    key={filter.key}
                    className="
                      rounded-full
                      bg-orange-50
                      px-3
                      py-1
                      text-xs
                      font-bold
                      text-orange-700
                    "
                  >
                    {searchParams.get(
                      filter.key
                    )}
                  </span>

                )
              )}


            </div>

          )}


        </div>



        <ViewToggle
          view={view}
          onChange={setView}
        />


      </div>





      {listings.length === 0 ? (

        <div
          className="
            rounded-3xl
            border
            border-dashed
            bg-white
            py-24
            text-center
          "
        >

          <h3
            className="
              text-2xl
              font-black
            "
          >
            No Listings Found
          </h3>


          <p
            className="
              mt-3
              text-neutral-500
            "
          >
            Try changing your search or filters.
          </p>



          <Link
            href="/listings"
            className="
              mt-6
              inline-flex
              rounded-xl
              bg-orange-600
              px-6
              py-3
              font-bold
              text-white
              hover:bg-orange-700
            "
          >
            Clear Filters
          </Link>


        </div>


      ) : (

        view === "grid" ? (

          <ListingGrid
            listings={listings}
          />

        ) : (

          <div
            className="
              space-y-5
            "
          >

            {listings.map((listing) => (

              <ListingListCard
                key={listing.id}
                listing={listing}
              />

            ))}

          </div>

        )

      )}



    </div>

  );
}