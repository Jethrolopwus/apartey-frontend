"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  List,
  Users,
  Bell,
  Star,
  BarChart2,
  Settings,
  LogOut,
  BookOpen,
  Menu,
} from "lucide-react";
import Image from "next/image";
import { TokenManager } from "@/utils/tokenManager";
import { signOut } from "next-auth/react";

const navItems = [
  { label: "Overview", icon: Home, href: "/admin/dashboard", active: false },
  {
    label: "Properties",
    icon: List,
    href: "/admin/property-management",
    active: false,
  },
  { label: "Blog", icon: BookOpen, href: "/admin/blog", active: false },
  { label: "Users", icon: Users, href: "/admin/users", active: false },
  {
    label: "Notifications",
    icon: Bell,
    href: "/admin/notifications",
    active: false,
  },
  { label: "Reviews", icon: Star, href: "/admin/reviews", active: false },
  {
    label: "Analytics",
    icon: BarChart2,
    href: "/admin/analytics",
    active: false,
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/admin/settings",
    active: false,
  },
];

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [items, setItems] = useState(navItems);

  const handleItemClick = (label: string) => {
    setItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        active: item.label === label,
      }))
    );
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    try {
      // Clear all authentication data
      TokenManager.clearAllTokens();
      
      // Clear additional auth-related localStorage items
      if (typeof window !== "undefined") {
        localStorage.removeItem("hasCompletedOnboarding");
        localStorage.removeItem("authMode");
        localStorage.removeItem("redirectAfterLogin");
        localStorage.removeItem("pendingReviewData");
        localStorage.removeItem("email");
        localStorage.removeItem("userRole");
        // Clear admin-specific data
        localStorage.removeItem("isAdminLogin");
      }
      
      await signOut({ redirect: false });
      console.log("Admin logged out, redirecting to admin login");
      
      // Redirect to admin login page instead of regular signin
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Admin logout error:", error);
      // Fallback to manual redirect to admin login
      if (typeof window !== "undefined") {
        window.location.href = "/admin/login";
      }
    }
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-1 shadow-md fixed top-0 left-0 right-0 z-30 h-8 opacity-0 pointer-events-none">
        <Image
          src="/aparteyLogo.png"
          alt="Apartey Logo"
          width={100}
          height={50}
          className="h-6"
        />
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu className="w-5 h-5 text-[#C85212]" />
        </button>
      </div>

      {/* Sidebar for desktop */}
      <aside className="hidden lg:flex w-[240px] min-w-[240px] max-w-[240px] h-screen bg-white border-r border-gray-100 flex-col py-6 px-4 shadow-sm fixed top-0 left-0 z-20">
        <Link href={"/admin/dashboard"} className="flex items-center mb-8">
          <div className="flex items-center justify-center">
            <Image
              src="/aparteyLogo.png"
              alt="Apartey Logo"
              width={100}
              height={50}
              className="h-10"
            />
          </div>
        </Link>
        <nav className="flex-1 flex flex-col gap-2">
          {items.map(({ label, icon: Icon, href, active }) => (
            <Link
              key={label}
              href={href}
              onClick={() => handleItemClick(label)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors
                ${
                  active
                    ? "bg-[#C85212] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }
              `}
            >
              <Icon
                className={`w-5 h-5 ${
                  active ? "text-white" : "text-gray-500"
                }`}
              />
              {label}
            </Link>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm mt-8 bg-red-50 text-red-600 hover:bg-red-100 transition-colors w-full"
        >
          <LogOut className="w-5 h-5 text-red-600" />
          Sign Out
        </button>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <aside className="fixed left-0 top-0 w-full h-screen bg-white flex flex-col shadow-lg animate-slide-in-left z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Image
                src="/aparteyLogo.png"
                alt="Apartey Logo"
                width={100}
                height={50}
                className="h-10"
              />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="text-gray-500 text-2xl font-bold hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-4">
              <div className="space-y-2">
                {items.map(({ label, icon: Icon, href, active }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => handleItemClick(label)}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-colors
                      ${
                        active
                          ? "bg-[#C85212] text-white shadow-sm"
                          : "text-gray-600 hover:bg-gray-50"
                      }
                    `}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        active ? "text-white" : "text-gray-500"
                      }`}
                    />
                    {label}
                  </Link>
                ))}
              </div>
            </nav>
            
            {/* Sign Out Button - Fixed at bottom */}
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
      
      {/* Spacer for mobile top bar */}
      <div className="lg:hidden h-8" />
    </>
  );
}
