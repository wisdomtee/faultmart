import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Sparkles,
} from "lucide-react";

import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { ListingGrid } from "@/components/listings";
import { Listing } from "@/types/listing";


interface Props {
  listings: Listing[];
}



export default function LatestListings({
  listings,
}: Props) {


  return (

    <section
      className="
        relative
        overflow-hidden
        bg-neutral-50
        py-28
      "
    >


      {/* Background Glow */}

      <div
        className="
          absolute
          -left-32
          top-10
          h-96
          w-96
          rounded-full
          bg-orange-100/60
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



            <div
              className="
                max-w-3xl
              "
            >



              <div
                className="
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

                <Clock3 className="h-4 w-4"/>

                New Arrivals

              </div>






              <h2
                className="
                  mt-6
                  text-4xl
                  font-black
                  tracking-tight
                  text-neutral-900
                  md:text-5xl
                "
              >

                Latest Listings

              </h2>






              <p
                className="
                  mt-5
                  text-lg
                  leading-8
                  text-neutral-600
                "
              >

                Discover recently added repairable vehicles,
                phones, electronics and appliances from sellers
                joining FaultMart every day.

              </p>



            </div>







            <Link
              href="/listings?sort=latest"
              className="
                group
                inline-flex
                items-center
                gap-2
                font-bold
                text-orange-600
              "
            >

              View latest


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







          {/* LIVE MARKETPLACE INDICATOR */}

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
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-white
                px-5
                py-2
                text-sm
                font-semibold
                text-neutral-700
                shadow-sm
              "
            >

              <Sparkles
                className="
                  h-4
                  w-4
                  text-orange-500
                "
              />

              Updated Daily

            </div>



            <div
              className="
                rounded-full
                bg-green-50
                px-5
                py-2
                text-sm
                font-semibold
                text-green-700
              "
            >

              Fresh Seller Listings

            </div>


          </div>







          {/* LISTINGS */}

          <div
            className="
              rounded-[40px]
              border
              border-neutral-200
              bg-white
              p-5
              shadow-sm
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
              text-center
            "
          >

            <Link href="/listings?sort=latest">

              <Button
                size="lg"
                className="
                  rounded-full
                  bg-orange-600
                  px-12
                  py-6
                  font-black
                  shadow-lg
                  hover:bg-orange-700
                "
              >

                Explore New Listings


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