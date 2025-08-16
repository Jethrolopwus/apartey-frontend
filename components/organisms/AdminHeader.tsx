"use client";
import { Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface AdminUser {
  name: string;
  email: string;
  profilePicture?: string;
  role: string;
}

export default function Header() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAdminUser = () => {
      try {
        // Get user data from localStorage
        const email = localStorage.getItem('email');
        const userRole = localStorage.getItem('userRole');
        
        // For now, we'll use the email as name if no name is stored
        // In a real app, you might want to fetch user details from an API
        const name = localStorage.getItem('adminName') || email?.split('@')[0] || 'Admin';
        const profilePicture = localStorage.getItem('adminProfilePicture');
        
        setAdminUser({
          name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
          email: email || '',
          profilePicture: profilePicture || undefined,
          role: userRole || 'Admin'
        });
      } catch (error) {
        console.error('Error loading admin user data:', error);
        // Fallback to default values
        setAdminUser({
          name: 'Admin',
          email: '',
          role: 'Admin'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminUser();
  }, []);

  // Listen for profile updates (when profile picture is updated)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminProfilePicture' || e.key === 'adminName') {
        loadAdminUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadAdminUser = () => {
    try {
      const email = localStorage.getItem('email');
      const userRole = localStorage.getItem('userRole');
      const name = localStorage.getItem('adminName') || email?.split('@')[0] || 'Admin';
      const profilePicture = localStorage.getItem('adminProfilePicture');
      
      setAdminUser({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: email || '',
        profilePicture: profilePicture || undefined,
        role: userRole || 'Admin'
      });
    } catch (error) {
      console.error('Error loading admin user data:', error);
      setAdminUser({
        name: 'Admin',
        email: '',
        role: 'Admin'
      });
    }
  };

  return (
    <header className="flex items-center h-8 justify-between bg-white px-8 py-4 min-h-[60px] lg:shadow-md w-full max-w-full lg:border-b lg:border-gray-100 fixed top-0 right-0 lg:left-[280px] z-10 lg:w-[calc(100%-280px)]">
      <h1 className="text-2xl font-bold">DashBoard</h1>
      <div className="relative w-[320px]">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </span>
        <input
          type="text"
          placeholder="Search here..."
          className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none shadow-sm placeholder-gray-400 text-base font-medium bg-[#F8F9FB]"
        />
      </div>
      <div className="flex items-center gap-8">
        <span className="text-sm text-gray-500 font-medium">Eng (US)</span>
        <div className="flex items-center gap-3 bg-[#F8F9FB] px-3 py-1.5 rounded-xl">
          {isLoading ? (
            <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse"></div>
          ) : adminUser?.profilePicture ? (
            <Image
              src={adminUser.profilePicture}
              alt={adminUser.name}
              width={36}
              height={36}
              className="w-9 h-9 rounded-full border-2 border-white shadow object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full border-2 border-white shadow bg-[#C85212] flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {adminUser?.name?.charAt(0) || 'A'}
              </span>
            </div>
          )}
          <div className="flex flex-col items-start">
            <span className="font-semibold text-gray-900 text-base leading-tight">
              {isLoading ? 'Loading...' : adminUser?.name || 'Admin'}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              {adminUser?.role || 'Admin'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
