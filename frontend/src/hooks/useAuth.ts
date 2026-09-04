"use client";

import { useSession, signIn, signOut } from "@/lib/auth-client";

export const useAuth = () => {
  const { data: sessionData, isPending, error, refetch } = useSession();

  const user = sessionData?.user || null;
  const session = sessionData?.session || null;

  return {
    user,
    session,
    status: isPending ? "loading" : session ? "authenticated" : "unauthenticated",
    isLoading: isPending,
    isAuthenticated: !!session,
    error,
    signIn,
    signOut,
    refetch,
  };
};
