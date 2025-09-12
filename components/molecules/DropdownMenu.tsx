"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  User,
  Heart,
  Award,
  Settings,
  HelpCircle,
  UserCheck,
  LogOut,
  HistoryIcon,
  Bell,
} from "lucide-react";
import { useAuthRedirect } from "@/Hooks/useAuthRedirect";
import { useUserRole } from "@/Hooks/useUserRole";
import { TokenManager } from "@/utils/tokenManager";
import { useGetAllNotificationsQuery } from "@/Hooks/use-getAllNotifications.query";
import { useGetUserProfileQuery } from "@/Hooks/use-getuserProfile.query";

interface UserDropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchProfile: () => void;
  userData?: {
    userName?: string;
    userEmail?: string;
    favoriteCount?: number;
  };
}

const UserDropdownMenu: React.FC<UserDropdownMenuProps> = ({
  isOpen,
  onClose,
  onSwitchProfile,
  userData,
}) => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const { role } = useUserRole();
  const { isAuthenticated, checkAuthentication } = useAuthRedirect();
  
  // Get role from localStorage as fallback
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  
  // Get real data for notifications and user profile
  const { data: notificationsData } = useGetAllNotificationsQuery();
  const { data: userProfileData } = useGetUserProfileQuery();
  
  
  // Calculate real counts from user profile data
  const notificationCount = notificationsData?.length || 0;
  const favoriteCount = userProfileData?.currentUser?.favorites?.length || 0;
  const activityCount = userProfileData?.currentUser?.activityLog?.length || 0;
  const rewardsCount = userProfileData?.currentUser?.rewards || 0;

  // Prevent rendering if not authenticated
  useEffect(() => {
    if (isOpen && !isAuthenticated && !checkAuthentication()) {
      console.log("User not authenticated, redirecting to /signin");
      router.push("/signin");
      onClose();
    }
  }, [isOpen, isAuthenticated, checkAuthentication, router, onClose]);

  // Get current role from multiple sources
  useEffect(() => {
    const getUserRole = () => {
      // Try to get role from userProfileData first
      if (userProfileData?.currentUser?.role) {
        return userProfileData.currentUser.role;
      }
      
      // Fallback to useUserRole hook
      if (role) {
        return role;
      }
      
      // Fallback to localStorage
      if (typeof window !== "undefined") {
        return localStorage.getItem("userRole");
      }
      
      return null;
    };

    const userRole = getUserRole();
    setCurrentRole(userRole);
  }, [role, userProfileData]);

  // Listen for role changes to update menu items
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userRole") {
        // Force re-render by updating selectedItem and currentRole
        setSelectedItem(null);
        setCurrentRole(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const getProfileRoute = () => {
    const userRole = currentRole || role;
    switch (userRole?.toLowerCase()) {
      case "renter":
        return "/profile";
      case "homeowner":
        return "/homeowner-profile";
      case "agent":
        return "/agent-profile";
      default:
        return "/profile";
    }
  };

  // Get real user data from profile
  const currentUser = userProfileData?.currentUser;
  const userRole = currentRole || role;
  const userName = currentUser 
    ? `${currentUser.firstName} ${currentUser.lastName}`.trim()
    : userData?.userName || `${userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : "Renter"} User`;
  const userEmail = currentUser?.email || userData?.userEmail || `${userRole || "renter"}@example.com`;

  const menuItems = [
    {
      id: "profile",
      label: `${
        userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : "Renter"
      } Profile`,
      icon: User,
      route: getProfileRoute(),
      hasNotification: false,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      route: "/notifications",
      hasNotification: notificationCount > 0,
      notificationCount: notificationCount,
    },
    {
      id: "activity",
      label: "Activity",
      icon: HistoryIcon,
      route: "/activity",
      hasNotification: activityCount > 0,
      notificationCount: activityCount,
    },
    {
      id: "favorites",
      label: "Favorites",
      icon: Heart,
      route:
        userRole?.toLowerCase() === "homeowner"
          ? "/landlord/profile-favorite"
          : userRole?.toLowerCase() === "agent"
          ? "/agent/profile-favorite"
          : "/profile-favorite",
      hasNotification: favoriteCount > 0,
      notificationCount: favoriteCount,
    },
    {
      id: "rewards",
      label: "Rewards",
      icon: Award,
      route: "/rewards",
      hasNotification: rewardsCount > 0,
      notificationCount: rewardsCount,
    },
    {
      id: "settings",
      label: "Account settings",
      icon: Settings,
      route: "/settings",
      hasNotification: false,
    },
    {
      id: "help",
      label: "Help center",
      icon: HelpCircle,
      route: "/help-center",
      hasNotification: false,
    },
  ];

  const handleMenuItemClick = (item: (typeof menuItems)[0]) => {
    setSelectedItem(item.id);
    if (item.route) {
      router.push(item.route);
    }
    onClose();
  };

  const handleSwitchProfile = () => {
    onSwitchProfile();
    onClose();
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
      }
      
      await signOut({ redirect: false });
      console.log("Logged out, redirecting to /signin");
      
      // Force a complete page refresh to clear all state
      window.location.href = "/signin";
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback to manual redirect
      if (typeof window !== "undefined") {
        window.location.href = "/signin";
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !isAuthenticated) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50"
    >
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-gray-900 font-medium">{userName}</p>
        <p className="text-sm text-gray-500">{userEmail}</p>
      </div>

      <div className="py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedItem === item.id;
          return (
            <button
              key={`${item.id}-${userRole}`} // Force re-render when role changes
              onClick={() => handleMenuItemClick(item)}
              className={`w-full px-4 py-3 text-left transition-colors flex items-center justify-between group ${
                isSelected ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                  {item.label}
                </span>
              </div>
              {item.hasNotification &&
                item.notificationCount &&
                item.notificationCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                    {item.notificationCount}
                  </span>
                )}
            </button>
          );
        })}
      </div>

      <div className="border-t border-gray-100 my-2" />

      <button
        onClick={handleSwitchProfile}
        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 group"
      >
        <UserCheck className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
        <span className="text-gray-700 group-hover:text-gray-900 font-medium">
          Switch Profile
        </span>
      </button>

      <div className="border-t border-gray-100 my-2" />

      <button
        onClick={handleLogout}
        className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center space-x-3 group"
      >
        <LogOut className="w-5 h-5 text-[#C85212]" />
        <span className="text-[#C85212] font-medium">Log out</span>
      </button>
    </div>
  );
};

export default UserDropdownMenu;
