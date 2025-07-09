"use client";
import React, { ReactNode } from "react";

interface RoleGuardProps {
  children: ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ children }) => {
  return <>{children}</>;
};

export default RoleGuard;
