"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const gallery =
    images.length > 0
      ? images
      : [{ url: "/placeholder-listing.jpg" }];

  const [activeIndex, setActiveIndex] = useState(0);

  const previous = () => {
    setActiveIndex((prev) =>
      prev === 0 ? gallery.length - 1 : prev - 1
    );
  };

  const next = () => {
    setActiveIndex((prev) =>
      prev === gallery.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/3]">
        <Image
          src={gallery[activeIndex].url}
          alt={title}
          fill
          priority
          className="object-cover"
        />

        {gallery.length > 1 && (
          <>
            <button
              onClick={previous}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {gallery.map((image, index) => (
            <button
              key={image.id ?? index}
              onClick={() => setActiveIndex(index)}
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
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}