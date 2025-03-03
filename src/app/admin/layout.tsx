"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSupabaseAuthContext } from "@/lib/contexts/SupabaseAuthContext";
import { AdminNavbar } from "@/app/components/layout/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAdmin, refreshAdminStatus } =
    useSupabaseAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  // Define paths that don't require admin status but do require login
  const loginOnlyPaths = ["/admin/debug", "/admin/super-debug"];
  // Define public paths that don't require any authentication
  const publicPaths = ["/admin/login"];

  // Only refresh admin status when first accessing the admin area, not on every page change
  useEffect(() => {
    // Only refresh once when entering admin area, not on every internal admin navigation
    if (!loading && user && pathname === "/admin") {
      console.log("Refreshing admin status on main admin dashboard access");

      // Add a timeout to guarantee loading state is cleared after a maximum time
      const refreshTimeout = setTimeout(() => {
        console.log("Force-clearing loading state after timeout");
        // This will force the loading spinner to clear if refreshAdminStatus gets stuck
      }, 1500);

      refreshAdminStatus().finally(() => {
        clearTimeout(refreshTimeout);
      });
    }
  }, [user, loading, pathname, refreshAdminStatus]);

  // Add safety timeout to ensure loading state never gets stuck
  useEffect(() => {
    if (loading && pathname === "/admin") {
      const safetyTimeout = setTimeout(() => {
        console.log("Safety timeout triggered for admin dashboard");
        // Force a navigation to clear any stuck states
        router.refresh();
      }, 3000);

      return () => clearTimeout(safetyTimeout);
    }
  }, [loading, pathname, router]);

  useEffect(() => {
    // Avoid redirects during loading state
    if (loading) {
      console.log("Auth still loading, waiting...");
      return;
    }

    console.log("Auth state:", { user: !!user, isAdmin, path: pathname });

    // Skip protection for public pages
    if (publicPaths.includes(pathname)) {
      console.log("Public path, skipping auth check");
      return;
    }

    // For login-only paths, just need to be logged in
    if (loginOnlyPaths.includes(pathname)) {
      if (!user) {
        console.log("Login-only path but not logged in, redirecting to login");
        router.push("/admin/login", { scroll: false });
      }
      return;
    }

    // For all other admin paths, need full admin access
    if (!user) {
      console.log("Admin path but not logged in, redirecting to login");
      router.push("/admin/login", { scroll: false });
    } else if (user && !isAdmin) {
      console.log("Logged in but not admin, redirecting to home");
      router.push("/", { scroll: false });
    }
  }, [user, loading, isAdmin, router, pathname]);

  // If we're still loading the auth state AND it's not a public path, show a loading spinner
  if (loading && !publicPaths.includes(pathname)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        <p className="ml-4 text-gray-600">Loading authentication...</p>
      </div>
    );
  }

  // For public paths, render without Navbar
  if (publicPaths.includes(pathname)) {
    return <>{children}</>;
  }

  // For protected paths, render with navbar
  return (
    <>
      <AdminNavbar />
      <main className="container mx-auto p-4">{children}</main>
    </>
  );
}
