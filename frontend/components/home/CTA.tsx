import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="py-20">
      <Container>
        <div className="rounded-2xl bg-primary p-10 text-center text-white">
          <h2 className="text-3xl font-bold">
            Have a faulty item to sell?
          </h2>

          <p className="mt-4">
            Turn unwanted repairable goods into cash.
          </p>

          <Button className="mt-6">
            Sell Your Item
          </Button>
        </div>
      </Container>
    </section>
  );
}