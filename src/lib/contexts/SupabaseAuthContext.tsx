"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { useSupabaseAuth, AdminUser } from "../hooks/useSupabaseAuth";
import { Session, User } from "@supabase/supabase-js";

interface SupabaseAuthContextType {
  user: User | null;
  adminData: AdminUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; data?: any; error?: any }>;
  signOut: () => Promise<{ success: boolean; error?: any }>;
  isAdmin: boolean;
  refreshAdminStatus: () => Promise<void>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType>({
  user: null,
  adminData: null,
  session: null,
  loading: true,
  signIn: async () => ({ success: false }),
  signOut: async () => ({ success: false }),
  isAdmin: false,
  refreshAdminStatus: async () => {},
});

export function SupabaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useSupabaseAuth();
  const router = useRouter();
  const isLoggingOut = useRef(false);

  // Enhanced version of refreshAdminStatus that prevents multiple calls
  const refreshAdminStatus = useCallback(async () => {
    if (!auth.user) return;
    await auth.refreshAdminStatus();
  }, [auth]);

  // Enhanced logout function to prevent browser freezing
  const handleSafeSignOut = useCallback(async () => {
    if (isLoggingOut.current) {
      console.log("Already logging out, ignoring duplicate request");
      return { success: true };
    }

    try {
      console.log("Starting safe logout process");
      isLoggingOut.current = true;

      // Perform the actual logout
      const result = await auth.signOut();
      console.log("Logout completed, result:", result);

      // Reset logout flag
      isLoggingOut.current = false;

      return result;
    } catch (error) {
      console.error("Safe logout error:", error);
      isLoggingOut.current = false;
      return { success: false, error };
    }
  }, [auth, router]);

  const contextValue = {
    ...auth,
    refreshAdminStatus,
    signOut: handleSafeSignOut, // Override with our enhanced version
  };

  return (
    <SupabaseAuthContext.Provider value={contextValue}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export const useSupabaseAuthContext = () => useContext(SupabaseAuthContext);
