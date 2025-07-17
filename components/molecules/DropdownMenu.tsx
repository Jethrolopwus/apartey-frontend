"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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

interface UserDropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchProfile: () => void;
  userName?: string;
  userEmail?: string;
  favoriteCount?: number;
}

const UserDropdownMenu: React.FC<UserDropdownMenuProps> = ({
  isOpen,
  onClose,
  onSwitchProfile,
  favoriteCount = 3,
}) => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const menuItems = [
    {
      id: "profile",
      label: "My profile",
      icon: User,
      route: "/profile",
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
      route: "/profile-favorite",
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
    if (item.id === "profile") {
      router.push("/profile");
    } else if (item.route) {
      router.push(item.route);
    }
    onClose();
  };

  const handleSwitchProfile = () => {
    onSwitchProfile();
  };

  const handleLogout = () => {
    console.log("Logging out...");
    onClose();
  };

  // Close dropdown when clicking outside
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

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50"
    >
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
