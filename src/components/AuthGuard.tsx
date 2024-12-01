"use client";

import { useSession } from "next-auth/react";
import { useEffect, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { status } = useSession(); // Removed unused session
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" && !isRedirecting) {
      setIsRedirecting(true); // Prevent multiple redirects
      router.push("/auth/prihlasenie"); // Redirect to login page
    }
  }, [status, isRedirecting, router]);

  // Show loading or fallback UI while checking authentication
  if (status === "loading" || isRedirecting) {
    return <div>Kontrola autentifikácie...</div>;
  }

  return <>{children}</>;
};
export default AuthGuard;
