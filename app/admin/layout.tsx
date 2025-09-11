"use client";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/organisms/AdminSidebar";
import Header from "@/components/organisms/AdminHeader";
import AdminAuthGuard from "@/components/molecules/AdminAuthGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Don't show sidebar/header on login page
  const isLoginPage = pathname === "/admin/login";

  return (
    <AdminAuthGuard>
      {isLoginPage ? (
        // Login page - no sidebar/header
        <div className="min-h-screen bg-gray-50">{children}</div>
      ) : (
        // Dashboard pages - with sidebar/header
        <div className="flex min-h-screen w-full">
          <Sidebar />
          <div className="w-full relative flex flex-col bg-[#F8F9FB]">
            <Header />
            <main className="flex-1 w-full pb-6 px-6">{children}</main>
          </div>
        </div>
      )}
    </AdminAuthGuard>
  );
}
