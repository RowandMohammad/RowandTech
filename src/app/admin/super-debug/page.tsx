"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSupabaseAuthContext } from "@/lib/contexts/SupabaseAuthContext";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SuperDebugPage() {
  const { user } = useSupabaseAuthContext();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [adminStatus, setAdminStatus] = useState<
    "idle" | "checking" | "admin" | "not-admin" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const router = useRouter();

  // Use refs to prevent excessive re-renders
  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const adminDataRef = useRef<any>(null);

  // Safe cleanup function to prevent memory leaks
  const cleanup = useCallback(() => {
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
      checkTimeoutRef.current = null;
    }
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Memoize the checkAdminStatus function with stronger rate limiting
  const checkAdminStatus = useCallback(
    async (force = false) => {
      if (!user) return;

      // Rate limiting - no more than once every 10 seconds unless forced
      if (
        !force &&
        lastChecked &&
        new Date().getTime() - lastChecked.getTime() < 10000
      ) {
        console.log("Rate limited admin status check");
        return;
      }

      // Clean up any existing timeout
      cleanup();

      setIsChecking(true);
      setAdminStatus("checking");
      setLastChecked(new Date());

      try {
        // Use simpler query with strong error handling
        const { data, error } = await supabase
          .from("admins")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        // Store in ref to prevent re-renders
        adminDataRef.current = data;

        if (error) {
          console.error("Error checking admin status:", error);
          setAdminStatus("error");
          setIsAdmin(false);
          setErrorMessage(`Database error: ${error.message}`);
        } else if (data) {
          // User found in admins table
          console.log("Admin status: Is admin", data);
          setAdminStatus("admin");
          setIsAdmin(true);
          setErrorMessage(null);
        } else {
          // User not found in admins table
          console.log("Admin status: Not admin");
          setAdminStatus("not-admin");
          setIsAdmin(false);
          setErrorMessage(null);
        }
      } catch (error) {
        console.error("Exception checking admin status:", error);
        setAdminStatus("error");
        setIsAdmin(false);
        setErrorMessage(error instanceof Error ? error.message : String(error));
      } finally {
        setIsChecking(false);
      }
    },
    [user, lastChecked, cleanup]
  );

  // Make yourself an admin with proper error handling
  const makeAdmin = async () => {
    if (!user) return;

    setIsChecking(true);
    setErrorMessage(null);

    try {
      // Direct insert approach with stronger error handling
      const { error } = await supabase
        .from("admins")
        .upsert(
          { user_id: user.id, email: user.email },
          { onConflict: "user_id", ignoreDuplicates: true }
        )
        .select();

      if (error) {
        console.error("Error making admin:", error);
        setErrorMessage(`Failed to make admin: ${error.message}`);
      } else {
        setErrorMessage("Successfully added as admin! Rechecking status...");
        // After adding, check status again after a delay
        // Store timeout reference for cleanup
        checkTimeoutRef.current = setTimeout(() => {
          checkAdminStatus(true);
        }, 3000);
      }
    } catch (error) {
      console.error("Exception making admin:", error);
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsChecking(false);
    }
  };

  // Safe logout function that prevents crashes
  const handleLogout = async () => {
    try {
      // First clean up any async operations
      cleanup();

      // Reset all state to prevent memory leaks
      setIsAdmin(null);
      setAdminStatus("idle");
      setErrorMessage(null);
      setIsChecking(false);
      setLastChecked(null);
      adminDataRef.current = null;

      // Only then sign out
      await supabase.auth.signOut();

      // Use router to redirect after cleanup
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout error:", err);
      alert("Error during logout. Please refresh the page.");
    }
  };

  // Only check admin status once on mount, not on every render
  useEffect(() => {
    if (user && adminStatus === "idle") {
      // Initial check with a small delay to allow page to render first
      const timer = setTimeout(() => {
        checkAdminStatus();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [user, adminStatus, checkAdminStatus]);

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Super Debug Page</h2>
          <p className="text-gray-600">Please log in to access this page</p>
          <Link
            href="/admin/login"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Super Debug Page</h2>
          <Link href="/admin" className="text-blue-600 hover:text-blue-800">
            ← Back to Admin
          </Link>
        </div>
        <p className="text-gray-600 mb-4">Admin Status Checker</p>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium">User Info</h3>
            <p>
              <strong>ID:</strong> {user.id}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Last Checked:</strong>{" "}
              {lastChecked ? lastChecked.toLocaleTimeString() : "Never"}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium">Admin Status</h3>
            <p>
              <strong>Status:</strong>{" "}
              {adminStatus === "idle"
                ? "Not checked yet"
                : adminStatus === "checking"
                ? "Checking..."
                : adminStatus === "admin"
                ? "You are an admin ✅"
                : adminStatus === "not-admin"
                ? "You are not an admin ❌"
                : "Error checking admin status ⚠️"}
            </p>
            {errorMessage && (
              <div className="mt-2 p-2 bg-red-100 text-red-800 rounded">
                <p>
                  <strong>Error:</strong> {errorMessage}
                </p>
                <p className="text-sm mt-1">
                  If you see "Failed to fetch" errors, this could indicate a
                  network issue or a problem with your Supabase connection.
                </p>
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => checkAdminStatus(true)}
              disabled={isChecking}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {isChecking ? "Checking..." : "Check Admin Status"}
            </button>

            {adminStatus === "not-admin" && (
              <button
                onClick={makeAdmin}
                disabled={isChecking}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Make Me Admin
              </button>
            )}
          </div>

          <div className="mt-8 border-t pt-4">
            <h3 className="text-lg font-medium">Manual SQL Fix</h3>
            <p>
              If you&apos;re still having issues, run this SQL query in your
              Supabase SQL Editor:
            </p>
            <pre className="p-3 bg-gray-800 text-gray-100 rounded overflow-x-auto text-sm mt-2">
              {`-- Complete policy reset and admin fix
BEGIN;
-- Disable RLS
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;

-- Delete all existing policies
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'admins'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON admins', policy_record.policyname);
    END LOOP;
    
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'posts'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON posts', policy_record.policyname);
    END LOOP;
END $$;

-- Add yourself as admin
INSERT INTO admins (user_id, email)
VALUES ('${user.id}', '${user.email}')
ON CONFLICT (user_id) DO NOTHING;

-- Create simple policies
CREATE POLICY "admins_view_policy" ON admins
  FOR SELECT USING (auth.role() = 'authenticated');
  
CREATE POLICY "posts_view_policy" ON posts
  FOR SELECT USING (auth.role() = 'authenticated');

-- Re-enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
COMMIT;`}
            </pre>

            <div className="mt-6">
              <h3 className="text-lg font-medium">Safe Logout</h3>
              <p className="text-sm text-gray-600 mb-2">
                If you&apos;re experiencing crashes on logout, use this button
                instead:
              </p>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Safe Logout
              </button>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <h4 className="font-medium text-yellow-800">
                Troubleshooting Tips
              </h4>
              <ul className="mt-2 list-disc pl-5 text-sm space-y-1 text-yellow-800">
                <li>
                  If Chrome crashes on logout, use the Safe Logout button above
                </li>
                <li>
                  If the page glitches, try running the SQL script above to
                  reset all policies
                </li>
                <li>Clear your browser cache and cookies if issues persist</li>
                <li>Try using a different browser if Chrome is unstable</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
