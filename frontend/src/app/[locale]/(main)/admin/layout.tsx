"use client"
import HeaderAdmin from "@/app/[locale]/_Components/HeaderAdmin/HeaderAdmin";
import SidebarAdmin from "@/app/[locale]/_Components/AdminComponents/SidebarAdmin/SidebarAdmin";
import { useState } from "react";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background w-full">
      <HeaderAdmin
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex">
        <SidebarAdmin
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}