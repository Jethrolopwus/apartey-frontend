"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // Check if we're on the login page
      if (pathname === '/admin/login') {
        setIsLoading(false);
        return;
      }

      // Check for admin authentication
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      const isAdminLogin = localStorage.getItem('isAdminLogin') === 'true';
      const userRole = localStorage.getItem('userRole');

      if (!token || !isAdminLogin) {
        // Not authenticated, redirect to login
        router.push('/admin/login');
        setIsLoading(false);
        return;
      }

      // Check if user has admin role
      if (userRole && userRole.toLowerCase().includes('admin')) {
        setIsAuthenticated(true);
        setIsLoading(false);
      } else {
        // Not an admin, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('isAdminLogin');
        localStorage.removeItem('userRole');
        router.push('/admin/login');
        setIsLoading(false);
      }
    };

    // Small delay to ensure localStorage is available
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [pathname, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  // If on login page, don't show the guard
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // If not authenticated, don't render children
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated, render children
  return <>{children}</>;
} 