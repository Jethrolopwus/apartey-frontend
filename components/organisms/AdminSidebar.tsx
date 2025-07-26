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

const navItems = [
  { label: "Overview", icon: Home, href: "/admin/dashboard", active: false },
  {
    label: "Properties",
    icon: List,
    href: "/admin/property-management",
    active: false,
  },
  { label: "Blog", icon: BookOpen, href: "/admin/admin-blog", active: false },
  { label: "Users", icon: Users, href: "/admin/users", active: false },
  {
    label: "Notifications",
    icon: Bell,
    href: "/admin/admin-notifications",
    active: false,
  },
  { label: "Reviews", icon: Star, href: "/admin/admin-reviews", active: false },
  {
    label: "Analytics",
    icon: BarChart2,
    href: "/admin/admin-analytics",
    active: false,
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/admin/admin-settings",
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

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 shadow-md fixed top-0 left-0 right-0 z-30">
        <Image
          src="/aparteyLogo.png"
          alt="Apartey Logo"
          width={100}
          height={50}
          className="h-8"
        />
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu className="w-7 h-7 text-[#C85212]" />
        </button>
      </div>

      {/* Sidebar for desktop */}
      <aside className="hidden lg:flex w-[280px] min-w-[280px] max-w-[280px] lg:min-h-screen bg-white border-r border-gray-200 flex-col py-12 px-7 shadow-xl mt-2 ">
        <Link href={"/admin/dashboard"} className="flex items-center mb-10">
          <div className="mb-14 flex items-center justify-center">
            <Image
              src="/aparteyLogo.png"
              alt="Apartey Logo"
              width={100}
              height={50}
              className="h-12"
            />
          </div>
        </Link>
        <nav className="flex-1 flex flex-col gap-2">
          {items.map(({ label, icon: Icon, href, active }) => (
            <Link
              key={label}
              href={href}
              onClick={() => handleItemClick(label)}
              className={`flex items-center gap-5 px-7 py-4 rounded-2xl font-bold text-[18px] transition-colors mb-2 tracking-tight
                ${
                  active
                    ? "bg-[#C85212] text-white"
                    : "text-gray-700 hover:bg-orange-50"
                }
              `}
              style={active ? { boxShadow: "0px 8px 24px 0px #C8521233" } : {}}
            >
              <Icon
                className={`w-7 h-7 ${
                  active ? "text-white" : "text-[#737791]"
                }`}
              />
              {label}
            </Link>
          ))}
        </nav>
        <button
          className="flex items-center gap-5 px-7 py-4 rounded-2xl font-bold text-[18px] mt-auto mb-2 bg-[#F64E60] text-white hover:bg-[#e03d4e] transition-colors shadow-xl w-full"
          style={{ boxShadow: "0px 8px 24px 0px #F64E60" }}
        >
          <LogOut className="w-7 h-7 text-white" />
          Sign Out
        </button>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <aside className="relative w-72 max-w-full h-full bg-white border-r border-gray-200 flex flex-col py-10 px-6 shadow-lg animate-slide-in-left z-50">
            <div className="mb-12 flex items-center justify-between">
              <Image
                src="/aparteyLogo.png"
                alt="Apartey Logo"
                className="h-10"
              />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="text-gray-500 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <nav className="flex-1 flex flex-col gap-2">
              {items.map(({ label, icon: Icon, href, active }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => handleItemClick(label)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-xl font-semibold text-lg transition-colors mb-1
                    ${
                      active
                        ? "bg-[#C85212] text-white shadow-lg"
                        : "text-gray-700 hover:bg-orange-50"
                    }
                  `}
                  style={
                    active ? { boxShadow: "0px 8px 24px 0px #C8521233" } : {}
                  }
                >
                  <Icon
                    className={`w-6 h-6 ${
                      active ? "text-white" : "text-[#737791]"
                    }`}
                  />
                  {label}
                </Link>
              ))}
            </nav>
            <button
              className="flex items-center gap-4 px-6 py-4 rounded-xl font-semibold text-lg mt-auto bg-[#F64E60] text-white hover:bg-[#e03d4e] transition-colors shadow-lg"
              style={{ boxShadow: "0px 8px 24px 0px #F64E60" }}
            >
              <LogOut className="w-6 h-6 text-white" />
              Sign Out
            </button>
          </aside>
        </div>
      )}
      {/* Spacer for mobile top bar */}
      <div className="lg:hidden h-14" />
    </>
  );
}
