"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  AlertCircle,
  Tag,
  Check,
  X,
  Eye,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import TransactionDisclaimer from "@/components/legal/TransactionDisclaimer";

import {
  getReceivedOffers,
  acceptOffer,
  rejectOffer,
} from "@/lib/api";

interface Offer {
  id: string;
  amount: number | string;
  status?: string;
  message?: string | null;
  createdAt?: string;

  buyer?: {
    id: string;
    firstName?: string;
    lastName?: string;
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

function formatCurrency(
  value: number | string | null | undefined
) {
  return `₦${Number(value ?? 0).toLocaleString("en-NG")}`;
}

function formatDate(value?: string) {
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

function formatStatus(status?: string) {
  if (!status) return "Unknown";

  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getStatusClasses(status?: string) {
  const normalized = status?.toLowerCase();

  if (normalized === "accepted") {
    return "bg-green-50 text-green-700";
  }

  if (normalized === "rejected") {
    return "bg-red-50 text-red-700";
  }

  if (normalized === "pending") {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-neutral-100 text-neutral-600";
}

export default function SellerOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] =
    useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [showAcceptModal, setShowAcceptModal] =
    useState(false);

  const [selectedOffer, setSelectedOffer] =
    useState<Offer | null>(null);

  const [sellerDisclaimerAccepted, setSellerDisclaimerAccepted] =
    useState(false);

  async function loadOffers() {
    try {
      setLoading(true);
      setError(null);

      const result = await getReceivedOffers();

      console.log("RECEIVED OFFERS:", result);

      setOffers(result ?? []);
    } catch (err) {
      console.error("FAILED TO LOAD OFFERS:", err);

      setError("Unable to load your received offers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  const timer = window.setTimeout(() => {
    void loadOffers();
  }, 0);

  return () => window.clearTimeout(timer);
}, []);

  /*
   * Open the acceptance modal.
   * The actual accept API call happens only after
   * the seller accepts the transaction disclaimer.
   */
  function handleAccept(offer: Offer) {
    setSelectedOffer(offer);
    setSellerDisclaimerAccepted(false);
    setShowAcceptModal(true);
  }

  /*
   * Confirm acceptance after disclaimer acknowledgement.
   */
  async function confirmAcceptOffer() {
    if (!selectedOffer) {
      return;
    }

    if (!sellerDisclaimerAccepted) {
      toast.error(
        "Please acknowledge the transaction disclaimer before accepting the offer."
      );
      return;
    }

    try {
      setProcessingId(selectedOffer.id);

      await acceptOffer(selectedOffer.id);

      toast.success("Offer accepted successfully.");

      setShowAcceptModal(false);
      setSelectedOffer(null);
      setSellerDisclaimerAccepted(false);

      await loadOffers();
    } catch (err: unknown) {
      console.error(
        "FAILED TO ACCEPT OFFER:",
        err
      );

      toast.error(
  getErrorMessage(
    err,
    "Unable to accept this offer."
  )
);
    } finally {
      setProcessingId(null);
    }
  }

  /*
   * Reject offer immediately after confirmation.
   */
  async function handleReject(offer: Offer) {
    const confirmed = window.confirm(
      "Reject this offer?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(offer.id);

      await rejectOffer(offer.id);

      toast.success("Offer rejected.");

      await loadOffers();
    } catch (err: unknown) {
      console.error(
        "FAILED TO REJECT OFFER:",
        err
      );

      toast.error(
  getErrorMessage(
    err,
    "Unable to reject this offer."
  )
);
    } finally {
      setProcessingId(null);
    }
  }

  function closeAcceptModal() {
    if (processingId) {
      return;
    }

    setShowAcceptModal(false);
    setSelectedOffer(null);
    setSellerDisclaimerAccepted(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-neutral-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading offers...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>

        <button
          type="button"
          onClick={loadOffers}
          className="mt-4 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          Try Again
        </button>
      </main>
    );
  }

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-neutral-100 p-3">
                  <Tag className="h-6 w-6 text-neutral-700" />
                </div>

                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
                    Offers
                  </h1>

                  <p className="mt-1 text-neutral-500">
                    Manage offers received from buyers.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-xl border border-neutral-200 px-5 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-neutral-500">
              Total Offers
            </p>

            <p className="mt-2 text-2xl font-bold text-neutral-900">
              {offers.length}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-neutral-500">
              Pending
            </p>

            <p className="mt-2 text-2xl font-bold text-amber-600">
              {
                offers.filter(
                  (offer) =>
                    offer.status?.toLowerCase() ===
                    "pending"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-neutral-500">
              Accepted
            </p>

            <p className="mt-2 text-2xl font-bold text-green-600">
              {
                offers.filter(
                  (offer) =>
                    offer.status?.toLowerCase() ===
                    "accepted"
                ).length
              }
            </p>
          </div>
        </div>

        {/* OFFERS */}
        {offers.length === 0 ? (
          <section className="rounded-2xl border border-neutral-200 bg-white p-12 text-center shadow-sm">
            <Tag className="mx-auto h-10 w-10 text-neutral-300" />

            <h2 className="mt-4 text-lg font-bold text-neutral-900">
              No offers yet
            </h2>

            <p className="mt-2 text-sm text-neutral-500">
              When buyers make offers on your listings,
              they will appear here.
            </p>

            <Link
              href="/listings/create"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              <Package className="h-4 w-4" />
              Create Listing
            </Link>
          </section>
        ) : (
          <div className="space-y-4">
            {offers.map((offer) => {
              const buyerName = [
                offer.buyer?.firstName,
                offer.buyer?.lastName,
              ]
                .filter(Boolean)
                .join(" ");

              const listingImage =
                offer.listing?.images?.[0]?.url;

              const isPending =
                offer.status?.toLowerCase() ===
                "pending";

              const isProcessing =
                processingId === offer.id;

              return (
                <section
                  key={offer.id}
                  className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                    {/* LISTING */}
                    <div className="flex min-w-0 flex-1 gap-4">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                        {listingImage ? (
                          <img
                            src={listingImage}
                            alt={
                              offer.listing?.title ||
                              "Listing"
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Package className="h-7 w-7 text-neutral-300" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                          Offer for
                        </p>

                        <h2 className="mt-1 truncate text-lg font-bold text-neutral-900">
                          {offer.listing?.title ||
                            "Listing"}
                        </h2>

                        {offer.listing?.slug && (
                          <Link
                            href={`/listings/${offer.listing.slug}`}
                            className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View listing
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* BUYER */}
                    <div className="flex items-center gap-3 lg:w-52">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-100">
                        {offer.buyer?.profileImage ? (
                          <img
                            src={offer.buyer.profileImage}
                            alt={
                              buyerName || "Buyer"
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm font-bold text-neutral-500">
                            {(
                              offer.buyer?.firstName?.[0] ||
                              "B"
                            ).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-neutral-400">
                          Buyer
                        </p>

                        <p className="truncate font-semibold text-neutral-900">
                          {buyerName || "Buyer"}
                        </p>

                        {offer.buyer?.username && (
                          <p className="truncate text-xs text-neutral-500">
                            @{offer.buyer.username}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* AMOUNT */}
                    <div className="lg:w-40">
                      <p className="text-xs text-neutral-400">
                        Offer Amount
                      </p>

                      <p className="mt-1 text-xl font-bold text-neutral-900">
                        {formatCurrency(
                          offer.amount
                        )}
                      </p>
                    </div>

                    {/* STATUS */}
                    <div className="lg:w-28">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          offer.status
                        )}`}
                        
                      >
                        {formatStatus(
                          offer.status
                        )}
                      </span>

                      <p className="mt-2 text-xs text-neutral-400">
                        {formatDate(
                          offer.createdAt
                        )}
                      </p>
                    </div>
                  </div>

                  {/* MESSAGE */}
                  {offer.message && (
                    <div className="mt-5 rounded-xl bg-neutral-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                        Buyer Message
                      </p>

                      <p className="mt-2 text-sm leading-6 text-neutral-700">
                        {offer.message}
                      </p>
                    </div>
                  )}

                  {/* ACTIONS */}
                  {isPending && (
                    <div className="mt-5 flex flex-col gap-3 border-t border-neutral-100 pt-5 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() =>
                          handleReject(offer)
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}

                        Reject Offer
                      </button>

                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() =>
                          handleAccept(offer)
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}

                        Accept Offer
                      </button>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </main>

      {/* ACCEPT OFFER MODAL */}
      {showAcceptModal && selectedOffer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={closeAcceptModal}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold text-neutral-900">
                Accept Offer
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                You are about to accept this
                buyer&apos;s offer. This will create
                the transaction order.
              </p>
            </div>

            <div className="mb-5 rounded-xl bg-neutral-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Offer Amount
              </p>

              <p className="mt-1 text-2xl font-bold text-neutral-900">
                {formatCurrency(
                  selectedOffer.amount
                )}
              </p>

              {selectedOffer.listing?.title && (
                <p className="mt-1 text-sm text-neutral-500">
                  {selectedOffer.listing.title}
                </p>
              )}
            </div>

            <div className="mb-6">
              <TransactionDisclaimer
                role="seller"
                checked={sellerDisclaimerAccepted}
                onChange={
                  setSellerDisclaimerAccepted
                }
                disabled={
                  processingId ===
                  selectedOffer.id
                }
              />
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                disabled={
                  processingId ===
                  selectedOffer.id
                }
                onClick={closeAcceptModal}
                className="flex-1 rounded-xl border border-neutral-200 px-5 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  processingId ===
                    selectedOffer.id ||
                  !sellerDisclaimerAccepted
                }
                onClick={confirmAcceptOffer}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processingId ===
                selectedOffer.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}

                Confirm & Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
