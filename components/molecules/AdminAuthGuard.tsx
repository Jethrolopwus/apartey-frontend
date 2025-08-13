"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { TokenManager } from "@/utils/tokenManager";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {

      
      // Check if user is authenticated
      const hasToken = TokenManager.hasToken();
      const isAdminLogin = localStorage.getItem("isAdminLogin") === "true";
      const userRole = localStorage.getItem("userRole");

      // For NextAuth session
      if (status === "authenticated" && session?.user) {
        const userWithRole = session.user as { role?: string };
        
        if (userWithRole.role === "admin" || userRole === "admin") {
          setIsAuthorized(true);
          setIsLoading(false);
          return;
        }
      }

      // For regular token-based auth
      if (hasToken && isAdminLogin && userRole === "admin") {
        setIsAuthorized(true);
        setIsLoading(false);
        return;
      }

      // If not authenticated or not admin, redirect to admin login
      if (status === "unauthenticated" || !hasToken || !isAdminLogin || userRole !== "admin") {
        
        // Clear any conflicting data
        if (typeof window !== "undefined") {
          localStorage.removeItem("redirectAfterLogin");
          localStorage.removeItem("authMode");
        }
        
        router.push("/admin/admin-login");
        return;
      }

      setIsLoading(false);
    };

    // Add a small delay to ensure all auth checks are complete
    const timer = setTimeout(() => {
      checkAuth();
    }, 100);

    return () => clearTimeout(timer);
  }, [session, status, router]);

  // Prevent any automatic redirects while we're checking
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Clear any stored redirect paths that might interfere
      localStorage.removeItem("redirectAfterLogin");
      
      // If we're on admin dashboard and authorized, don't let other redirects happen
      if (isAuthorized && window.location.pathname === "/admin/dashboard") {
        localStorage.setItem("isAdminLogin", "true");
        localStorage.setItem("userRole", "admin");
      }
    }
  }, [isAuthorized]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <div className="text-lg">Verifying admin access...</div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
};

export default AdminAuthGuard; 