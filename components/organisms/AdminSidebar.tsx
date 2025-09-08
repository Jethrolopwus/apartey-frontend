"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  ChartPie,
  Landmark,
  Users,
  Bell,
  Star,
  BarChart2,
  Settings,
  LogOut,
  FileText,
} from "lucide-react";
import Image from "next/image";
import { TokenManager } from "@/utils/tokenManager";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation"; 

const navItems = [
  { label: "Overview", icon: ChartPie, href: "/admin/dashboard" },
  { label: "Properties", icon: Landmark, href: "/admin/property-management" },
  { label: "Blog", icon: FileText, href: "/admin/blog" },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Notifications", icon: Bell, href: "/admin/notifications" },
  { label: "Reviews", icon: Star, href: "/admin/reviews" },
  { label: "Analytics", icon: BarChart2, href: "/admin/analytics" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname(); // ✅ current route

  const handleLogout = async () => {
    try {
      TokenManager.clearAllTokens();
      if (typeof window !== "undefined") {
        localStorage.removeItem("hasCompletedOnboarding");
        localStorage.removeItem("authMode");
        localStorage.removeItem("redirectAfterLogin");
        localStorage.removeItem("pendingReviewData");
        localStorage.removeItem("email");
        localStorage.removeItem("userRole");
        localStorage.removeItem("isAdminLogin");
      }
      await signOut({ redirect: false });
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Admin logout error:", error);
      if (typeof window !== "undefined") {
        window.location.href = "/admin/login";
      }
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[240px] min-w-[240px] max-w-[240px] bg-white border-r border-gray-100 flex-col py-4 px-4 shadow-sm">
        <Link href={"/admin/dashboard"} className="flex items-center mb-6">
          <Image src="/aparteyLogo.png" alt="Apartey Logo" width={130} height={60} />
        </Link>
        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map(({ label, icon: Icon, href }) => {
            const active = pathname.startsWith(href); 
            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl font-medium text-base transition-colors
                  ${
                    active
                      ? "bg-[#C85212] text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <Icon className={`w-5 h-5 ${active ? "text-white" : "text-gray-500"}`} />
                {label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base mt-8 bg-red-50 text-red-600 hover:bg-red-100 transition-colors w-full"
        >
          <LogOut className="w-5 h-5 text-red-600" />
          Sign Out
        </button>
      </aside>

      {/* Mobile Drawer (similar update with pathname for active) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black bg-opacity-30" onClick={() => setMobileOpen(false)} />
          <aside className="fixed left-0 top-0 w-full h-screen bg-white flex flex-col shadow-lg animate-slide-in-left z-50 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Image src="/aparteyLogo.png" alt="Apartey Logo" width={100} height={50} className="h-10" />
              <button onClick={() => setMobileOpen(false)} className="text-gray-500 text-2xl font-bold hover:text-gray-700">×</button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-4">
              <div className="space-y-2">
                {navItems.map(({ label, icon: Icon, href }) => {
                  const active = pathname.startsWith(href);
                  return (
                    <Link
                      key={label}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-colors
                        ${
                          active
                            ? "bg-[#C85212] text-white shadow-sm"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      <Icon className={`w-5 h-5 ${active ? "text-white" : "text-gray-500"}`} />
                      {label}
                    </Link>
                  );
                })}
              </div>
            </nav>
            <div className="p-4 border-t border-gray-200 bg-white">
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm w-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-5 h-5 text-red-600" />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
