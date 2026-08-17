import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  dark?: boolean;
}

export default function Logo({
  dark = false,
}: LogoProps) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2"
      aria-label="FaultMart"
    >
      <Image
        src="/images/branding/faultmart-logo.png"
        alt="FaultMart"
        width={46}
        height={46}
        className="h-11 w-11 object-contain"
        priority
      />

      <div className="text-2xl font-bold tracking-tight">
        <span className="text-red-600">
          Fault
        </span>

        <span
          className={
            dark
              ? "text-white"
              : "text-neutral-900"
          }
        >
          Mart
        </span>
      </div>
    </Link>
  );
}