"use client";

import { useSupabaseAuthContext } from "@/lib/contexts/SupabaseAuthContext";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Home,
  AlertTriangle,
  User,
  Shield,
  Settings,
  BarChart,
  ExternalLink,
  Loader2,
} from "lucide-react";

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useSupabaseAuthContext();

  // Show a simple loading indicator if the auth status is still loading
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-3" />
            <p className="text-gray-700 font-medium">
              Loading your account information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check if user exists before rendering the full dashboard
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Please sign in to access the dashboard.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8 text-center">
            <div className="mb-6">
              <Shield className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                Authentication Required
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                You need to sign in with an admin account to access the
                dashboard and manage your blog.
              </p>
            </div>
            <Link
              href="/admin/login"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm"
            >
              Sign In to Continue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back! Manage your blog content and settings.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Home className="mr-1.5" size={18} />
              <span>View Blog</span>
            </Link>
          </div>
        </div>

        {/* Admin Status Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User className="mr-2 text-blue-500" size={20} />
                Account Status
              </h2>
              <div className="flex items-center mb-4">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    isAdmin ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span className="font-medium">
                  {isAdmin ? "Admin Access: Active" : "Admin Access: Inactive"}
                </span>
              </div>
              <div className="space-y-2">
                <p className="flex items-center">
                  <span className="font-medium mr-2">Email:</span>
                  <span className="text-gray-700">{user?.email}</span>
                </p>
                <p className="flex items-center">
                  <span className="font-medium mr-2">User ID:</span>{" "}
                  <span className="text-gray-500 text-sm font-mono">
                    {user?.id}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <Link
                href="/admin/debug"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="mr-1.5" size={16} />
                Debug Info
              </Link>
              <Link
                href="/admin/super-debug"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Shield className="mr-1.5" size={16} />
                Super Debug
              </Link>
            </div>
          </div>

          {!isAdmin && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6 rounded-r-lg">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    You are signed in, but don&apos;t have admin privileges.
                    Visit the debug pages to diagnose and fix this issue.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {isAdmin && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-blue-800">Total Posts</h3>
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-blue-900">12</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-green-800">Published</h3>
                <ExternalLink className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-green-900">8</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-purple-800">Drafts</h3>
                <FileText className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-purple-900">4</p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-indigo-800">Views</h3>
                <BarChart className="h-5 w-5 text-indigo-500" />
              </div>
              <p className="text-2xl font-bold text-indigo-900">1.2k</p>
            </div>
          </div>
        )}

        {/* Admin Actions */}
        {isAdmin ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all border border-gray-100 hover:-translate-y-1 duration-200">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold">Manage Posts</h3>
              </div>
              <p className="text-gray-600 mb-6">
                View, edit, and delete your blog posts. Organize content by
                categories and tags.
              </p>
              <Link
                href="/admin/posts"
                className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm"
              >
                View All Posts
              </Link>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all border border-gray-100 hover:-translate-y-1 duration-200">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <PlusCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">Create New Post</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Write and publish a new blog post. Add images, code snippets,
                and format your content.
              </p>
              <Link
                href="/admin/posts/new"
                className="inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm"
              >
                Create New Post
              </Link>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all border border-gray-100 hover:-translate-y-1 duration-200">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                  <Settings className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold">Site Settings</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Configure your blog settings, manage categories, and customize
                your site appearance.
              </p>
              <Link
                href="/admin/settings"
                className="inline-flex items-center justify-center w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm"
              >
                Manage Settings
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-4">
              Admin Features Not Available
            </h2>
            <p className="mb-6 text-gray-600 max-w-md mx-auto">
              You need admin privileges to access blog management features. Use
              the Super Debug tool to fix your permissions.
            </p>
            <Link
              href="/admin/super-debug"
              className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm"
            >
              <Shield className="mr-2" size={18} />
              Fix Admin Access
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
