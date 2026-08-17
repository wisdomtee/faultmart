"use client";

import {
  RotateCcw,
} from "lucide-react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { Category } from "@/components/types/category";


interface Props {
  categories: Category[];
  className?: string;
}


export default function FilterSidebar({
  categories,
  className = "",
}: Props) {

  const router = useRouter();

  const searchParams = useSearchParams();
    useSearchParams();



  const updateFilter = (
    key: string,
    value: string
  ) => {

    const params =
      new URLSearchParams(
        searchParams.toString()
      );


    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }


    params.set(
      "page",
      "1"
    );


    router.push(
      `/listings?${params.toString()}`
    );

  };



  const resetFilters = () => {

    router.push(
      "/listings"
    );

  };



  return (

    <aside
  className={`
    h-fit
    rounded-3xl
    border
    bg-white
    p-6
    shadow-sm
    lg:sticky
    lg:top-24
    ${className}
  `}
>

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <h2
          className="
            text-xl
            font-black
          "
        >
          Filters
        </h2>


      </div>



      <div
        className="
          mt-8
          space-y-6
        "
      >


        {/* CATEGORY */}

        <div>

          <label
            className="
              mb-2
              block
              text-sm
              font-semibold
            "
          >
            Category
          </label>


          <select
            value={
              searchParams.get(
                "categoryId"
              ) || ""
            }
            onChange={(e) =>
              updateFilter(
                "categoryId",
                e.target.value
              )
            }
            className="
              w-full
              rounded-xl
              border
              p-3
              outline-none
              focus:border-orange-500
            "
          >

            <option value="">
              All Categories
            </option>


            {categories.map(
              (category) => (

                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>

              )
            )}

          </select>

        </div>




        {/* CONDITION */}

        <div>

          <label
            className="
              mb-2
              block
              text-sm
              font-semibold
            "
          >
            Condition
          </label>


          <select
            value={
              searchParams.get(
                "condition"
              ) || ""
            }
            onChange={(e) =>
              updateFilter(
                "condition",
                e.target.value
              )
            }
            className="
              w-full
              rounded-xl
              border
              p-3
              outline-none
              focus:border-orange-500
            "
          >

            <option value="">
              All Conditions
            </option>

            <option value="BRAND_NEW">
              Brand New
            </option>

            <option value="USED">
              Used
            </option>

            <option value="REFURBISHED">
              Refurbished
            </option>

            <option value="FAULTY">
              Faulty
            </option>


          </select>


        </div>




        {/* FAULT SEVERITY */}

        <div>

          <label
            className="
              mb-2
              block
              text-sm
              font-semibold
            "
          >
            Fault Severity
          </label>


          <select
            value={
              searchParams.get(
                "faultSeverity"
              ) || ""
            }
            onChange={(e) =>
              updateFilter(
                "faultSeverity",
                e.target.value
              )
            }
            className="
              w-full
              rounded-xl
              border
              p-3
              outline-none
              focus:border-orange-500
            "
          >

            <option value="">
              All Levels
            </option>

            <option value="MINOR">
              Minor
            </option>

            <option value="MODERATE">
              Moderate
            </option>

            <option value="MAJOR">
              Major
            </option>

            <option value="CRITICAL">
              Critical
            </option>

          </select>

        </div>





        {/* STATE */}

        <div>

          <label
            className="
              mb-2
              block
              text-sm
              font-semibold
            "
          >
            State
          </label>


          <input
            value={
              searchParams.get(
                "state"
              ) || ""
            }
            onChange={(e) =>
              updateFilter(
                "state",
                e.target.value
              )
            }
            placeholder="Lagos"
            className="
              w-full
              rounded-xl
              border
              p-3
              outline-none
              focus:border-orange-500
            "
          />


        </div>





        {/* CITY */}

        <div>

          <label
            className="
              mb-2
              block
              text-sm
              font-semibold
            "
          >
            City
          </label>


          <input
            value={
              searchParams.get(
                "city"
              ) || ""
            }
            onChange={(e) =>
              updateFilter(
                "city",
                e.target.value
              )
            }
            placeholder="Ikeja"
            className="
              w-full
              rounded-xl
              border
              p-3
              outline-none
              focus:border-orange-500
            "
          />


        </div>





        {/* PRICE */}

        <div>

          <label
            className="
              mb-2
              block
              text-sm
              font-semibold
            "
          >
            Minimum Price
          </label>


          <input
            type="number"
            value={
              searchParams.get(
                "minPrice"
              ) || ""
            }
            onChange={(e) =>
              updateFilter(
                "minPrice",
                e.target.value
              )
            }
            placeholder="0"
            className="
              w-full
              rounded-xl
              border
              p-3
              outline-none
              focus:border-orange-500
            "
          />

        </div>



        <div>

          <label
            className="
              mb-2
              block
              text-sm
              font-semibold
            "
          >
            Maximum Price
          </label>


          <input
            type="number"
            value={
              searchParams.get(
                "maxPrice"
              ) || ""
            }
            onChange={(e) =>
              updateFilter(
                "maxPrice",
                e.target.value
              )
            }
            placeholder="5000000"
            className="
              w-full
              rounded-xl
              border
              p-3
              outline-none
              focus:border-orange-500
            "
          />

        </div>





        {/* RESET */}

        <button
          onClick={resetFilters}
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            py-3
            font-semibold
            transition
            hover:bg-neutral-50
          "
        >

          <RotateCcw
            className="
              h-5
              w-5
            "
          />

          Reset Filters

        </button>


      </div>


    </aside>

  );
}