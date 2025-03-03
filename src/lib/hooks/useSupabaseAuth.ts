"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, isUsingMockSupabase } from "../supabase/client";
import { Session, User } from "@supabase/supabase-js";

export type AdminUser = {
  id: string;
  email: string;
  isAdmin: boolean;
};

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [adminData, setAdminData] = useState<AdminUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(Date.now());

  // Memoize fetchAdminStatus to avoid recreating it on each render
  const fetchAdminStatus = useCallback(
    async (userId: string) => {
      // Add a safety timeout to ensure loading state gets reset
      const safetyTimeoutId = setTimeout(() => {
        console.log("Safety timeout triggered in fetchAdminStatus");
        setLoading(false);
      }, 2000);

      try {
        if (isUsingMockSupabase) {
          // In mock mode, simulate admin check
          setAdminData({
            id: userId,
            email: user?.email || "admin@example.com",
            isAdmin: true,
          });
          setLoading(false);
          clearTimeout(safetyTimeoutId);
          return;
        }

        console.log("Checking admin status for user:", userId);

        // In a real app, you would fetch this from your Supabase database
        // Modified to use maybeSingle() and more explicit logging
        const { data, error } = await supabase
          .from("admins")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();

        if (error) {
          console.error("Error fetching admin status:", error);
          // Don't set adminData to null on error, it creates flickering
          // Just log the error
        } else if (data) {
          console.log("Found admin record:", data);
          setAdminData({
            id: userId,
            email: user?.email || "",
            isAdmin: true,
          });
        } else {
          console.log("No admin record found for user:", userId);
          setAdminData({
            id: userId,
            email: user?.email || "",
            isAdmin: false,
          });
        }
      } catch (error) {
        console.error("Exception in admin check:", error);
        // Don't update state on error to avoid UI flickering
      } finally {
        clearTimeout(safetyTimeoutId);
        setLoading(false);
      }
    },
    [user, supabase, isUsingMockSupabase]
  );

  // Add a function to manually refresh admin status
  const refreshAdminStatus = useCallback(async () => {
    if (!user) {
      console.log("No user found, skipping admin status refresh");
      return;
    }

    console.log("Manually refreshing admin status for user:", user.id);

    try {
      setLoading(true);
      await fetchAdminStatus(user.id);
    } catch (error) {
      console.error("Error refreshing admin status:", error);
    } finally {
      // Always ensure loading is set to false
      setLoading(false);
      setLastRefreshed(Date.now());
    }
  }, [user, fetchAdminStatus]);

  useEffect(() => {
    if (isUsingMockSupabase) {
      // In mock mode, we'll simulate the auth state after a short delay
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // Real Supabase auth flow
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          console.log("Initial session found, checking admin status");
          fetchAdminStatus(session.user.id);
        } else {
          console.log("No session found");
          setLoading(false);
        }
      });

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        console.log("Auth state changed:", _event);
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          console.log("User logged in, checking admin status");
          fetchAdminStatus(session.user.id);
        } else {
          console.log("User logged out");
          setAdminData(null);
          setLoading(false);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [fetchAdminStatus, lastRefreshed]);

  const signIn = async (email: string, password: string) => {
    try {
      if (isUsingMockSupabase) {
        // In mock mode, simulate successful login with admin@example.com
        if (email === "admin@example.com" && password === "password") {
          const mockUser = {
            id: "mock-user-id",
            email: "admin@example.com",
          } as User;

          setUser(mockUser);
          setAdminData({
            id: mockUser.id,
            email: mockUser.email || "admin@example.com",
            isAdmin: true,
          });

          return { success: true, data: { user: mockUser } };
        }
        return { success: false, error: "Invalid credentials" };
      }

      // Real Supabase auth
      console.log("Attempting to sign in with:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error.message);
        throw error;
      }

      console.log("Sign in successful for:", email);
      return { success: true, data };
    } catch (error: any) {
      console.error("Error signing in:", error);
      return {
        success: false,
        error:
          error.message || "Failed to sign in. Please check your credentials.",
      };
    }
  };

  const signOut = async () => {
    try {
      console.log("Starting signOut process...");

      // Force clear state first
      setUser(null);
      setSession(null);
      setAdminData(null);

      if (isUsingMockSupabase) {
        // In mock mode, just clear the state
        console.log("Mock mode: clearing auth state");
        return { success: true };
      }

      // Real Supabase auth
      console.log("Calling Supabase signOut API");
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Supabase signOut API error:", error);
        throw error;
      }

      // Force clear all auth state again
      console.log("Clearing all auth state");
      setUser(null);
      setSession(null);
      setAdminData(null);

      // Reset loading state after a short delay to ensure consistency
      setTimeout(() => {
        console.log("Resetting loading state after signout");
        setLoading(false);
      }, 100);

      // Force auth state refresh
      setLastRefreshed(Date.now());

      console.log("Signout complete");

      return { success: true };
    } catch (error) {
      console.error("Error signing out:", error);
      // Even on error, make sure state is cleared
      setUser(null);
      setSession(null);
      setAdminData(null);
      return { success: false, error };
    }
  };

  return {
    user,
    adminData,
    session,
    loading,
    signIn,
    signOut,
    isAdmin: adminData?.isAdmin || false,
    refreshAdminStatus,
  };
}
