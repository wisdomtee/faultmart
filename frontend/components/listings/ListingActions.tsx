"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  BadgeDollarSign,
  Loader2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import ShareButton from "./ShareButton";
import { createConversation, createOffer } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

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

  const [showOfferModal, setShowOfferModal] = useState(false);

  const [offerAmount, setOfferAmount] = useState("");

  const [offerMessage, setOfferMessage] = useState("");

  const [submittingOffer, setSubmittingOffer] = useState(false);

  /*
   * WhatsApp URL
   */
  const whatsapp = phone
    ? `https://wa.me/${phone.replace(/\D/g, "")}`
    : "#";

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

      /*
       * Close modal
       */
      setShowOfferModal(false);
    } catch (error: any) {
      console.error(
        "FAILED TO SUBMIT OFFER:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Unable to submit offer.";

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

      const conversation =
        await createConversation(
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
    } catch (error: any) {
      console.error(
        "FAILED TO CREATE CONVERSATION:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Unable to start conversation.";

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
  }

  return (
    <>
      {/* ======================================================
          ACTION BUTTONS
      ======================================================= */}

      <div className="relative z-50 space-y-4">
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
                  Enter the amount you'd like to offer.
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

              {/* SUBMIT */}
              <button
                type="button"
                disabled={submittingOffer}
                onClick={handleSubmitOffer}
                className="
                  flex
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-orange-600
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
    </>
  );
}