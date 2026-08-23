"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  BadgeDollarSign,
  ShoppingCart,
  Loader2,
  X,
  MapPin,
  Flag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import ShareButton from "./ShareButton";
import TransactionDisclaimer from "@/components/legal/TransactionDisclaimer";
import {
  createConversation,
  createOffer,
  createOrder,
  createReport,
} from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

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
interface Props {
  phone?: string | null;
  listingId: string;
  sellerId: string;
}

export default function ListingActions({
  phone,
  listingId,
  sellerId,
}: Props) {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);

  const [startingChat, setStartingChat] = useState(false);

  const [showPurchaseModal, setShowPurchaseModal] =
  useState(false);

const [shippingAddress, setShippingAddress] =
  useState("");

const [submittingPurchase, setSubmittingPurchase] =
  useState(false);

  const [showOfferModal, setShowOfferModal] = useState(false);

  const [offerAmount, setOfferAmount] = useState("");

  const [offerMessage, setOfferMessage] = useState("");

  const [submittingOffer, setSubmittingOffer] = useState(false);

  const [offerDisclaimerAccepted, setOfferDisclaimerAccepted] =
  useState(false);

    const [showReportModal, setShowReportModal] =
    useState(false);

  const [reportReason, setReportReason] =
    useState("");

  const [reportDescription, setReportDescription] =
    useState("");

  const [submittingReport, setSubmittingReport] =
    useState(false);

  /*
   * WhatsApp URL
   */
  const whatsapp = phone
    ? `https://wa.me/${phone.replace(/\D/g, "")}`
    : "#";

    /*
 * ============================================================
 * BUY NOW
 * ============================================================
 */
function handleBuyNow() {
  if (!user) {
    toast.error("Please log in to purchase this item.");

    router.push(
      `/login?redirect=/listings/${listingId}`
    );

    return;
  }

  if (user.id === sellerId) {
    toast.error(
      "You cannot purchase your own listing."
    );

    return;
  }

  setShowPurchaseModal(true);
}

/*
 * ============================================================
 * SUBMIT PURCHASE
 * ============================================================
 */
