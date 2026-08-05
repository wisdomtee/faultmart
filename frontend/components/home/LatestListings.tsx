import Container from "@/components/layout/Container";

const listings = [
  {
    title: "Toyota Corolla 2015 - Engine Fault",
    price: "₦2,500,000",
  },
  {
    title: "Samsung Smart TV - Screen Issue",
    price: "₦80,000",
  },
  {
    title: "LG Washing Machine - Needs Repair",
    price: "₦60,000",
  },
];

export default function LatestListings() {
  return (
    <section className="py-20 bg-slate-50">
      <Container>
        <h2 className="text-3xl font-bold mb-8">
          Latest Listings
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {listings.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border bg-white p-6 hover:shadow-lg"
            >
              <h3 className="font-semibold">
                {item.title}
              </h3>

              <p className="mt-3 text-primary font-bold">
                {item.price}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}