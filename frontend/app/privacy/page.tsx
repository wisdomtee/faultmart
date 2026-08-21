import Container from "@/components/layout/Container";

const sections = [
  {
    title: "1. Information We Collect",
    content:
      "When you use FaultMart, we may collect information you provide when creating an account, creating a listing, communicating with other users, making offers or contacting our support team. This may include your name, email address, phone number, location information and information associated with your listings or transactions.",
  },
  {
    title: "2. How We Use Your Information",
    content:
      "We use information to operate and improve FaultMart, provide marketplace services, help buyers and sellers communicate, process marketplace activities, maintain account security, respond to support requests and detect or investigate suspicious activity.",
  },
  {
    title: "3. Marketplace Information",
    content:
      "Information included in a marketplace listing may be visible to other FaultMart users. Sellers should avoid publishing sensitive personal information in listing descriptions, photographs or other public areas of the marketplace.",
  },
  {
    title: "4. Communications",
    content:
      "FaultMart may provide communication features that allow buyers and sellers to interact. Information shared through these features should be limited to what is reasonably necessary to complete or discuss a transaction.",
  },
  {
    title: "5. Data Security",
    content:
      "We take reasonable technical and organizational measures to protect information associated with FaultMart accounts and marketplace activity. However, no internet-based service can guarantee absolute security.",
  },
  {
    title: "6. Third-Party Services",
    content:
      "FaultMart may rely on trusted third-party infrastructure and service providers to operate parts of the platform. These providers may process information only as necessary to provide their services to FaultMart.",
  },
  {
    title: "7. Your Choices",
    content:
      "You may review and update certain account information through your FaultMart account. If you have questions about your personal information or want to request assistance with your information, you can contact the FaultMart team.",
  },
  {
    title: "8. Changes to This Policy",
    content:
      "We may update this Privacy Policy as FaultMart develops. When material changes are made, we may provide an appropriate notice through the platform or other available communication channels.",
  },
  {
    title: "9. Contact Us",
    content:
      "If you have questions about this Privacy Policy or how information is handled on FaultMart, please contact our support team.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-neutral-950 py-20 text-white md:py-28">
        <Container>
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
              Legal
            </p>

            <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
              Privacy Policy
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-400">
              This policy explains how FaultMart handles information when you
              use our marketplace and related services.
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
