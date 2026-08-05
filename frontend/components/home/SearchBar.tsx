"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchBar() {
  return (
    <div className="mx-auto mt-10 flex w-full max-w-4xl flex-col gap-3 rounded-2xl border bg-white p-4 shadow-lg md:flex-row">
      <Input
        placeholder="Search vehicles, appliances, electronics..."
        className="h-12 border-0 shadow-none focus-visible:ring-0"
      />

      <Button
        size="lg"
        className="h-12 px-8"
      >
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
    </div>
  );
}