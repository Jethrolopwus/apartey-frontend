"use client";

import { useEffect, useState, PropsWithChildren } from "react";
import { useRouter } from "next/navigation";
import { useAuthStatusQuery } from "@/Hooks/use-getAuthStatus.query";

const AuthGuard = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const { data, isLoading, isError } = useAuthStatusQuery();
  const [checking, setChecking] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (isError || !data?.isVerified) {
      setIsVerified(false);
      router.push("/signin");
    } else {
      setIsVerified(true);
    }
    setChecking(false);
  }, [isLoading, isError, data, router]);

  if (checking || isLoading) return null; // Or a loading spinner
  if (!isVerified) return null;

  return <>{children}</>;
};

export default AuthGuard;