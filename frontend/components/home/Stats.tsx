import Container from "@/components/layout/Container";
import {
  Users,
  Package,
  ShoppingBag,
  Star,
} from "lucide-react";

interface Props {
  statistics: {
    users: number;
    listings: number;
    sold: number;
    reviews: number;
  };
}

export default function Stats({
  statistics,
}: Props) {

  const stats = [
    {
      label: "Registered Users",
      value: statistics.users,
      icon: Users,
    },
    {
      label: "Active Listings",
      value: statistics.listings,
      icon: Package,
    },
    {
      label: "Successful Sales",
      value: statistics.sold,
      icon: ShoppingBag,
    },
    {
      label: "Customer Reviews",
      value: statistics.reviews,
      icon: Star,
    },
  ];


  return (
    <section className="bg-neutral-900 py-24">
      <Container>

        <div className="mx-auto mb-12 max-w-2xl text-center">

          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-orange-500">
            FaultMart Community
          </p>

          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Trusted by buyers and sellers
          </h2>

          <p className="mt-4 text-neutral-400">
            A growing marketplace connecting people with repairable goods.
          </p>

        </div>


        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {stats.map((stat) => {

            const Icon = stat.icon;


            return (
              <div
                key={stat.label}
                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  p-8
                  text-center
                  backdrop-blur
                  transition
                  hover:-translate-y-1
                  hover:bg-white/10
                "
              >

                <div className="
                  mx-auto
                  mb-5
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-xl
                  bg-orange-500/10
                  text-orange-500
                ">
                  <Icon className="h-7 w-7" />
                </div>


                <h3 className="text-4xl font-bold text-white">
                  {stat.value.toLocaleString()}
                </h3>


                <p className="mt-3 text-sm text-neutral-400">
                  {stat.label}
                </p>


              </div>
            );

          })}

        </div>

      </Container>
    </section>
  );
}