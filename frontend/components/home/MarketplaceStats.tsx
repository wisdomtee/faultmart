import {
  Car,
  Users,
  MapPinned,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";

import Container from "@/components/layout/Container";


const stats = [
  {
    icon: Car,
    value: "14,000+",
    label: "Active Listings",
    description: "Vehicles, phones & appliances",
    color: "text-orange-400",
  },

  {
    icon: Users,
    value: "2,800+",
    label: "Verified Sellers",
    description: "Trusted marketplace users",
    color: "text-blue-400",
  },

  {
    icon: MapPinned,
    value: "36",
    label: "States Covered",
    description: "Nationwide marketplace reach",
    color: "text-green-400",
  },

  {
    icon: BadgeCheck,
    value: "98%",
    label: "Buyer Satisfaction",
    description: "Successful transactions",
    color: "text-purple-400",
  },
];



export default function MarketplaceStats() {

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
          left-1/2
          top-0
          h-96
          w-96
          -translate-x-1/2
          rounded-full
          bg-orange-400/20
          blur-3xl
        "
      />



      <Container>


        <div
          className="
            relative
            overflow-hidden
            rounded-[48px]
            bg-neutral-950
            px-6
            py-16
            shadow-2xl
            md:px-12
          "
        >



          {/* Decorative circles */}

          <div
            className="
              absolute
              -right-24
              -top-24
              h-72
              w-72
              rounded-full
              bg-orange-600/20
              blur-3xl
            "
          />

          <div
            className="
              absolute
              -bottom-32
              -left-20
              h-80
              w-80
              rounded-full
              bg-orange-500/10
              blur-3xl
            "
          />





          <div className="relative">



            {/* Heading */}

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
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-orange-400/20
                  bg-orange-400/10
                  px-5
                  py-2
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.25em]
                  text-orange-400
                "
              >

                <ShieldCheck className="h-4 w-4"/>

                Trusted Marketplace

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

                Growing With
                <span className="text-orange-500">
                  {" "}Nigeria
                </span>

              </h2>



              <p
                className="
                  mx-auto
                  mt-5
                  max-w-xl
                  leading-8
                  text-neutral-400
                "
              >

                FaultMart connects buyers and sellers across
                Nigeria with transparent listings and trusted
                marketplace experiences.

              </p>


            </div>







            {/* Stats */}

            <div
              className="
                grid
                gap-6
                sm:grid-cols-2
                lg:grid-cols-4
              "
            >

              {stats.map((stat)=>{


                const Icon = stat.icon;


                return (

                  <div
                    key={stat.label}
                    className="
                      group
                      rounded-3xl
                      border
                      border-white/10
                      bg-white/5
                      p-8
                      text-center
                      transition-all
                      duration-300
                      hover:-translate-y-3
                      hover:bg-white/10
                      hover:border-orange-400/30
                    "
                  >



                    <div
                      className={`
                        mx-auto
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-2xl
                        bg-white/10
                        ${stat.color}
                        transition
                        duration-300
                        group-hover:scale-110
                      `}
                    >

                      <Icon className="h-8 w-8"/>

                    </div>




                    <h3
                      className="
                        mt-6
                        text-4xl
                        font-black
                        text-white
                      "
                    >

                      {stat.value}

                    </h3>




                    <p
                      className="
                        mt-3
                        text-lg
                        font-bold
                        text-white
                      "
                    >

                      {stat.label}

                    </p>




                    <p
                      className="
                        mt-2
                        text-sm
                        text-neutral-400
                      "
                    >

                      {stat.description}

                    </p>



                  </div>

                );


              })}


            </div>





            {/* Bottom Trust Message */}

            <div
              className="
                mt-12
                rounded-2xl
                border
                border-white/10
                bg-white/5
                px-6
                py-5
                text-center
                text-sm
                text-neutral-300
              "
            >

              🔥 Thousands of buyers are discovering repairable
              products every month on FaultMart.

            </div>



          </div>



        </div>


      </Container>


    </section>

  );
}