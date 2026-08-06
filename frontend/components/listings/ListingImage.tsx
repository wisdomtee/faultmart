import Image from "next/image";

interface Props {
  src?: string;
  alt: string;
}

export default function ListingImage({
  src,
  alt,
}: Props) {
  return (
    <div
      className="
        relative
        aspect-[4/3]
        overflow-hidden
        bg-neutral-100
      "
    >

      <Image
        src={src || "/placeholder.png"}
        alt={alt}
        fill
        sizes="
          (max-width: 640px) 100vw,
          (max-width: 1024px) 50vw,
          25vw
        "
        quality={85}
        priority={false}
        className="
          object-cover
          transition-transform
          duration-500
          group-hover:scale-105
        "
      />


      {/* subtle image overlay */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-t
          from-black/10
          via-transparent
          opacity-0
          transition
          duration-300
          group-hover:opacity-100
        "
      />

    </div>
  );
}