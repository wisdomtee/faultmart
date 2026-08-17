import Image from "next/image";

interface FaultMartLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function FaultMartLogo({
  width = 44,
  height = 44,
  className = "",
}: FaultMartLogoProps) {
  return (
    <Image
      src="/images/branding/faultmart-logo.png"
      alt="Fault Mart"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}