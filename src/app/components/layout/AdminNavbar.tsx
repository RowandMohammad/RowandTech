import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSupabaseAuthContext } from "@/lib/contexts/SupabaseAuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminNavbar() {
  const { user, signOut, loading } = useSupabaseAuthContext();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  // Skip rendering if loading or no user
  if (loading || !user) {
    return null;
  }

  // Handle safe logout to prevent UI freezing
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (isLoggingOut) return; // Prevent multiple clicks

    try {
      setIsLoggingOut(true);

      // Let the user know we're logging out
      console.log("Starting logout process");

      // Perform the logout operation
      await signOut();

      // Force a full page reload to ensure auth state is completely reset
      console.log("Logout complete, refreshing page");
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
      setIsLoggingOut(false);
    }
  };

  // Helper function to determine if a path is active (exact match or subpath)
  const isActive = (path: string) => {
    if (path === "/admin" && pathname === "/admin") {
      return true;
    }
    return pathname !== "/admin" && pathname.startsWith(path);
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto flex flex-wrap items-center justify-between p-4">
        <div className="flex items-center">
          <Link href="/admin" className="text-white text-lg font-bold">
            Blog Admin
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* Left links */}
          <div className="hidden md:flex space-x-2">
            <Link
              href="/admin"
              className={`px-3 py-2 rounded ${
                pathname === "/admin" ? "bg-gray-900" : "hover:bg-gray-700"
              }`}
              prefetch={true}
            >
              Dashboard
            </Link>

            <Link
              href="/admin/posts"
              className={`px-3 py-2 rounded ${
                isActive("/admin/posts") ? "bg-gray-900" : "hover:bg-gray-700"
              }`}
              prefetch={true}
            >
              Posts
            </Link>

            <Link
              href="/admin/debug"
              className={`px-3 py-2 rounded ${
                isActive("/admin/debug") ? "bg-gray-900" : "hover:bg-gray-700"
              }`}
              prefetch={true}
            >
              Debug
            </Link>

            <Link
              href="/admin/super-debug"
              className={`px-3 py-2 rounded ${
                isActive("/admin/super-debug")
                  ? "bg-gray-900"
                  : "hover:bg-gray-700"
              }`}
              prefetch={true}
            >
              Super Debug
            </Link>
          </div>

          {/* Right side - user info */}
          <div className="flex items-center">
            {user && (
              <>
                <span className="mr-4">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className={`bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ${
                    isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? "Signing Out..." : "Sign Out"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
