import Link from "next/link";
import { Wrench } from "lucide-react";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2"
    >

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white shadow-lg">
        <Wrench className="h-5 w-5" />
      </div>


      <div className="text-2xl font-bold tracking-tight">
        <span className="text-orange-600">
          Fault
        </span>

        <span className="text-neutral-900">
          Mart
        </span>
      </div>

    </Link>
  );
}