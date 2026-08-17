import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import type React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-100">

      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">

        <AdminHeader />

        <main className="flex-1 p-8">
          {children}
        </main>

      </div>

    </div>
  );
}