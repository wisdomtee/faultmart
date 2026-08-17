"use client";

import { LayoutGrid, List } from "lucide-react";

interface Props {
  view: "grid" | "list";
  onChange: (view: "grid" | "list") => void;
}

export default function ViewToggle({
  view,
  onChange,
}: Props) {
  return (
    <div className="flex overflow-hidden rounded-xl border bg-white">

      <button
        onClick={() => onChange("grid")}
        className={`flex items-center gap-2 px-4 py-3 transition ${
          view === "grid"
            ? "bg-orange-600 text-white"
            : "hover:bg-gray-50"
        }`}
      >
        <LayoutGrid className="h-5 w-5" />
        Grid
      </button>

      <button
        onClick={() => onChange("list")}
        className={`flex items-center gap-2 px-4 py-3 transition ${
          view === "list"
            ? "bg-orange-600 text-white"
            : "hover:bg-gray-50"
        }`}
      >
        <List className="h-5 w-5" />
        List
      </button>

    </div>
  );
}