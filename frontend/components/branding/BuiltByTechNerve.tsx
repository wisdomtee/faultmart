import Image from "next/image";

interface BuiltByTechNerveProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function BuiltByTechNerve({
  width = 130,
  height = 38,
  className = "",
}: BuiltByTechNerveProps) {
  return (
    <div className="inline-flex items-center gap-3 rounded-xl bg-white px-4 py-2.5 shadow-sm">
      <span className="text-xs font-medium text-neutral-600">
        Built by
      </span>

      <Image
        src="/images/branding/technerve-logo.png"
        alt="TechNerve"
        width={width}
        height={height}
        className={`h-8 w-auto object-contain ${className}`}
      />
    </div>
  );
}