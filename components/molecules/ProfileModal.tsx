"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { X, Home, Building, Users } from "lucide-react";

interface SwitchProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData?: {
    currentUserRole?: {
      role: string;
    };
  };
}

const SwitchProfileModal: React.FC<SwitchProfileModalProps> = ({
  isOpen,
  onClose,
  userData,
}) => {
  // Determine current profile based on user data
  const getCurrentProfile = (): "renter" | "landlord" | "developer" => {
    if (!userData?.currentUserRole?.role) return "renter";

    const userRole = userData.currentUserRole.role.toLowerCase();

    if (
      userRole.includes("landlord") ||
      userRole.includes("homeowner") ||
      userRole.includes("owner")
    ) {
      return "landlord";
    } else if (userRole.includes("developer") || userRole.includes("agent")) {
      return "developer";
    }

    return "renter";
  };

  const currentProfile = getCurrentProfile();
  const router = useRouter();

  const profiles = [
    {
      id: "renter" as const,
      title: "Renter",
      description: "Find your perfect rental",
      icon: Home,
      route: "/",
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
      iconColor: "text-orange-500",
    },
    {
      id: "landlord" as const,
      title: "Landlord",
      description: "Manage your properties",
      icon: Building,
      route: "/landlord",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      iconColor: "text-blue-500",
    },
    {
      id: "developer" as const,
      title: "Developer/Agent",
      description: "Grow your business",
      icon: Users,
      route: "/agent",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      iconColor: "text-green-500",
    },
  ];

  const handleProfileSelect = (profile: (typeof profiles)[0]) => {
    router.push(profile.route);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black opacity-75" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Switch Profile
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Profile Options */}
        <div className="space-y-3">
          {profiles.map((profile) => {
            const Icon = profile.icon;
            const isSelected = currentProfile === profile.id;

            return (
              <button
                key={profile.id}
                onClick={() => handleProfileSelect(profile)}
                className={`w-full p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? "bg-[#C85212] border-[#C85212]"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected ? "bg-white shadow-sm" : "bg-white"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isSelected ? "text-[#C85212]" : "text-gray-500"
                      }`}
                    />
                  </div>
                  <div className="text-left">
                    <h3
                      className={`font-medium ${
                        isSelected ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {profile.title}
                    </h3>
                    <p
                      className={`text-sm ${
                        isSelected ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {profile.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="ml-auto">
                      <div className="w-2 h-2  rounded-full bg-white" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SwitchProfileModal;
