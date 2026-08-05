import Container from "@/components/layout/Container";

const stats = [
  {
    label: "Listings",
    value: "10K+",
  },
  {
    label: "Sellers",
    value: "2K+",
  },
  {
    label: "Buyers",
    value: "15K+",
  },
];

export default function Stats() {
  return (
    <section className="py-16 bg-slate-50">
      <Container>
        <div className="grid gap-8 text-center md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label}>
              <h3 className="text-4xl font-bold">
                {stat.value}
              </h3>

              <p className="text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}