async function handleSubmitPurchase() {
  if (!shippingAddress.trim()) {
    toast.error("Please enter your shipping address.");

    return;
  }

  if (!user) {
    toast.error("Please log in to purchase this item.");

    router.push(
      `/login?redirect=/listings/${listingId}`
    );

    return;
  }

  if (user.id === sellerId) {
    toast.error(
      "You cannot purchase your own listing."
    );

    return;
  }

  try {
    setSubmittingPurchase(true);

    const order = await createOrder({
      listingId,
      shippingAddress: shippingAddress.trim(),
    });

    toast.success(
      "Purchase placed successfully!"
    );

    setShippingAddress("");
    setShowPurchaseModal(false);

    router.push(
      `/dashboard/orders?order=${order.id}`
    );
  } catch (error: unknown) {
  console.error(
    "FAILED TO CREATE ORDER:",
    error
  );

  const message = getErrorMessage(
    error,
    "Unable to create order. Please try again."
  );

    toast.error(message);
  } finally {
    setSubmittingPurchase(false);
  }
}

  /*
   * ============================================================
   * MAKE OFFER
   * ============================================================
   */
  function handleMakeOffer() {
    console.log("=================================");
    console.log("MAKE OFFER HANDLER FIRED");
    console.log("USER:", user);
    console.log("LISTING ID:", listingId);
    console.log("SELLER ID:", sellerId);
    console.log("USER ID:", user?.id);
    console.log("=================================");

    /*
     * User is not logged in
     */
    if (!user) {
      console.log("NO USER - REDIRECTING");

      toast.error("Please log in to make an offer.");

      router.push(`/login?redirect=/listings/${listingId}`);

      return;
    }

    console.log("USER EXISTS");

    /*
     * Seller cannot make an offer on their own listing
     */
    if (user.id === sellerId) {
      console.log("USER IS SELLER");

      toast.error(
        "You cannot make an offer on your own listing."
      );

      return;
    }

    /*
     * Buyer is allowed to make an offer
     */
    console.log("OPENING OFFER MODAL");

    setShowOfferModal(true);
  }

  /*
   * ============================================================
   * SUBMIT OFFER
   * ============================================================
   */
  async function handleSubmitOffer() {
    const amount = Number(offerAmount);

    console.log("=================================");
    console.log("SUBMIT OFFER");
    console.log("LISTING ID:", listingId);
    console.log("AMOUNT:", amount);
    console.log("MESSAGE:", offerMessage);
    console.log("=================================");

    /*
     * Validate amount
     */
    if (!offerAmount || Number.isNaN(amount)) {
      toast.error("Please enter a valid offer amount.");
      return;
    }

    /*
     * Amount must be greater than zero
     */
    if (amount <= 0) {
      toast.error(
        "Offer amount must be greater than zero."
      );

      return;
    }

    /*
     * Make sure user is still authenticated
     */
    if (!user) {
      toast.error("Please log in to make an offer.");

      router.push(`/login?redirect=/listings/${listingId}`);

      return;
    }

    /*
     * Prevent seller from submitting
     */
    if (user.id === sellerId) {
      toast.error(
        "You cannot make an offer on your own listing."
      );

      return;
    }

    if (!offerDisclaimerAccepted) {
  toast.error(
    "Please acknowledge the transaction disclaimer before submitting your offer."
  );

  return;
}

    try {
      setSubmittingOffer(true);

      console.log("CREATING OFFER...");

      await createOffer({
        listingId,
        amount,
        message:
          offerMessage.trim() || undefined,
      });

      console.log("OFFER CREATED SUCCESSFULLY");

      toast.success(
        "Offer submitted successfully!"
      );

      /*
       * Reset form
       */
      setOfferAmount("");
setOfferMessage("");
setOfferDisclaimerAccepted(false);

      /*
       * Close modal
       */
      setShowOfferModal(false);
    } catch (error: unknown) {
  console.error(
    "FAILED TO CREATE ORDER:",
    error
  );

  const message = getErrorMessage(
    error,
    "Unable to create order. Please try again."
  );

      toast.error(message);
    } finally {
      setSubmittingOffer(false);
    }
  }

  /*
   * ============================================================
   * MESSAGE SELLER
   * ============================================================
   */
  async function handleMessageSeller() {
    console.log("=================================");
    console.log("MESSAGE SELLER HANDLER FIRED");
    console.log("USER:", user);
    console.log("LISTING ID:", listingId);
    console.log("SELLER ID:", sellerId);
    console.log("USER ID:", user?.id);
    console.log("=================================");

    /*
     * User is not logged in
     */
    if (!user) {
      console.log("NO USER - REDIRECTING");

      toast.error(
        "Please log in to message the seller."
      );

      router.push(
        `/login?redirect=/listings/${listingId}`
      );

      return;
    }

    console.log("USER EXISTS");

    /*
     * Seller cannot message themselves
     */
    if (user.id === sellerId) {
      console.log("USER IS SELLER");

      toast.error(
        "You cannot message yourself."
      );

      return;
    }

        try {
      setStartingChat(true);

      console.log("CREATING CONVERSATION...");

      const conversation = await createConversation(
        listingId,
        sellerId
      );

      console.log(
        "CONVERSATION CREATED:",
        conversation
      );

      router.push(
        `/messages/${conversation.id}`
      );
        } catch (error: unknown) {
  console.error(
    "FAILED TO CREATE ORDER:",
    error
  );

  const message = getErrorMessage(
    error,
    "Unable to create order. Please try again."
  );

      toast.error(message);
    } finally {
      setStartingChat(false);
    }
  }

  /*
   * ============================================================
   * CLOSE OFFER MODAL
   * ============================================================
   */
  function handleCloseOfferModal() {
  if (submittingOffer) {
    return;
  }

  setShowOfferModal(false);
  setOfferDisclaimerAccepted(false);
}

  /*
   * ============================================================
   * REPORT LISTING
   * ============================================================
   */
  function handleReportListing() {
    if (!user) {
      toast.error("Please log in to report this listing.");

      router.push(
        `/login?redirect=/listings/${listingId}`
      );

      return;
    }

    if (user.id === sellerId) {
      toast.error(
        "You cannot report your own listing."
      );

      return;
    }

    setReportReason("");
    setReportDescription("");
    setShowReportModal(true);
  }

  /*
   * ============================================================
   * SUBMIT REPORT
   * ============================================================
   */
  async function handleSubmitReport() {
    if (!reportReason) {
      toast.error("Please select a reason for your report.");

      return;
    }

    if (!user) {
      toast.error("Please log in to report this listing.");

      router.push(
        `/login?redirect=/listings/${listingId}`
      );

      return;
    }

    if (user.id === sellerId) {
      toast.error(
        "You cannot report your own listing."
      );

      return;
    }

    try {
  setSubmittingReport(true);

  console.log("REPORT REASON BEING SENT:", JSON.stringify(reportReason));
  console.log("REPORT LISTING ID:", listingId);

  await createReport({
        listingId,
        reason: reportReason,
        description:
          reportDescription.trim() || undefined,
      });

      toast.success(
        "Report submitted. Thank you for helping keep FaultMart safe."
      );

      setReportReason("");
      setReportDescription("");
      setShowReportModal(false);
    } catch (error: unknown) {
  console.error(
    "FAILED TO CREATE ORDER:",
    error
  );

  const message = getErrorMessage(
    error,
    "Unable to create order. Please try again."
  );

      toast.error(message);
    } finally {
      setSubmittingReport(false);
    }
  }

  return (
    <>
      {/* ======================================================
          ACTION BUTTONS
      ======================================================= */}

      <div className="relative z-50 space-y-4">
        {/* ====================================================
    BUY NOW
==================================================== */}
<button
  type="button"
  onClick={handleBuyNow}
  className="
    relative
    z-50
    flex
    w-full
    cursor-pointer
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
    active:scale-[0.99]
  "
>
  <ShoppingCart className="h-5 w-5" />
  Buy Now
</button>
        {/* ====================================================
            MAKE OFFER
        ===================================================== */}
        <button
  type="button"
  onClick={handleMakeOffer}
  className="
    relative
    z-50
    flex
    w-full
    cursor-pointer
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

        {/* ====================================================
            MESSAGE SELLER
        ===================================================== */}

<button
  type="button"
  onClick={handleMessageSeller}
  className="
    flex
    w-full
    items-center
    justify-center
    gap-2
    rounded-xl
    bg-blue-600
    py-4
    font-bold
    text-white
    transition
    hover:bg-blue-700
    active:scale-[0.99]
  "
>
  <MessageCircle className="h-5 w-5" />
  Message Seller
</button>

        {/* ====================================================
            WHATSAPP
        ===================================================== */}
        {phone ? (
          <Link
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
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
              active:scale-[0.99]
            "
          >
            <MessageCircle className="h-5 w-5" />

            WhatsApp Seller
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-gray-200
              py-4
              font-bold
              text-gray-500
            "
          >
            <MessageCircle className="h-5 w-5" />

            WhatsApp Unavailable
          </button>
        )}

        {/* ====================================================
            SAVE LISTING
        ===================================================== */}
        <button
          type="button"
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-gray-300
            py-3
            font-semibold
            text-gray-700
            transition
            hover:bg-gray-50
          "
        >
          <Heart className="h-5 w-5" />

          Save Listing
        </button>

        {/* ====================================================
            REPORT LISTING
        ===================================================== */}
        <button
          type="button"
          onClick={handleReportListing}
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-red-200
            py-3
            font-semibold
            text-red-600
            transition
            hover:bg-red-50
            active:scale-[0.99]
          "
        >
          <Flag className="h-5 w-5" />
          Report Listing
        </button>
        
        {/* ====================================================
            SHARE
        ===================================================== */}
        <ShareButton />
      </div>

      {/* ======================================================
          OFFER MODAL
      ======================================================= */}

      {showOfferModal && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/50
            px-4
          "
          onClick={handleCloseOfferModal}
        >
          <div
            className="
              w-full
              max-w-md
              rounded-2xl
              bg-white
              p-6
              shadow-2xl
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* ==================================================
                MODAL HEADER
            =================================================== */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Make an Offer
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter the amount you&apos;d like to offer.
                </p>
              </div>

              <button
                type="button"
                disabled={submittingOffer}
                onClick={handleCloseOfferModal}
                className="
                  rounded-full
                  p-2
                  text-gray-500
                  transition
                  hover:bg-gray-100
                  hover:text-gray-900
                  disabled:opacity-50
                "
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* ==================================================
                OFFER AMOUNT
            =================================================== */}
            <div className="mb-4">
              <label
                htmlFor="offer-amount"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                Your Offer
              </label>

              <div className="relative">
                <span
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    font-semibold
                    text-gray-500
                  "
                >
                  ₦
                </span>

                <input
                  id="offer-amount"
                  type="number"
                  min="1"
                  step="1"
                  value={offerAmount}
                  onChange={(event) =>
                    setOfferAmount(
                      event.target.value
                    )
                  }
                  placeholder="Enter amount"
                  disabled={submittingOffer}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    py-3
                    pl-10
                    pr-4
                    outline-none
                    transition
                    focus:border-orange-500
                    focus:ring-2
                    focus:ring-orange-100
                  "
                />
              </div>
            </div>

            {/* ==================================================
                OFFER MESSAGE
            =================================================== */}
            <div className="mb-6">
              <label
                htmlFor="offer-message"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                Message

                <span className="ml-1 font-normal text-gray-400">
                  (optional)
                </span>
              </label>

              <textarea
                id="offer-message"
                value={offerMessage}
                onChange={(event) =>
                  setOfferMessage(
                    event.target.value
                  )
                }
                placeholder="Add a message to the seller..."
                rows={4}
                disabled={submittingOffer}
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-gray-300
                  px-4
                  py-3
                  outline-none
                  transition
                  focus:border-orange-500
                  focus:ring-2
                  focus:ring-orange-100
                "
              />
            </div>

            {/* ==================================================
                MODAL ACTIONS
            =================================================== */}
            <div className="flex gap-3">
              {/* CANCEL */}
              <button
                type="button"
                disabled={submittingOffer}
                onClick={handleCloseOfferModal}
                className="
                  flex-1
                  rounded-xl
                  border
                  border-gray-300
                  py-3
                  font-semibold
                  text-gray-700
                  transition
                  hover:bg-gray-50
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

{/* ==================================================
    TRANSACTION DISCLAIMER
=================================================== */}
<div className="mb-6">
  <TransactionDisclaimer
    role="buyer"
    checked={offerDisclaimerAccepted}
    onChange={setOfferDisclaimerAccepted}
    disabled={submittingOffer}
  />
</div>
              {/* SUBMIT */}
              <button
                type="button"
                disabled={
  submittingOffer ||
  !offerDisclaimerAccepted
}
                onClick={handleSubmitOffer}
                className="
                  flex
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50
                  py-3
                  font-bold
                  text-white
                  transition
                  hover:bg-orange-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {submittingOffer && (
                  <Loader2 className="h-5 w-5 animate-spin" />
                )}

                {submittingOffer
                  ? "Submitting..."
                  : "Submit Offer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          REPORT LISTING MODAL
      ======================================================= */}

      {showReportModal && (
        <div
          className="
            fixed
            inset-0
            z-[70]
            flex
            items-center
            justify-center
            bg-black/50
            px-4
          "
          onClick={() => {
            if (!submittingReport) {
              setShowReportModal(false);
            }
          }}
        >
          <div
            className="
              w-full
              max-w-md
              rounded-2xl
              bg-white
              p-6
              shadow-2xl
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Flag className="h-5 w-5 text-red-600" />

                  <h2 className="text-xl font-bold text-gray-900">
                    Report Listing
                  </h2>
                </div>

                <p className="text-sm text-gray-500">
                  Help us keep FaultMart safe by telling us
                  what is wrong with this listing.
                </p>
              </div>

              <button
                type="button"
                disabled={submittingReport}
                onClick={() =>
                  setShowReportModal(false)
                }
                className="
                  rounded-full
                  p-2
                  text-gray-500
                  transition
                  hover:bg-gray-100
                  hover:text-gray-900
                  disabled:opacity-50
                "
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Reason */}
            <div className="mb-5">
              <label
                htmlFor="report-reason"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                Reason for Report
              </label>

              <select
                id="report-reason"
                value={reportReason}
                onChange={(event) =>
                  setReportReason(event.target.value)
                }
                disabled={submittingReport}
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-300
                  bg-white
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-red-500
                  focus:ring-2
                  focus:ring-red-100
                  disabled:bg-gray-50
                "
              >
                <option value="">
  Select a reason
</option>

<option value="SPAM">
  Spam or irrelevant listing
</option>

<option value="FRAUD">
  Fraudulent listing
</option>

<option value="FAKE_ITEM">
  Fake or counterfeit item
</option>

<option value="PROHIBITED_ITEM">
  Prohibited item
</option>

<option value="ABUSE">
  Abusive or inappropriate content
</option>

<option value="SCAM">
  Scam or suspicious activity
</option>

<option value="OTHER">
  Other
</option>
              </select>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label
                htmlFor="report-description"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                Additional Details
                <span className="ml-1 font-normal text-gray-400">
                  (optional)
                </span>
              </label>

              <textarea
                id="report-description"
                value={reportDescription}
                onChange={(event) =>
                  setReportDescription(
                    event.target.value
                  )
                }
                placeholder="Tell us more about the issue..."
                rows={4}
                maxLength={1000}
                disabled={submittingReport}
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-gray-300
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-red-500
                  focus:ring-2
                  focus:ring-red-100
                  disabled:bg-gray-50
                "
              />

              <p className="mt-1 text-right text-xs text-gray-400">
                {reportDescription.length}/1000
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                disabled={submittingReport}
                onClick={() =>
                  setShowReportModal(false)
                }
                className="
                  flex-1
                  rounded-xl
                  border
                  border-gray-300
                  py-3
                  font-semibold
                  text-gray-700
                  transition
                  hover:bg-gray-50
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  submittingReport ||
                  !reportReason
                }
                onClick={handleSubmitReport}
                className="
                  flex
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-red-600
                  py-3
                  font-bold
                  text-white
                  transition
                  hover:bg-red-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {submittingReport && (
                  <Loader2 className="h-5 w-5 animate-spin" />
                )}

                {submittingReport
                  ? "Submitting..."
                  : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}