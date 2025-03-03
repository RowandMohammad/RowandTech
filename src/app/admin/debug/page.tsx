"use client";

import { useState, useEffect } from "react";
import { useSupabaseAuthContext } from "@/lib/contexts/SupabaseAuthContext";
import Link from "next/link";

export default function DebugPage() {
  const { user, adminData, isAdmin, loading } = useSupabaseAuthContext();
  const [authDetails, setAuthDetails] = useState<string>("");

  useEffect(() => {
    if (user) {
      setAuthDetails(JSON.stringify({ user, adminData, isAdmin }, null, 2));
    }
  }, [user, adminData, isAdmin]);

  if (loading) {
    return <div>Loading auth state...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Debug Page</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
        <div className="p-4 bg-gray-100 rounded">
          <p className="mb-2">
            <strong>Logged in:</strong> {user ? "Yes" : "No"}
          </p>
          {user && (
            <>
              <p className="mb-2">
                <strong>User ID:</strong> {user.id}
              </p>
              <p className="mb-2">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="mb-2">
                <strong>Is Admin:</strong> {isAdmin ? "Yes" : "No"}
              </p>
              {!isAdmin && (
                <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
                  <p className="text-yellow-800 font-medium">
                    You are logged in but don&apos;t have admin privileges
                  </p>
                  <p className="text-yellow-800 mt-2">
                    Try the Super Debug page which has more tools to help:
                  </p>
                  <p className="mt-2">
                    <Link
                      href="/admin/super-debug"
                      className="text-blue-500 hover:underline"
                    >
                      Go to Super Debug →
                    </Link>
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {user && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Auth Details (Raw)</h2>
          <pre className="p-4 bg-gray-100 rounded overflow-auto max-h-80 text-sm">
            {authDetails}
          </pre>
        </div>
      )}

      {!user && (
        <div className="p-4 bg-blue-100 border border-blue-400 rounded">
          <p className="text-blue-800">
            You are not logged in.{" "}
            <Link href="/admin/login" className="text-blue-700 underline">
              Go to Login
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
