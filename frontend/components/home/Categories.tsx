import Link from "next/link";
import Container from "@/components/layout/Container";
import {
  Car,
  Smartphone,
  Refrigerator,
  Wrench,
  LucideIcon,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  count: number;
};

type Props = {
  categories: Category[];
};

const iconMap: Record<string, LucideIcon> = {
  vehicles: Car,
  electronics: Smartphone,
  appliances: Refrigerator,
  "parts-components": Wrench,
};

export default function Categories({ categories }: Props) {
  return (
    <section className="py-20">
      <Container>
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold">
            Explore Categories
          </h2>

          <p className="mt-4 text-muted-foreground">
            Find repairable goods across multiple categories.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon =
              iconMap[category.slug] || Wrench;

            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group rounded-xl border p-6 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg"
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary transition group-hover:bg-primary group-hover:text-white">
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="text-xl font-semibold">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  {category.count} Listings
                </p>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}