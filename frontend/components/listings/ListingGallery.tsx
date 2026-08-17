"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";

interface GalleryImage {
  id?: string;
  url: string;
}

interface ListingGalleryProps {
  images: GalleryImage[];
  title: string;
}

export default function ListingGallery({
  images,
  title,
}: ListingGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const hasImages = images && images.length > 0;

  const previous = () => {
    setActiveIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const next = () => {
    setActiveIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  // No images available
  if (!hasImages) {
    return (
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
        <div className="flex flex-col items-center justify-center text-gray-400">
          <ImageIcon className="mb-3 h-16 w-16" />
          <p className="text-sm font-medium">
            No images available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
        <Image
          src={images[activeIndex].url}
          alt={`${title} - image ${activeIndex + 1}`}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={previous}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              type="button"
              key={image.id ?? index}
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                activeIndex === index
                  ? "border-blue-600"
                  : "border-transparent"
              }`}
            >
              <Image
                src={image.url}
                alt={`${title} ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}