import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { ListingGrid } from "@/components/listings";
import { Listing } from "@/types/listing";


interface Props {
  listings: Listing[];
}



export default function FeaturedListings({
  listings,
}: Props) {


  return (

    <section
      className="
        relative
        overflow-hidden
        bg-white
        py-28
      "
    >


      {/* Background Glow */}

      <div
        className="
          absolute
          -right-32
          top-20
          h-96
          w-96
          rounded-full
          bg-orange-200/40
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
          bg-orange-100/40
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

                <Sparkles className="h-4 w-4"/>

                Featured Deals

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

                Discover Featured Listings

              </h2>




              <p
                className="
                  mt-5
                  text-lg
                  leading-8
                  text-neutral-600
                "
              >

                Explore quality repairable vehicles,
                electronics, phones and appliances
                from verified sellers across Nigeria.

              </p>


            </div>





            <Link
              href="/listings"
              className="
                group
                inline-flex
                items-center
                gap-2
                font-bold
                text-orange-600
              "
            >

              View all listings


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






          {/* TRUST STRIP */}

          <div
            className="
              mb-10
              flex
              flex-wrap
              items-center
              gap-3
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
                rounded-full
                bg-green-50
                px-4
                py-2
                text-sm
                font-semibold
                text-green-700
              "
            >

              <ShieldCheck className="h-4 w-4"/>

              Verified Sellers

            </div>


            <div
              className="
                rounded-full
                bg-orange-50
                px-4
                py-2
                text-sm
                font-semibold
                text-orange-700
              "
            >

              Transparent Fault Reports

            </div>


          </div>







          {/* LISTINGS */}

          <div
            className="
              rounded-[40px]
              border
              border-neutral-200
              bg-neutral-50
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

            <Link href="/listings">

              <Button
                size="lg"
                className="
                  rounded-full
                  bg-orange-600
                  px-12
                  py-6
                  text-base
                  font-black
                  shadow-lg
                  hover:bg-orange-700
                "
              >

                Browse All Listings


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