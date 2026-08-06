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

          <div
            className="
              mx-auto
              mb-16
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

              <Layers className="h-4 w-4"/>

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

              Explore Repairable Products

            </h2>



            <p
              className="
                mt-5
                text-lg
                leading-8
                text-neutral-600
              "
            >

              Find faulty vehicles, electronics,
              phones, appliances and more from
              sellers across Nigeria.

            </p>


          </div>






          {/* CATEGORY GRID */}

          <div
            className="
              grid
              gap-6
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >


            {categories.map((category,index)=>{


              const Icon =
                getCategoryIcon(category);



              return (

                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[32px]
                    border
                    border-neutral-200
                    bg-white
                    p-7
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-3
                    hover:border-orange-300
                    hover:shadow-2xl
                  "
                >


                  <div
                    className="
                      absolute
                      right-5
                      top-5
                      text-5xl
                      font-black
                      text-neutral-100
                    "
                  >
                    {String(index+1).padStart(2,"0")}
                  </div>





                  <div
                    className={`
                      relative
                      inline-flex
                      rounded-2xl
                      bg-gradient-to-br
                      ${getIconStyle(category)}
                      p-4
                      text-white
                      shadow-lg
                      transition
                      duration-300
                      group-hover:scale-110
                    `}
                  >

                    <Icon className="h-8 w-8"/>

                  </div>





                  <h3
                    className="
                      mt-8
                      text-xl
                      font-black
                      text-neutral-900
                      group-hover:text-orange-600
                    "
                  >
                    {category.name}
                  </h3>



                  <p
                    className="
                      mt-2
                      text-sm
                      text-neutral-500
                    "
                  >

                    {category.count}
                    {" "}
                    Listings Available

                  </p>




                  <div
                    className="
                      mt-7
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <span
                      className="
                        font-semibold
                        text-orange-600
                      "
                    >
                      Explore
                    </span>


                    <ArrowRight
                      className="
                        h-5
                        w-5
                        text-orange-600
                        transition
                        group-hover:translate-x-2
                      "
                    />

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