"use client";

import { Bell } from "lucide-react";

import { useAuthStore } from "@/store/auth-store";

export default function AdminHeader() {
  const { user } = useAuthStore();

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">

      {/* Page Context */}
      <div>
        <p className="text-sm text-slate-500">
          FaultMart
        </p>

        <h1 className="text-xl font-bold text-slate-900">
          Administration
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">

        <button
          type="button"
          className="
            relative
            flex h-10 w-10
            items-center justify-center
            rounded-full
            border border-slate-200
            text-slate-600
            transition
            hover:bg-slate-50
          "
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />

          <span
            className="
              absolute
              right-2
              top-2
              h-2
              w-2
              rounded-full
              bg-red-500
            "
          />
        </button>

        {/* Admin */}
        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600">
            {user?.firstName?.charAt(0)?.toUpperCase() || "A"}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">
              {user?.firstName || "Administrator"}
            </p>

            <p className="text-xs text-slate-500">
              Administrator
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}