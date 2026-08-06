import {
  FilePlus2,
  MessagesSquare,
  Handshake,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import Container from "@/components/layout/Container";


const steps = [
  {
    number: "01",
    title: "Create Your Listing",
    description:
      "Upload photos, set your price, and explain the fault clearly so buyers understand exactly what they are buying.",
    icon: FilePlus2,
  },

  {
    number: "02",
    title: "Connect With Buyers",
    description:
      "Answer questions, discuss repairs, negotiate offers, and communicate directly through FaultMart.",
    icon: MessagesSquare,
  },

  {
    number: "03",
    title: "Complete The Deal",
    description:
      "Agree on the best offer, complete the transaction, and give your item a second life.",
    icon: Handshake,
  },
];



export default function HowItWorks() {


  return (

    <section
      className="
        relative
        overflow-hidden
        bg-neutral-950
        py-28
      "
    >



      {/* Background Glow */}

      <div
        className="
          absolute
          left-1/2
          top-0
          h-[500px]
          w-[500px]
          -translate-x-1/2
          rounded-full
          bg-orange-500/20
          blur-3xl
        "
      />



      <Container>

        <div className="relative">





          {/* Header */}

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
                border
                border-orange-400/20
                bg-orange-500/10
                px-5
                py-2
                text-sm
                font-bold
                uppercase
                tracking-[0.2em]
                text-orange-400
              "
            >

              <CheckCircle2 className="h-4 w-4"/>

              Simple Process

            </div>





            <h2
              className="
                mt-6
                text-4xl
                font-black
                text-white
                md:text-5xl
              "
            >

              Buy And Sell

              <span className="text-orange-500">
                {" "}With Confidence
              </span>


            </h2>





            <p
              className="
                mt-6
                text-lg
                leading-8
                text-neutral-400
              "
            >

              FaultMart makes trading repairable products
              simple, transparent, and secure for everyone.

            </p>


          </div>








          {/* Steps */}

          <div
            className="
              relative
              grid
              gap-8
              lg:grid-cols-3
            "
          >


            {steps.map((step,index)=>{


              const Icon = step.icon;


              return (

                <div
                  key={step.number}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[36px]
                    border
                    border-white/10
                    bg-white/5
                    p-8
                    transition-all
                    duration-300
                    hover:-translate-y-3
                    hover:border-orange-500/40
                    hover:bg-white/10
                    hover:shadow-2xl
                  "
                >





                  {/* Number */}

                  <div
                    className="
                      absolute
                      right-6
                      top-4
                      text-7xl
                      font-black
                      text-white/5
                    "
                  >

                    {step.number}

                  </div>







                  {/* Icon */}

                  <div
                    className="
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-2xl
                      bg-orange-600
                      text-white
                      shadow-lg
                      shadow-orange-600/30
                      transition
                      duration-300
                      group-hover:scale-110
                    "
                  >

                    <Icon className="h-8 w-8"/>

                  </div>








                  <h3
                    className="
                      mt-8
                      text-2xl
                      font-black
                      text-white
                    "
                  >

                    {step.title}

                  </h3>





                  <p
                    className="
                      mt-4
                      leading-7
                      text-neutral-400
                    "
                  >

                    {step.description}

                  </p>







                  {/* Bottom Indicator */}

                  <div
                    className="
                      mt-8
                      flex
                      items-center
                      gap-2
                      text-sm
                      font-semibold
                      text-orange-400
                    "
                  >

                    Step {step.number}

                    <ArrowRight className="h-4 w-4"/>

                  </div>







                  {/* Connector */}

                  {index !== steps.length - 1 && (

                    <ArrowRight
                      className="
                        absolute
                        -right-6
                        top-1/2
                        hidden
                        h-10
                        w-10
                        -translate-y-1/2
                        text-orange-500
                        lg:block
                      "
                    />

                  )}



                </div>

              );


            })}


          </div>





        </div>


      </Container>


    </section>

  );
}