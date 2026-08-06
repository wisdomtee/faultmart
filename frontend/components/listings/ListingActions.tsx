"use client";

import Link from "next/link";
import {
  Heart,
  MessageCircle,
  BadgeDollarSign,
} from "lucide-react";

import ShareButton from "./ShareButton";

interface Props {
  phone?: string | null;
  listingId: string;
}

export default function ListingActions({
  phone,
}: Props) {
  const whatsapp =
    phone
      ? `https://wa.me/${phone.replace(/\D/g, "")}`
      : "#";

  return (
    <div className="space-y-4">

      <button
        className="
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-orange-600
          py-4
          font-bold
          text-white
          transition
          hover:bg-orange-700
        "
      >
        <BadgeDollarSign className="h-5 w-5" />
        Make Offer
      </button>

      <Link
        href={whatsapp}
        target="_blank"
        className="
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-green-600
          py-4
          font-bold
          text-white
          transition
          hover:bg-green-700
        "
      >
        <MessageCircle className="h-5 w-5" />
        WhatsApp Seller
      </Link>

      <button
        className="
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          py-3
          font-semibold
          transition
          hover:bg-gray-50
        "
      >
        <Heart className="h-5 w-5" />
        Save Listing
      </button>

      <ShareButton />

    </div>
  );
}