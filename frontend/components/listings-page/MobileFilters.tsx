"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

import FilterSidebar from "./FilterSidebar";
import { Category } from "@/components/types/category";

interface Props {
  categories: Category[];
}

export default function MobileFilters({
  categories,
}: Props) {
  const [open, setOpen] = useState(false);
useEffect(() => {
  document.body.style.overflow = open ? "hidden" : "";

  return () => {
    document.body.style.overflow = "";
  };
}, [open]);

  return (
    <div className="lg:hidden">

      <button
        onClick={() => setOpen(true)}
        className="
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-2xl
          bg-orange-600
          px-5
          py-3
          font-bold
          text-white
          transition
          hover:bg-orange-700
        "
      >
        <SlidersHorizontal className="h-5 w-5" />

        Filters
      </button>


      {open && (
        <div
          className="
            fixed
            inset-0
            z-50
            bg-black/40
          "
          onClick={() => setOpen(false)}
        >

          <div
            className="
              absolute
              right-0
              top-0
              h-full
              w-[90%]
              max-w-sm
              overflow-y-auto
              bg-white
              p-5
              shadow-xl
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div
              className="
                mb-5
                flex
                items-center
                justify-between
              "
            >

              <h2 className="text-xl font-black">
                Filters
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="
                  rounded-full
                  p-2
                  hover:bg-neutral-100
                "
              >
                <X className="h-5 w-5" />
              </button>

            </div>


            <div className="flex-1 overflow-y-auto">

  <FilterSidebar
    categories={categories}
    className="border-0 shadow-none p-0"
  />

  <button
  onClick={() => setOpen(false)}
  className="
    m-5
    rounded-xl
    bg-orange-600
    py-3
    font-bold
    text-white
    shadow-lg
    hover:bg-orange-700
  "
>
  Apply Filters
</button>

</div>

          </div>

        </div>
      )}

    </div>
  );
}