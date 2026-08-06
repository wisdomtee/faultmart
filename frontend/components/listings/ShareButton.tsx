"use client";

import { Share2 } from "lucide-react";

export default function ShareButton() {
  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      await navigator.share({
        title: document.title,
        url,
      });

      return;
    }

    await navigator.clipboard.writeText(url);

    alert("Link copied to clipboard.");
  }

  return (
    <button
      onClick={handleShare}
      className="flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 hover:bg-gray-50"
    >
      <Share2 className="h-5 w-5" />
      Share Listing
    </button>
  );
}