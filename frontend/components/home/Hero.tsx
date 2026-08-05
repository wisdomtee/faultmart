import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="bg-white py-24">
      <Container>
        <div className="max-w-4xl">

          <span className="inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700">
            AFRICA'S NO.1 MARKETPLACE FOR REPAIRABLE GOODS
          </span>

          <h1 className="mt-8 text-5xl font-bold tracking-tight text-neutral-900 md:text-7xl">
            Buy, sell, and trade{" "}
            <span className="text-orange-600">
              repairable cars,
              appliances, and electronics
            </span>{" "}
            — with nothing hidden.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">
            Every FaultMart listing shows the real condition —
            what works, what's broken, and what it takes to fix it —
            so buyers know exactly what they are getting.
          </p>


          <div className="mt-10 flex flex-wrap gap-4">

            <Button
              size="lg"
              className="bg-orange-600 hover:bg-orange-700"
            >
              Browse Listings
            </Button>

            <Button
              size="lg"
              variant="outline"
            >
              Sell an Item
            </Button>

          </div>


          <div className="mt-16 flex flex-wrap gap-12">

            <div>
              <p className="text-4xl font-bold">
                14,200+
              </p>
              <p className="text-sm text-muted-foreground">
                Active Listings
              </p>
            </div>


            <div>
              <p className="text-4xl font-bold">
                36
              </p>
              <p className="text-sm text-muted-foreground">
                States Covered
              </p>
            </div>


            <div>
              <p className="text-4xl font-bold">
                100%
              </p>
              <p className="text-sm text-muted-foreground">
                Faults Disclosed
              </p>
            </div>

          </div>

        </div>
      </Container>
    </section>
  );
}