import Link from "next/link";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

import {
  ArrowRight,
  Car,
  Search,
  ShieldCheck,
  Wrench,
  Smartphone,
  Tv,
  Refrigerator,
  CheckCircle2,
} from "lucide-react";


export default function Hero() {

  const quickCategories = [
    {
      name: "Vehicles",
      icon: Car,
    },
    {
      name: "Phones",
      icon: Smartphone,
    },
    {
      name: "Electronics",
      icon: Tv,
    },
    {
      name: "Appliances",
      icon: Refrigerator,
    },
  ];


  return (

    <section
      className="
        relative
        overflow-hidden
        bg-neutral-950
        text-white
      "
    >

      {/* BACKGROUND */}

      <div className="absolute inset-0">

        <div
          className="
            absolute
            inset-0
            bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
            bg-[size:60px_60px]
          "
        />


        <div
          className="
            absolute
            -left-40
            top-20
            h-96
            w-96
            rounded-full
            bg-orange-600/20
            blur-3xl
          "
        />


        <div
          className="
            absolute
            right-0
            top-0
            h-[500px]
            w-[500px]
            rounded-full
            bg-orange-500/10
            blur-3xl
          "
        />

      </div>



      <Container>

        <div
          className="
            relative
            grid
            items-center
            gap-16
            py-24
            lg:grid-cols-2
            lg:py-32
          "
        >



          {/* LEFT SIDE */}

          <div>


            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-orange-500/30
                bg-orange-500/10
                px-5
                py-2
                text-sm
                font-bold
                text-orange-400
              "
            >

              <Wrench className="h-4 w-4" />

              AFRICA'S REPAIRABLE GOODS MARKETPLACE

            </div>



            <h1
  className="
    mt-8
    text-5xl
    font-black
    leading-[1.05]
    md:text-6xl
    xl:text-7xl
  "
>
  Buy & Sell
  <br />

  <span className="text-orange-500">
    Repairable
  </span>

  <br />

  Products With
  <br />

  Complete
  <span className="text-orange-500">
    {" "}Transparency
  </span>
</h1>




            <p
  className="
    mt-8
    max-w-xl
    text-lg
    leading-8
    text-neutral-300
  "
>
  FaultMart is Africa's marketplace for vehicles, phones,
  electronics and appliances that need repair.

  <span className="mt-2 block">
    See the fault. Understand the condition. Connect with the seller.
    Make an offer and give useful products a second life.
  </span>
</p>

<div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">

  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
    <p className="text-sm font-bold text-white">
      Looking to Buy?
    </p>

    <p className="mt-1 text-sm leading-6 text-neutral-400">
      Find repairable products at prices that make sense
      for your budget.
    </p>
  </div>

  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
    <p className="text-sm font-bold text-white">
      Have Something to Sell?
    </p>

    <p className="mt-1 text-sm leading-6 text-neutral-400">
      Turn faulty or unwanted items into money instead
      of letting them sit unused.
    </p>
  </div>

</div>

            {/* SEARCH */}

            <Link
              href="/listings"
              className="
                mt-10
                block
                rounded-2xl
                bg-white
                p-2
                shadow-2xl
              "
            >

              <div
                className="
                  flex
                  flex-col
                  gap-3
                  md:flex-row
                "
              >

                <div
                  className="
                    flex
                    flex-1
                    items-center
                    px-4
                  "
                >

                  <Search
                    className="
                      mr-3
                      h-5
                      w-5
                      text-neutral-400
                    "
                  />

                  <span
                    className="
                      text-neutral-500
                    "
                  >
                    Search vehicles, phones, appliances...
                  </span>

                </div>



                <Button
                  size="lg"
                  className="
                    bg-orange-600
                    hover:bg-orange-700
                  "
                >

                  <Search className="mr-2 h-5 w-5" />

                  Search

                </Button>


              </div>

            </Link>





            {/* QUICK CATEGORIES */}

            <div
              className="
                mt-6
                flex
                flex-wrap
                gap-3
              "
            >

              {quickCategories.map((category)=>{

                const Icon = category.icon;


                return (

                  <Link
                    href="/listings"
                    key={category.name}
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-full
                      bg-white/10
                      px-4
                      py-2
                      text-sm
                      transition
                      hover:bg-orange-600
                    "
                  >

                    <Icon className="h-4 w-4"/>

                    {category.name}

                  </Link>

                );

              })}

            </div>





            {/* BUTTONS */}

            <div
              className="
                mt-10
                flex
                flex-wrap
                gap-4
              "
            >

              <Link href="/listings">

                <Button
                  size="lg"
                  className="
                    bg-orange-600
                    px-8
                    hover:bg-orange-700
                  "
                >

                  Browse Listings

                  <ArrowRight
                    className="
                      ml-2
                      h-5
                      w-5
                    "
                  />

                </Button>

              </Link>



              <Link href="/login">
  <Button
    size="lg"
    variant="secondary"
    className="px-8"
  >
    Sell Your Item
  </Button>
</Link>


            </div>





            {/* TRUST */}

            <div
              className="
                mt-8
                flex
                flex-wrap
                gap-3
              "
            >

              {[
                "Verified Sellers",
                "Secure Marketplace",
                "Nationwide Listings",
              ].map((item)=>(

                <div
                  key={item}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    bg-white/10
                    px-4
                    py-2
                    text-sm
                    text-green-300
                  "
                >

                  <CheckCircle2 className="h-4 w-4"/>

                  {item}

                </div>

              ))}


            </div>


          </div>






          {/* RIGHT SIDE */}


          <div className="relative">


            <div
              className="
                absolute
                -left-8
                top-8
                hidden
                rounded-2xl
                bg-white
                p-4
                text-neutral-900
                shadow-2xl
                lg:block
              "
            >

              <div className="flex items-center gap-3">

                <div className="rounded-full bg-green-100 p-2">

                  <ShieldCheck className="h-5 w-5 text-green-600"/>

                </div>


                <div>

                  <p className="text-sm font-bold">
                    Verified Sellers
                  </p>

                  <p className="text-xs text-neutral-500">
                    Trusted Marketplace
                  </p>

                </div>

              </div>

            </div>





            <div
              className="
                overflow-hidden
                rounded-[32px]
                border
                border-neutral-800
                bg-neutral-900
                shadow-2xl
              "
            >


              <div
                className="
                  bg-gradient-to-br
                  from-orange-500
                  via-orange-600
                  to-red-600
                  p-10
                "
              >

                <div
                  className="
                    flex
                    justify-between
                  "
                >

                  <div>

                    <div className="flex gap-3">

                      <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-bold">
                        Featured Listing
                      </span>

                      <span className="rounded-full bg-red-500 px-4 py-2 text-sm font-bold">
                        Faulty
                      </span>

                    </div>


                    <h3 className="mt-6 text-4xl font-black">
                      Toyota Camry
                    </h3>


                    <p className="mt-2 text-orange-100">
                      2010 • Automatic • Lagos
                    </p>

                  </div>


                  <Car className="h-24 w-24 text-white/90"/>

                </div>


              </div>





              <div className="space-y-6 p-8">


                <div className="rounded-2xl bg-neutral-800 p-5">

                  <p className="text-xs uppercase text-neutral-400">
                    Reported Fault
                  </p>


                  <p className="mt-2 text-lg font-bold">
                    Engine overheating after long drives.
                    AC and transmission working perfectly.
                  </p>

                </div>





                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-neutral-400">
                      Asking Price
                    </p>

                    <p className="text-4xl font-black text-orange-500">
                      ₦2,350,000
                    </p>

                  </div>


                  <Link href="/listings">
  <Button className="bg-orange-600 hover:bg-orange-700">
    View Listings

    <ArrowRight className="ml-2 h-5 w-5" />
  </Button>
</Link>


                </div>





                <div className="grid grid-cols-2 gap-4">


                  <div className="rounded-xl bg-neutral-800 p-4">

                    <ShieldCheck className="h-5 w-5 text-green-400"/>

                    <p className="mt-2 font-bold">
                      Verified Seller
                    </p>

                  </div>



                  <div className="rounded-xl bg-neutral-800 p-4">

                    <Search className="h-5 w-5 text-orange-400"/>

                    <p className="mt-2 font-bold">
                      Full Fault Report
                    </p>

                  </div>


                </div>


              </div>


            </div>


          </div>


        </div>

      </Container>


    </section>

  );
}