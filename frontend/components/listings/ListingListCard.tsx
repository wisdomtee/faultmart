import Link from "next/link";
import {
  Eye,
  MapPin,
  User,
  ShieldCheck,
} from "lucide-react";

import ListingImage from "./ListingImage";
import ListingBadge from "./ListingBadge";
import ListingPrice from "./ListingPrice";

import { Listing } from "@/types/listing";


interface Props {
  listing: Listing;
}


export default function ListingListCard({
  listing,
}: Props) {

  const image =
    listing.images.length > 0
      ? listing.images[0].url
      : undefined;


  const sellerName =
    `${listing.seller.firstName} ${listing.seller.lastName}`;


  const location =
    listing.city ||
    listing.state ||
    listing.location ||
    "Location unavailable";


  return (

    <Link
      href={`/listings/${listing.slug}`}
      className="
        group
        block
      "
    >

      <article
        className="
          flex
          flex-col
          gap-6
          rounded-3xl
          border
          border-neutral-200
          bg-white
          p-5
          transition
          hover:-translate-y-1
          hover:border-orange-300
          hover:shadow-xl
          md:flex-row
        "
      >

        {/* IMAGE */}

        <div
          className="
            relative
            h-56
            w-full
            overflow-hidden
            rounded-2xl
            md:w-72
          "
        >

          <ListingImage
            src={image}
            alt={listing.title}
          />


          <div
            className="
              absolute
              left-4
              top-4
            "
          >
            <ListingBadge
  condition={listing.condition ?? "UNKNOWN"}
/>
          </div>

        </div>



        {/* CONTENT */}

        <div
          className="
            flex
            flex-1
            flex-col
          "
        >

          <ListingPrice
            price={listing.price}
            currency={listing.currency}
          />


          <h3
            className="
              mt-3
              text-2xl
              font-black
              text-neutral-900
              group-hover:text-orange-600
            "
          >
            {listing.title}
          </h3>


          <div
            className="
              mt-4
              flex
              items-center
              gap-2
              text-sm
              text-neutral-500
            "
          >

            <MapPin className="h-4 w-4 text-orange-500"/>

            {location}

          </div>



          <div
            className="
              mt-auto
              flex
              items-center
              justify-between
              border-t
              pt-5
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-orange-100
                  text-orange-600
                "
              >

                <User className="h-5 w-5"/>

              </div>


              <div>

                <p className="text-sm font-bold">
                  {sellerName}
                </p>


                <div
                  className="
                    flex
                    items-center
                    gap-1
                    text-xs
                    text-green-600
                  "
                >

                  <ShieldCheck className="h-3.5 w-3.5"/>

                  Verified Seller

                </div>

              </div>

            </div>



            <div
              className="
                flex
                items-center
                gap-2
                rounded-full
                bg-neutral-100
                px-4
                py-2
                text-sm
                font-semibold
              "
            >

              <Eye className="h-4 w-4"/>

              {listing.views}

            </div>


          </div>


        </div>


      </article>

    </Link>

  );
}