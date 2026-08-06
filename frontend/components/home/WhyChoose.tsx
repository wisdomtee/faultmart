import {
  ShieldCheck,
  Wrench,
  MapPinned,
  BadgeDollarSign,
  CheckCircle2,
} from "lucide-react";

import Container from "@/components/layout/Container";

const features = [
  {
    title: "Verified Sellers",
    description:
      "Every seller goes through verification to help buyers trade confidently and reduce fraud.",
    icon: ShieldCheck,
    color:
      "from-emerald-500 to-green-600",
  },
  {
    title: "Detailed Fault Reports",
    description:
      "Every listing clearly explains what works, what doesn't and the repairs required before purchase.",
    icon: Wrench,
    color:
      "from-orange-500 to-red-500",
  },
  {
    title: "Nationwide Marketplace",
    description:
      "Discover repairable vehicles, phones, electronics and appliances from sellers across Nigeria.",
    icon: MapPinned,
    color:
      "from-blue-500 to-cyan-600",
  },
  {
    title: "Save More Money",
    description:
      "Buy repairable products below market value and create more value after repairs.",
    icon: BadgeDollarSign,
    color:
      "from-purple-500 to-indigo-600",
  },
];


export default function WhyChoose() {

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-neutral-50
        py-28
      "
    >

      <div
        className="
          absolute
          left-[-100px]
          top-20
          h-96
          w-96
          rounded-full
          bg-orange-200/40
          blur-3xl
        "
      />


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

              <CheckCircle2 className="h-4 w-4" />

              Trusted Marketplace

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

              Why Choose

              <span className="text-orange-600">
                {" "}FaultMart?
              </span>

            </h2>



            <p
              className="
                mt-6
                text-lg
                leading-8
                text-neutral-600
              "
            >
              We make buying and selling repairable products
              safer through verified sellers, transparent fault
              information and nationwide access.
            </p>


          </div>




          {/* CARDS */}

          <div
            className="
              grid
              gap-6
              md:grid-cols-2
              xl:grid-cols-4
            "
          >

            {features.map((feature) => {

              const Icon = feature.icon;


              return (

                <div
                  key={feature.title}
                  className="
                    group
                    rounded-[32px]
                    border
                    border-neutral-200
                    bg-white
                    p-8
                    transition-all
                    duration-300
                    hover:-translate-y-3
                    hover:border-orange-300
                    hover:shadow-xl
                  "
                >

                  <div
                    className={`
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-2xl
                      bg-gradient-to-br
                      ${feature.color}
                      text-white
                      shadow-lg
                      transition
                      group-hover:scale-110
                    `}
                  >

                    <Icon className="h-8 w-8" />

                  </div>



                  <h3
                    className="
                      mt-7
                      text-xl
                      font-black
                      text-neutral-900
                    "
                  >
                    {feature.title}
                  </h3>



                  <p
                    className="
                      mt-4
                      leading-7
                      text-neutral-600
                    "
                  >
                    {feature.description}
                  </p>


                </div>

              );

            })}

          </div>


        </div>

      </Container>

    </section>
  );
}