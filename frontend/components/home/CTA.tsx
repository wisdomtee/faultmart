import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import Container from "@/components/layout/Container";

export default function CTA() {

  return (
    <section
      className="
        bg-white
        py-28
      "
    >

      <Container>

        <div
          className="
            relative
            overflow-hidden
            rounded-[40px]
            bg-gradient-to-br
            from-orange-600
            via-orange-500
            to-red-500
            px-8
            py-20
            text-center
            text-white
            shadow-2xl
            md:px-16
          "
        >


          {/* Background Glow */}

          <div
            className="
              absolute
              -right-20
              -top-20
              h-80
              w-80
              rounded-full
              bg-white/10
              blur-2xl
            "
          />


          <div
            className="
              absolute
              -bottom-24
              -left-20
              h-80
              w-80
              rounded-full
              bg-black/10
              blur-2xl
            "
          />



          <div
            className="
              relative
              z-10
              mx-auto
              max-w-3xl
            "
          >


            <div
              className="
                mx-auto
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-white/15
                px-5
                py-2
                text-sm
                font-bold
                backdrop-blur
              "
            >

              <ShieldCheck className="h-4 w-4" />

              Trusted Repair Marketplace

            </div>




            <h2
              className="
                mt-8
                text-4xl
                font-black
                tracking-tight
                md:text-6xl
              "
            >

              Turn Broken Items
              <br />

              Into Real Value

            </h2>




            <p
              className="
                mx-auto
                mt-6
                max-w-2xl
                text-lg
                leading-8
                text-orange-100
              "
            >

              Sell faulty vehicles, electronics, phones and appliances
              to buyers looking for repairable products across Nigeria.

            </p>




            <div
              className="
                mt-10
                flex
                flex-col
                justify-center
                gap-4
                sm:flex-row
              "
            >


              <Link href="/listings/create"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-white
                  px-9
                  py-4
                  font-black
                  text-orange-600
                  transition
                  hover:bg-orange-50
                "
              >

                Sell Your Item

                <ArrowRight className="h-5 w-5" />

              </Link>




              <Link
                href="/listings"
                className="
                  rounded-full
                  border
                  border-white/40
                  px-9
                  py-4
                  font-bold
                  transition
                  hover:bg-white/10
                "
              >

                Browse Listings

              </Link>


            </div>


          </div>


        </div>

      </Container>

    </section>
  );
}