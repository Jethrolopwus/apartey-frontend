"use client";
import { useState, useEffect } from "react";
import { useAddRolesMutation } from "@/Hooks/use.addRoles.mutation";
import { TokenManager } from "@/utils/tokenManager";

// Define UserRole type to match backend enum
export type UserRole = "renter" | "homeowner" | "agent";

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const {
    mutate: updateRoleMutation,
    isLoading,
    error,
  } = useAddRolesMutation();

  // Validate backend role to ensure it matches UserRole
  const validateRole = (backendRole: string): UserRole => {
    const validRoles: UserRole[] = ["renter", "homeowner", "agent"];
    return validRoles.includes(backendRole as UserRole)
      ? (backendRole as UserRole)
      : "renter"; // Default to Renter if invalid
  };

  useEffect(() => {
    // Initialize role from localStorage or default to "Renter"
    const storedRole = localStorage.getItem("userRole");
    setRole(storedRole ? validateRole(storedRole) : "renter");

    // Listen for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userRole") {
        const newRole = e.newValue ? validateRole(e.newValue) : "renter";
        setRole(newRole);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const updateRole = (newRole: UserRole) => {
    // Optimistically update local state
    setRole(newRole);
    localStorage.setItem("userRole", newRole);

    // Check if authenticated
    if (!TokenManager.hasToken()) {
      console.warn("No token found, role update not sent to backend");
      return;
    }

    // Update role in backend
    updateRoleMutation(
      { role: newRole },
      {
        onSuccess: (response) => {
          console.log("Role updated in backend:", response);
          // Ensure local storage is in sync with backend response
          const backendRole = response?.role
            ? validateRole(response.role)
            : newRole;
          setRole(backendRole);
          localStorage.setItem("userRole", backendRole);
        },
        onError: (error: any) => {
          console.error("Failed to update role in backend:", error);
          // Revert to previous role or handle error
          if (error.message?.includes("401")) {
            TokenManager.clearAllTokens();
            localStorage.removeItem("userRole");
            setRole(null);
            window.location.href = "/signin";
          }
        },
      }
    );
  };

  return { role, updateRole, isLoading, error };
};
