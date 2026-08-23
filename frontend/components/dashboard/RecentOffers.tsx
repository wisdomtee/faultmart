"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Tag,
  Check,
  X,
  Loader2,
  ArrowUpRight,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  acceptOffer,
  rejectOffer,
} from "@/lib/api";

interface Offer {
  id: string;
  amount?: number | string | null;
  message?: string | null;
  status?: string | null;
  createdAt?: string | null;

  buyer?: {
    id?: string;
    firstName?: string | null;
    lastName?: string | null;
    username?: string | null;
    profileImage?: string | null;
  };

  listing?: {
    id: string;
    title: string;
    slug: string;
    images?: Array<{
      url: string;
    }>;
  };
}

interface Props {
  offers: Offer[];
  onOfferUpdated?: () => void;
}

function formatCurrency(
  value: number | string | null | undefined
) {
  return `₦${Number(value ?? 0).toLocaleString("en-NG")}`;
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
    ).response;

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  return fallback;
}

function formatStatus(status?: string | null) {
  if (!status) return "Unknown";

  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getStatusClasses(status?: string | null) {
  const normalized = status?.toLowerCase();

  if (
    normalized === "accepted" ||
    normalized === "approved"
  ) {
    return "bg-green-50 text-green-700";
  }

  if (
    normalized === "rejected" ||
    normalized === "cancelled" ||
    normalized === "canceled"
  ) {
    return "bg-red-50 text-red-700";
  }

  return "bg-amber-50 text-amber-700";
}

export default function RecentOffers({
  offers,
  onOfferUpdated,
}: Props) {
  const [processingOffer, setProcessingOffer] =
    useState<string | null>(null);

  async function handleAccept(offerId: string) {
    try {
      setProcessingOffer(offerId);

      await acceptOffer(offerId);

      toast.success("Offer accepted successfully.");

      onOfferUpdated?.();
    } catch (error: unknown) {
      console.error(
        "FAILED TO ACCEPT OFFER:",
        error
      );

      const message = getErrorMessage(
  error,
  "Unable to accept offer."
);

      toast.error(message);
    } finally {
      setProcessingOffer(null);
    }
  }

  async function handleReject(offerId: string) {
    try {
      setProcessingOffer(offerId);

      await rejectOffer(offerId);

      toast.success("Offer rejected.");

      onOfferUpdated?.();
    } catch (error: unknown) {
      console.error(
        "FAILED TO REJECT OFFER:",
        error
      );

      const message = getErrorMessage(
  error,
  "Unable to reject offer."
);

      toast.error(message);
    } finally {
      setProcessingOffer(null);
    }
  }

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">
            Recent Offers
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Offers received from buyers.
          </p>
        </div>

        <Tag className="h-5 w-5 text-neutral-400" />
      </div>

      {/* EMPTY STATE */}
      {offers.length === 0 ? (
        <div className="py-10 text-center">
          <Tag className="mx-auto h-8 w-8 text-neutral-300" />

          <p className="mt-3 text-sm text-neutral-500">
            No offers yet.
          </p>

          <p className="mt-1 text-xs text-neutral-400">
            Buyer offers on your listings will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-5 divide-y divide-neutral-100">
          {offers.map((offer) => {
            const buyerName = [
              offer.buyer?.firstName,
              offer.buyer?.lastName,
            ]
              .filter(Boolean)
              .join(" ");

            const buyerDisplayName =
              buyerName ||
              offer.buyer?.username ||
              "Buyer";

            const imageUrl =
              offer.buyer?.profileImage;

            const normalizedStatus =
              offer.status?.toLowerCase();

            const isPending =
              normalizedStatus === "pending";

            const isProcessing =
              processingOffer === offer.id;

            const listingImage =
              offer.listing?.images?.[0]?.url;

            return (
              <div
                key={offer.id}
                className="py-5 first:pt-0 last:pb-0"
              >
                {/* MAIN OFFER ROW */}
                <div className="flex items-start gap-4">
                  {/* BUYER AVATAR */}
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-neutral-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={buyerDisplayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-bold text-neutral-500">
                        {(
                          offer.buyer?.firstName?.[0] ||
                          offer.buyer?.username?.[0] ||
                          "B"
                        ).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* OFFER DETAILS */}
                  <div className="min-w-0 flex-1">
                    {/* LISTING */}
                    {offer.listing?.slug ? (
                      <Link
                        href={`/listings/${offer.listing.slug}`}
                        className="font-semibold text-neutral-900 transition hover:text-neutral-700"
                      >
                        {offer.listing.title}
                      </Link>
                    ) : (
                      <p className="font-semibold text-neutral-900">
                        {offer.listing?.title ||
                          "Listing"}
                      </p>
                    )}

                    {/* BUYER + AMOUNT */}
                    <p className="mt-1 text-sm text-neutral-500">
                      <span className="font-medium text-neutral-700">
                        {buyerDisplayName}
                      </span>{" "}
                      offered{" "}
                      <span className="font-bold text-neutral-900">
                        {formatCurrency(
                          offer.amount
                        )}
                      </span>
                    </p>

                    {/* MESSAGE */}
                    {offer.message?.trim() && (
                      <div className="mt-3 flex items-start gap-2 rounded-lg bg-neutral-50 px-3 py-2.5">
                        <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />

                        <p className="text-sm leading-5 text-neutral-600">
                          {offer.message}
                        </p>
                      </div>
                    )}

                    {/* DATE */}
                    <p className="mt-2 text-xs text-neutral-400">
                      {formatDate(offer.createdAt)}
                    </p>
                  </div>

                  {/* STATUS */}
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                      offer.status
                    )}`}
                  >
                    {formatStatus(offer.status)}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="mt-4 flex flex-wrap items-center gap-2 pl-[3.75rem]">
                  {/* VIEW LISTING */}
                  {offer.listing?.slug && (
                    <Link
                      href={`/listings/${offer.listing.slug}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-50"
                    >
                      View Listing

                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  )}

                  {/* PENDING ACTIONS */}
                  {isPending && (
                    <>
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() =>
                          handleReject(offer.id)
                        }
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <X className="h-3.5 w-3.5" />
                        )}

                        Reject
                      </button>

                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() =>
                          handleAccept(offer.id)
                        }
                        className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}

                        Accept
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}