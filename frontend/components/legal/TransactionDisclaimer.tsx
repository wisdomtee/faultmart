"use client";

import { AlertTriangle } from "lucide-react";

interface TransactionDisclaimerProps {
  role: "buyer" | "seller";
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const content = {
  buyer: {
    title: "Buyer Transaction Disclaimer",
    text: "FaultMart connects buyers and sellers but does not guarantee the condition, quality, repairability, or performance of items listed on the marketplace. Please review the listing carefully and communicate with the seller before proceeding.",
    acknowledgement:
      "I understand that I am responsible for evaluating the item before completing a transaction.",
  },

  seller: {
    title: "Seller Transaction Disclaimer",
    text: "FaultMart provides the marketplace for buyers and sellers to connect. Sellers are responsible for providing accurate information about an item's condition, faults, history, and other relevant details.",
    acknowledgement:
      "I confirm that the information I have provided about this item is accurate to the best of my knowledge.",
  },
};

export default function TransactionDisclaimer({
  role,
  checked,
  onChange,
  disabled = false,
}: TransactionDisclaimerProps) {
  const data = content[role];

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-amber-900">
            {data.title}
          </h3>

          <p className="mt-2 text-xs leading-5 text-amber-800">
            {data.text}
          </p>

          <label className="mt-4 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={checked}
              onChange={(event) =>
                onChange(event.target.checked)
              }
              disabled={disabled}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-amber-300 text-orange-600 focus:ring-orange-500 disabled:cursor-not-allowed"
            />

            <span className="text-xs font-medium leading-5 text-amber-900">
              {data.acknowledgement}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}