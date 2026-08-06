import Image from "next/image";
import { Phone, ShieldCheck, User } from "lucide-react";

interface Seller {
  firstName: string;
  lastName: string;
  phone?: string | null;
  profileImage?: string | null;
  verificationStatus: string;
  createdAt: string | Date;
}

interface Props {
  seller: Seller;
}

export default function SellerCard({
  seller,
}: Props) {
  const name = `${seller.firstName} ${seller.lastName}`;

  const memberSince = new Date(
    seller.createdAt
  ).getFullYear();

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">

      <h3 className="mb-6 text-lg font-bold">
        Seller Information
      </h3>

      <div className="flex items-center gap-4">

        <div className="relative h-16 w-16 overflow-hidden rounded-full bg-orange-100">

          {seller.profileImage ? (
            <Image
              src={seller.profileImage}
              alt={name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <User className="h-8 w-8 text-orange-600" />
            </div>
          )}

        </div>

        <div>

          <h4 className="font-bold text-lg">
            {name}
          </h4>

          {seller.verificationStatus === "VERIFIED" && (
            <div className="mt-1 flex items-center gap-1 text-sm font-medium text-green-600">
              <ShieldCheck className="h-4 w-4" />
              Verified Seller
            </div>
          )}

          <p className="mt-2 text-sm text-gray-500">
            Member since {memberSince}
          </p>

        </div>

      </div>

      {seller.phone && (
        <a
          href={`tel:${seller.phone}`}
          className="mt-6 flex items-center justify-center gap-2 rounded-xl border py-3 font-semibold transition hover:bg-gray-50"
        >
          <Phone className="h-5 w-5" />
          {seller.phone}
        </a>
      )}

    </div>
  );
}