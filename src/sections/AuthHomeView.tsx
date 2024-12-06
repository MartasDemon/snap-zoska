"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Typography from "@mui/material/Typography";
import { Session } from "next-auth";

export default function AuthHomeView({ session }: { session: Session | null }) {
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/prispevok");
    }
  }, [session, router]);

  if (!session) {
    return <Typography>Loading...</Typography>;
  }

  return null; // Optionally show nothing if redirecting
}
