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

  // Determine profile route based on role
  const getProfileRoute = () => {
    switch (role?.toLowerCase()) {
      case "landlord":
        return "/profile";
      case "agent":
        return "/agent-profile";
      case "renter":
      default:
        return "/profile";
    }
  };

  // Dynamic user details based on role
  const userName =
    userData?.userName ||
    `${role ? role.charAt(0).toUpperCase() + role.slice(1) : "Renter"} User`;
  const userEmail = userData?.userEmail || `${role || "renter"}@example.com`;
  const favoriteCount = userData?.favoriteCount || 3;

  const menuItems = [
    {
      id: "profile",
      label: `${
        role ? role.charAt(0).toUpperCase() + role.slice(1) : "Renter"
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
      hasNotification: true,
      notificationCount: favoriteCount,
    },
    {
      id: "activity",
      label: "Activity",
      icon: HistoryIcon,
      route: "/activity",
      hasNotification: false,
    },
    {
      id: "favorites",
      label: "Favorites",
      icon: Heart,
      route:
        role?.toLowerCase() === "landlord"
          ? "/landlord/favorites"
          : role?.toLowerCase() === "agent"
          ? "/agent/favorites"
          : "/renter-profile/favorites",
      hasNotification: true,
      notificationCount: favoriteCount,
    },
    {
      id: "rewards",
      label: "Rewards",
      icon: Award,
      route: "/rewards",
      hasNotification: false,
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
  };

  const handleLogout = async () => {
    try {
      // Clear all tokens and role
      TokenManager.clearAllTokens();
      localStorage.removeItem("userRole");

      // Sign out from NextAuth
      await signOut({ redirect: false });

      // Redirect to signin page
      router.push("/signin");
      router.refresh();
      onClose();
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/signin");
      onClose();
    }
  };

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !checkAuthentication()) {
      router.push("/signin");
      onClose();
    }
  }, [isAuthenticated, checkAuthentication, router, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50"
    >
      {/* User Info */}
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-gray-900 font-medium">{userName}</p>
        <p className="text-sm text-gray-500">{userEmail}</p>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedItem === item.id;
          return (
            <button
              key={item.id}
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

      {/* Divider */}
      <div className="border-t border-gray-100 my-2" />

      {/* Switch Profile */}
      <button
        onClick={handleSwitchProfile}
        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 group"
      >
        <UserCheck className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
        <span className="text-gray-700 group-hover:text-gray-900 font-medium">
          Switch Profile
        </span>
      </button>

      {/* Divider */}
      <div className="border-t border-gray-100 my-2" />

      {/* Logout */}
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
