import { Listing } from "@/types/listing";

interface Props {
  listing: Listing;
}

function Spec({
  label,
  value,
}: {
  label: string;
  value?: string | number | boolean | null;
}) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  return (
    <>
      <span className="font-medium text-gray-500">
        {label}
      </span>

      <span className="font-semibold text-right">
        {String(value)}
      </span>
    </>
  );
}

export default function ListingSpecs({
  listing,
}: Props) {
  return (
    <section className="rounded-3xl border bg-white p-8">

      <h2 className="mb-8 text-2xl font-black">
        Specifications
      </h2>

      <div className="grid grid-cols-2 gap-y-5">

        {listing.vehicleDetail && (
          <>
            <Spec label="Make" value={listing.vehicleDetail.make} />
            <Spec label="Model" value={listing.vehicleDetail.model} />
            <Spec label="Year" value={listing.vehicleDetail.year} />
            <Spec label="Mileage" value={listing.vehicleDetail.mileage} />
            <Spec label="Fuel" value={listing.vehicleDetail.fuelType} />
            <Spec label="Transmission" value={listing.vehicleDetail.transmission} />
            <Spec label="Body Type" value={listing.vehicleDetail.bodyType} />
            <Spec label="Engine" value={listing.vehicleDetail.engineSize} />
            <Spec label="Colour" value={listing.vehicleDetail.color} />
            <Spec label="Seats" value={listing.vehicleDetail.seats} />
            <Spec label="Doors" value={listing.vehicleDetail.doors} />
            <Spec label="Drive Type" value={listing.vehicleDetail.driveType} />
          </>
        )}

        {listing.applianceDetail && (
          <>
            <Spec label="Brand" value={listing.applianceDetail.brand} />
            <Spec label="Model" value={listing.applianceDetail.model} />
            <Spec label="Category" value={listing.applianceDetail.category} />
            <Spec label="Condition" value={listing.applianceDetail.condition} />
            <Spec label="Age" value={listing.applianceDetail.age} />
            <Spec label="Power" value={listing.applianceDetail.powerRating} />
            <Spec
              label="Warranty"
              value={listing.applianceDetail.warranty ? "Yes" : "No"}
            />
          </>
        )}

      </div>

    </section>
  );
}