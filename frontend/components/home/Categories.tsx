import Link from "next/link";
import Container from "@/components/layout/Container";

import {
  ArrowRight,
  Bike,
  Car,
  Cpu,
  Hammer,
  Home,
  Laptop,
  LucideIcon,
  Refrigerator,
  Settings,
  Smartphone,
  Tv,
  Wrench,
  Layers,
} from "lucide-react";


type Category = {
  id: string;
  name: string;
  slug: string;
  count: number;
};


type Props = {
  categories: Category[];
};



function getCategoryIcon(category: Category): LucideIcon {

  const value =
    `${category.slug} ${category.name}`.toLowerCase();


  if (
    value.includes("vehicle") ||
    value.includes("car") ||
    value.includes("auto")
  )
    return Car;


  if (
    value.includes("motor") ||
    value.includes("bike")
  )
    return Bike;


  if (
    value.includes("phone") ||
    value.includes("mobile")
  )
    return Smartphone;


  if (
    value.includes("computer") ||
    value.includes("laptop")
  )
    return Laptop;


  if (
    value.includes("tv") ||
    value.includes("television")
  )
    return Tv;


  if (
    value.includes("electronic")
  )
    return Cpu;


  if (
    value.includes("fridge") ||
    value.includes("refrigerator") ||
    value.includes("washing")
  )
    return Refrigerator;


  if (
    value.includes("part") ||
    value.includes("accessory")
  )
    return Settings;


  if (
    value.includes("home") ||
    value.includes("furniture")
  )
    return Home;


  if (
    value.includes("machine") ||
    value.includes("tool")
  )
    return Hammer;


  return Wrench;
}





function getIconStyle(category: Category) {

  const value =
    `${category.slug} ${category.name}`.toLowerCase();


  if (
    value.includes("car") ||
    value.includes("vehicle")
  )
    return "from-blue-500 to-cyan-500";


  if (
    value.includes("phone")
  )
    return "from-green-500 to-emerald-500";


  if (
    value.includes("computer") ||
    value.includes("laptop")
  )
    return "from-purple-500 to-indigo-500";


  if (
    value.includes("tv")
  )
    return "from-pink-500 to-red-500";


  if (
    value.includes("home")
  )
    return "from-yellow-500 to-orange-500";


  return "from-orange-500 to-red-500";
}





export default function Categories({
  categories,
}: Props) {


  return (

    <section
      className="
        relative
        overflow-hidden
        bg-gray-50
        py-28
      "
    >


      {/* Background */}

      <div className="absolute inset-0">

        <div
          className="
            absolute
            -left-20
            top-0
            h-80
            w-80
            rounded-full
            bg-orange-100/50
            blur-3xl
          "
        />

        <div
          className="
            absolute
            right-0
            bottom-0
            h-72
            w-72
            rounded-full
            bg-orange-50
            blur-3xl
          "
        />

      </div>



      <Container>

        <div className="relative">


          {/* HEADER */}

          {/* HEADER */}

<div
  className="
    mx-auto
    mb-14
    max-w-3xl
    text-center
  "
>
  <div
    className="
      mb-5
      inline-flex
      items-center
      gap-2
      rounded-full
      bg-orange-100
      px-5
      py-2
      text-sm
      font-bold
      text-orange-600
    "
  >
    <Layers className="h-4 w-4" />

    Marketplace Categories
  </div>

  <h2
    className="
      text-4xl
      font-black
      tracking-tight
      text-neutral-900
      md:text-5xl
    "
  >
    Find What You Need.
    <span className="text-orange-600">
      {" "}Fix What You Find.
    </span>
  </h2>

  <p
    className="
      mx-auto
      mt-6
      max-w-2xl
      text-lg
      leading-8
      text-neutral-600
    "
  >
    Explore repairable vehicles, phones, electronics,
    appliances and more from sellers across Nigeria.
  </p>
</div>






          {/* CATEGORY GRID */}

          <div
  className="
    grid
    gap-6
    sm:grid-cols-2
    lg:grid-cols-3
    xl:grid-cols-4
  "
>
<div className="mt-12 text-center">
  <Link
    href="/categories"
    className="
      inline-flex
      items-center
      gap-2
      rounded-full
      border
      border-neutral-300
      bg-white
      px-7
      py-3.5
      font-bold
      text-neutral-800
      transition
      hover:border-orange-500
      hover:bg-orange-50
      hover:text-orange-600
    "
  >
    View All Categories

    <ArrowRight className="h-4 w-4" />
  </Link>
</div>

            {categories.map((category) => {
  const Icon = getCategoryIcon(category);
  const iconStyle = getIconStyle(category);

  return (
    <Link
      key={category.id}
      href={`/categories/${category.slug}`}
      className="
        group
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-neutral-200
        bg-white
        p-7
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-orange-300
        hover:shadow-xl
      "
    >
      {/* Background decoration */}
      <div
        className="
          absolute
          -right-10
          -top-10
          h-32
          w-32
          rounded-full
          bg-orange-50
          transition
          duration-300
          group-hover:scale-150
        "
      />

      <div className="relative">
        {/* Icon */}
        <div
          className={`
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-gradient-to-br
            ${iconStyle}
            text-white
            shadow-lg
            transition
            duration-300
            group-hover:scale-110
            group-hover:rotate-2
          `}
        >
          <Icon className="h-8 w-8" />
        </div>

        {/* Category name */}
        <h3
          className="
            mt-7
            text-xl
            font-black
            text-neutral-900
            transition
            group-hover:text-orange-600
          "
        >
          {category.name}
        </h3>

        {/* Listing count */}
        <p className="mt-2 text-sm text-neutral-500">
          {category.count}{" "}
          {category.count === 1 ? "listing" : "listings"}
        </p>

        {/* Action */}
        <div
          className="
            mt-6
            flex
            items-center
            gap-2
            text-sm
            font-bold
            text-orange-600
          "
        >
          Explore category

          <ArrowRight
            className="
              h-4
              w-4
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          />
        </div>
      </div>
    </Link>
  );
})}




            {/* VIEW ALL */}

            <Link
              href="/categories"
              className="
                group
                flex
                flex-col
                items-center
                justify-center
                rounded-[32px]
                border-2
                border-dashed
                border-orange-300
                bg-orange-50
                p-7
                text-center
                transition
                hover:bg-orange-100
              "
            >

              <ArrowRight
                className="
                  mb-4
                  h-12
                  w-12
                  text-orange-600
                  transition
                  group-hover:translate-x-2
                "
              />


              <h3 className="text-xl font-black">
                View All Categories
              </h3>


              <p className="mt-2 text-sm text-neutral-600">
                Browse everything available on FaultMart
              </p>


            </Link>


          </div>


        </div>


      </Container>


    </section>

  );
}