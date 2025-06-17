"use client";
import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetUserRoleQuery } from "@/Hooks/use-getUserRole.query";
import { toast } from "react-hot-toast";

interface RoleGuardProps {
  allowedRoles: string[];
  children: ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const router = useRouter();
  const { data, isLoading } = useGetUserRoleQuery();
  const userRole = data?.currentUserRole?.role;

  // === Uncomment when you need to protect other profiles dashboard
  /*
   useEffect(() => {
    if (!isLoading && !userRole) {
      toast.error("Unauthorized: Please sign in with the correct role.");
      router.push("/signin");
    }
  }, [isLoading, userRole, allowedRoles, router]);

  if (isLoading || !userRole) {
    return <div className="text-center py-10">Checking access...</div>;
  }

  if (!allowedRoles.includes(userRole)) {
    // toast.error("Your current role Does not allow this profile")
    return (
      <div className="text-orange-600 text-3xl flex justify-center items-center mt-8">
        Your current role does not allow this profile.
      </div>
    );
  }*/

  return <>{children}</>;
};

export default RoleGuard;
