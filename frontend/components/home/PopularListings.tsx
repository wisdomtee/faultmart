import Container from "@/components/layout/Container";

export default function PopularListings() {
  return (
    <section className="py-20">
      <Container>
        <h2 className="text-3xl font-bold">
          Popular Listings
        </h2>

        <p className="mt-4 text-muted-foreground">
          Most viewed repairable items on FaultMart.
        </p>
      </Container>
    </section>
  );
}