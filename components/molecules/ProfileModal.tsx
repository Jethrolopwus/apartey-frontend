
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Home, Building, Users } from "lucide-react";
import { useUserRole } from "@/Hooks/useUserRole";
import { useAuthRedirect } from "@/Hooks/useAuthRedirect";
import { useAddRolesMutation } from "@/Hooks/use.addRoles.mutation";
import { toast } from "react-hot-toast";

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
  const [currentProfile, setCurrentProfile] = useState<
    "renter" | "homeowner" | "agent"
  >("renter");

  // Determine current profile on client side
  useEffect(() => {
    const getCurrentProfile = (): "renter" | "homeowner" | "agent" => {
      // Check localStorage first (most up-to-date)
      const localStorageRole = typeof window !== "undefined" 
        ? localStorage.getItem("userRole")?.toLowerCase() 
        : null;
      
      // Then check userData and role state
      const userRole =
        userData?.currentUserRole?.role?.toLowerCase() ||
        role?.toLowerCase() ||
        localStorageRole;
      

      
      if (
        userRole === "homeowner" ||
        userRole === "agent" ||
        userRole === "renter"
      ) {
        return userRole as "renter" | "homeowner" | "agent";
      }
      return "renter";
    };

    setCurrentProfile(getCurrentProfile());
  }, [userData, role, isOpen]); // Add isOpen dependency to update when modal opens

  // Also listen for localStorage changes to update current profile
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userRole") {
        const newRole = e.newValue?.toLowerCase();
        if (newRole === "homeowner" || newRole === "agent" || newRole === "renter") {
          setCurrentProfile(newRole as "renter" | "homeowner" | "agent");
        }
      }
    };

    // Also handle custom storage events (for same-window updates)
    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail?.key === "userRole") {
        const newRole = e.detail?.newValue?.toLowerCase();
        if (newRole === "homeowner" || newRole === "agent" || newRole === "renter") {
          setCurrentProfile(newRole as "renter" | "homeowner" | "agent");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("localStorageChange", handleCustomStorageChange as EventListener);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localStorageChange", handleCustomStorageChange as EventListener);
    };
  }, []);

  const profiles = [
    {
      id: "renter" as const,
      title: "Renter",
      description: "Find your perfect rental",
      icon: Home,
      route: "/",
      profileRoute: "/profile",
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
      iconColor: "text-orange-500",
      activeBgColor: "bg-[#C85212]",
      activeTextColor: "text-white",
    },
    {
      id: "homeowner" as const,
      title: "Homeowner",
      description: "Manage your properties",
      icon: Building,
      route: "/landlord",
      profileRoute: "/profile",
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
      profileRoute: "/agent-profile",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      iconColor: "text-green-500",
      activeBgColor: "bg-[#C85212]",
      activeTextColor: "text-white",
    },
  ];

  const handleProfileSelect = async (profile: (typeof profiles)[0]) => {
    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to /signin");
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
      onClose();
      return;
    }

    try {
      await new Promise((resolve, reject) => {
        addRole(
          { role: profile.id },
          {
            onSuccess: () => {
              updateRole(profile.id);
              localStorage.setItem("userRole", profile.id);
              
              // Trigger storage event to notify other components
              window.dispatchEvent(new StorageEvent('storage', {
                key: 'userRole',
                newValue: profile.id,
                oldValue: role || 'renter'
              }));
              
              // Also trigger custom event for same-window updates
              window.dispatchEvent(new CustomEvent('localStorageChange', {
                detail: {
                  key: 'userRole',
                  newValue: profile.id,
                  oldValue: role || 'renter'
                }
              }));
              
              const hasCompletedOnboarding = localStorage.getItem(
                "hasCompletedOnboarding"
              );
              if (hasCompletedOnboarding !== "true") {
                localStorage.setItem("hasCompletedOnboarding", "true");
                console.log(
                  `First-time onboarding, redirecting to ${profile.profileRoute}`
                );
                router.push(profile.profileRoute);
              } else {
                console.log(
                  `Switching to ${profile.title} profile, redirecting to ${profile.route} (homepage)`
                );
                router.push(profile.route);
              }
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

  // Force refresh current profile when modal opens
  useEffect(() => {
    if (isOpen) {
      const localStorageRole = typeof window !== "undefined" 
        ? localStorage.getItem("userRole")?.toLowerCase() 
        : null;
      

      
      if (localStorageRole === "homeowner" || localStorageRole === "agent" || localStorageRole === "renter") {
        setCurrentProfile(localStorageRole as "renter" | "homeowner" | "agent");
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-75" onClick={onClose} />

      <div className="relative bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
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
                    ? "bg-[#C85212] border-[#C85212] text-white"
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
                        isSelected ? "text-[#C85212]" : profile.iconColor
                      }`}
                    />
                  </div>
                  <div className="text-left">
                    <h3
                      className={`font-medium ${
                        isSelected ? "text-white" : profile.textColor
                      }`}
                    >
                      {profile.title}
                    </h3>
                    <p
                      className={`text-sm ${
                        isSelected ? "text-white" : profile.textColor
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
