import Container from "@/components/layout/Container";

const sections = [
  {
    title: "1. About FaultMart",
    content:
      "FaultMart is a marketplace that connects buyers and sellers of vehicles, electronics, appliances, parts, tools and other products, including products that may be faulty, damaged or in need of repair.",
  },
  {
    title: "2. Using FaultMart",
    content:
      "You agree to use FaultMart lawfully and responsibly. You must provide accurate information when creating an account or listing and must not use the platform for fraudulent, abusive, deceptive or unlawful activity.",
  },
  {
    title: "3. Accounts",
    content:
      "Some FaultMart features require an account. You are responsible for keeping your account credentials secure and for activity carried out through your account. You should notify FaultMart if you believe your account has been accessed without authorization.",
  },
  {
    title: "4. Listings",
    content:
      "Sellers are responsible for the accuracy of their listings. Product descriptions, photographs, prices, locations, condition information and disclosed faults should accurately represent the item being offered.",
  },
  {
    title: "5. Faulty and Repairable Products",
    content:
      "FaultMart is specifically designed to support the trade of products that may require repair. Buyers should carefully review listing information, ask questions where necessary and assess whether a product is suitable for their intended use before completing a transaction.",
  },
  {
    title: "6. Offers and Negotiations",
    content:
      "Offers made through FaultMart represent negotiations between buyers and sellers. Users should communicate clearly and act in good faith. Acceptance of an offer may result in marketplace transaction activity according to the applicable FaultMart process.",
  },
  {
    title: "7. Transactions",
    content:
      "FaultMart provides marketplace infrastructure but users remain responsible for ensuring that transactions comply with applicable laws and regulations. Buyers and sellers should verify relevant details before completing a transaction.",
  },
  {
    title: "8. Prohibited Activities",
    content:
      "You may not use FaultMart to list or facilitate unlawful goods or services, impersonate another person, intentionally provide misleading information, interfere with platform security, abuse communication features or engage in activity intended to harm other users.",
  },
  {
    title: "9. Reports and Enforcement",
    content:
      "FaultMart may review reports involving listings, accounts or marketplace activity. Where appropriate, we may remove content, restrict accounts or take other measures to protect the marketplace and its users.",
  },
  {
    title: "10. Marketplace Availability",
    content:
      "We work to keep FaultMart available and reliable, but we do not guarantee uninterrupted access. Features may occasionally be modified, suspended or unavailable because of maintenance, updates, technical problems or circumstances outside our control.",
  },
  {
    title: "11. Changes to These Terms",
    content:
      "These Terms of Service may be updated as FaultMart evolves. Continued use of the platform after an updated version becomes effective means you agree to the revised terms.",
  },
  {
    title: "12. Contact",
    content:
      "If you have questions about these Terms of Service, please contact the FaultMart team through the available support channels.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-neutral-950 py-20 text-white md:py-28">
        <Container>
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
              Legal
            </p>

            <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
              Terms of Service
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-400">
              These terms explain the rules for using FaultMart and the
              responsibilities of buyers and sellers on the marketplace.
            </p>

            <p className="mt-6 text-sm text-neutral-500">
              Last updated: August 21, 2026
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-4xl rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm md:p-12">
            <div className="space-y-10">
              {sections.map((section) => (
                <section key={section.title}>
                  <h2 className="text-xl font-black text-neutral-900 md:text-2xl">
                    {section.title}
                  </h2>

                  <p className="mt-4 leading-8 text-neutral-600">
                    {section.content}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
