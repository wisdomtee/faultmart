import Link from "next/link";
import {
  ArrowRight,
  Flame,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { ListingGrid } from "@/components/listings";
import { Listing } from "@/types/listing";


interface Props {
  listings: Listing[];
}



export default function PopularListings({
  listings,
}: Props) {


  return (

    <section
      className="
        relative
        overflow-hidden
        bg-neutral-950
        py-28
      "
    >



      {/* Background */}

      <div className="absolute inset-0">

        <div
          className="
            absolute
            -right-32
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
            -left-32
            bottom-0
            h-80
            w-80
            rounded-full
            bg-orange-500/10
            blur-3xl
          "
        />

      </div>





      <Container>

        <div className="relative">





          {/* HEADER */}

          <div
            className="
              mb-14
              flex
              flex-col
              gap-8
              lg:flex-row
              lg:items-end
              lg:justify-between
            "
          >


            <div className="max-w-3xl">


              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-orange-500/10
                  px-5
                  py-2
                  text-sm
                  font-bold
                  text-orange-400
                "
              >

                <Flame className="h-4 w-4"/>

                Trending Marketplace

              </div>





              <h2
                className="
                  mt-6
                  text-4xl
                  font-black
                  tracking-tight
                  text-white
                  md:text-5xl
                "
              >

                Popular Listings

                <span className="text-orange-500">
                  {" "}Right Now
                </span>


              </h2>





              <p
                className="
                  mt-5
                  max-w-2xl
                  text-lg
                  leading-8
                  text-neutral-400
                "
              >

                See what buyers are searching for most.
                These repairable products are getting
                the highest attention on FaultMart.

              </p>


            </div>





            <Link
              href="/listings?sort=popular"
              className="
                group
                inline-flex
                items-center
                gap-2
                font-bold
                text-orange-400
              "
            >

              View all trending


              <ArrowRight
                className="
                  h-5
                  w-5
                  transition
                  group-hover:translate-x-1
                "
              />


            </Link>



          </div>







          {/* MARKET ACTIVITY */}

          <div
            className="
              mb-10
              flex
              flex-wrap
              gap-3
            "
          >


            <div
              className="
                flex
                items-center
                gap-2
                rounded-full
                border
                border-white/10
                bg-white/5
                px-5
                py-2
                text-sm
                font-semibold
                text-neutral-200
              "
            >

              <TrendingUp className="h-4 w-4 text-orange-500"/>

              High Buyer Interest

            </div>





            <div
              className="
                flex
                items-center
                gap-2
                rounded-full
                border
                border-white/10
                bg-white/5
                px-5
                py-2
                text-sm
                font-semibold
                text-neutral-200
              "
            >

              <Sparkles className="h-4 w-4 text-orange-500"/>

              Most Viewed Items

            </div>


          </div>







          {/* LISTINGS */}

          <div
            className="
              rounded-[40px]
              border
              border-white/10
              bg-white
              p-5
              shadow-2xl
              md:p-8
            "
          >

            <ListingGrid
              listings={listings}
            />


          </div>







          {/* CTA */}

          <div
            className="
              mt-16
              flex
              justify-center
            "
          >

            <Link href="/listings?sort=popular">


              <Button
                size="lg"
                className="
                  rounded-full
                  bg-orange-600
                  px-12
                  py-6
                  font-black
                  shadow-lg
                  shadow-orange-600/30
                  hover:bg-orange-700
                "
              >

                <Sparkles className="mr-2 h-5 w-5"/>

                Explore Trending Listings


                <ArrowRight
                  className="
                    ml-2
                    h-5
                    w-5
                  "
                />


              </Button>


            </Link>


          </div>




        </div>


      </Container>


    </section>

  );
}