"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSupabaseAuthContext } from "@/lib/contexts/SupabaseAuthContext";
import { Home, ArrowLeft, ShieldAlert } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    signIn,
    isAdmin,
    user,
    loading: authLoading,
  } = useSupabaseAuthContext();

  // Use useEffect for redirects instead of conditional returns
  useEffect(() => {
    // Only redirect if we're sure they're an admin and not still loading
    if (isAdmin && !authLoading && user) {
      console.log("Already logged in as admin, redirecting to dashboard");
      router.push("/admin", { scroll: false });
    } else {
      console.log("Login page - auth state:", {
        isAdmin,
        authLoading,
        hasUser: !!user,
      });
    }
  }, [isAdmin, authLoading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Attempting to sign in:", email);
      const result = await signIn(email, password);

      if (result.success) {
        console.log("Login successful, redirecting to admin");
        router.push("/admin", { scroll: false });
      } else {
        console.error("Login failed:", result.error);
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-md">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back to Website</span>
          </Link>
          <Link
            href="/admin/super-debug"
            className="flex items-center text-purple-600 hover:text-purple-800"
          >
            <ShieldAlert className="h-4 w-4 mr-1" />
            <span>Admin Tools</span>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
          <p className="mt-2 text-gray-600">
            Sign in to manage your blog content
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  href="/auth/reset-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Having admin access issues? Try the{" "}
            <Link
              href="/admin/super-debug"
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              Super Debug page
            </Link>{" "}
            to diagnose and fix problems.
          </p>
        </div>
      </div>
    </div>
  );
}
