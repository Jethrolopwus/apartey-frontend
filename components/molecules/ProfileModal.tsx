"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { X, Home, Building, Users } from "lucide-react";
import { useUserRole } from "@/Hooks/useUserRole";
import { useAuthRedirect } from "@/Hooks/useAuthRedirect";
import { useAddRolesMutation } from "@/Hooks/use.addRoles.mutation";
import { toast } from "react-hot-toast";
import { TokenManager } from "@/utils/tokenManager";

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
  const router = useRouter();
  const { role, updateRole, isLoading: roleLoading } = useUserRole();
  const { isAuthenticated, handleAuthRedirect } = useAuthRedirect();
  const { mutate: addRole, isLoading: mutationLoading } = useAddRolesMutation();

  // Determine current profile based on userData or stored role
  const getCurrentProfile = (): "renter" | "homeowner" | "agent" => {
    if (userData?.currentUserRole?.role) {
      const userRole = userData.currentUserRole.role.toLowerCase();
      if (
        userRole.includes("agent") ||
        userRole.includes("homeowner") ||
        userRole.includes("renter")
      ) {
        return "homeowner";
      } else if (userRole.includes("homeowner") || userRole.includes("agent")) {
        return "agent";
      }
    }
    return role || "renter";
  };

  const currentProfile = getCurrentProfile();

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
      activeBgColor: "bg-[#C85212]",
      activeTextColor: "text-white",
    },
    {
      id: "homeowner" as const,
      title: "Landlord",
      description: "Manage your properties",
      icon: Building,
      route: "/landlord",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      iconColor: "text-blue-500",
      activeBgColor: "bg-[#C85212]",
      activeTextColor: "text-white",
    },
    {
      id: "agent" as const,
      title: "Agent",
      description: "Grow your business",
      icon: Users,
      route: "/agent",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      iconColor: "text-green-500",
      activeBgColor: "bg-[#C85212]",
      activeTextColor: "text-white",
    },
  ];

  const handleProfileSelect = async (profile: (typeof profiles)[0]) => {
    if (!isAuthenticated) {
      // Store the intended profile switch and redirect to signin
      handleAuthRedirect({
        stayDetails: {},
        costDetails: {},
        accessibility: {},
        ratingsAndReviews: {},
        submitAnonymously: false,
        location: {
          intendedProfile: profile.id,
          intendedProfileRoute: profile.route,
        },
      });
      return;
    }

    try {
      // Update role in backend
      await new Promise((resolve, reject) => {
        addRole(
          { role: profile.id },
          {
            onSuccess: () => {
              // Update local role
              updateRole(profile.id);
              TokenManager.setProfileRoute(profile.route);
              // Redirect to the appropriate role-based homepage
              router.push(profile.route);
              router.refresh();
              toast.success(`Switched to ${profile.title} profile`);
              onClose();
              resolve(null);
            },
            onError: (error: unknown) => {
              console.error("Error updating role:", error);
              toast.error("Failed to switch profile. Please try again.");
              reject(error);
            },
          }
        );
      });
    } catch (error) {
      console.error("Error switching profile:", error);
      router.push("/signin");
      onClose();
    }
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
                disabled={roleLoading || mutationLoading}
                className={`w-full p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? `${profile.activeBgColor} border-[#C85212]`
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                } ${
                  roleLoading || mutationLoading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected ? "bg-white shadow-sm" : profile.bgColor
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isSelected ? profile.activeTextColor : profile.iconColor
                      }`}
                    />
                  </div>
                  <div className="text-left">
                    <h3
                      className={`font-medium ${
                        isSelected ? profile.activeTextColor : profile.textColor
                      }`}
                    >
                      {profile.title}
                    </h3>
                    <p
                      className={`text-sm ${
                        isSelected ? profile.activeTextColor : profile.textColor
                      }`}
                    >
                      {profile.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 rounded-full bg-white" />
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
