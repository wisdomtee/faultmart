import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="text-2xl font-bold tracking-tight"
    >
      <span className="text-primary">Fault</span>
      <span>Mart</span>
    </Link>
  );
}