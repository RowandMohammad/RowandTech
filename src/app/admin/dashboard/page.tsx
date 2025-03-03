"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSupabaseAuthContext } from "@/lib/contexts/SupabaseAuthContext";
import { useState, useEffect } from "react";
import { getAllPosts } from "@/lib/blog/posts";
import type { BlogPost } from "@/lib/blog/posts";

export default function AdminDashboardPage() {
  const { user, signOut } = useSupabaseAuthContext();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const allPosts = await getAllPosts();
        setPosts(allPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Admin Menu
                </h2>
              </div>
              <nav className="p-2">
                <Link
                  href="/admin/dashboard"
                  className="block px-4 py-2 rounded-md bg-blue-50 text-blue-700 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/posts"
                  className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50 mt-1"
                >
                  Manage Posts
                </Link>
                <Link
                  href="/admin/posts/new"
                  className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50 mt-1"
                >
                  Create New Post
                </Link>
                <Link
                  href="/"
                  className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50 mt-1"
                  target="_blank"
                >
                  View Site
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Blog Overview
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-blue-700">
                      Total Posts
                    </h3>
                    <p className="text-3xl font-bold mt-2">{posts.length}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-green-700">
                      Categories
                    </h3>
                    <p className="text-3xl font-bold mt-2">
                      {new Set(posts.map((post) => post.category)).size}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-purple-700">
                      Latest Post
                    </h3>
                    <p className="text-lg font-medium mt-2 truncate">
                      {posts.length > 0 ? posts[0].title : "No posts yet"}
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Recent Posts
                  </h3>
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    </div>
                  ) : posts.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No posts found. Create your first post!
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Title
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Category
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Date
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {posts.slice(0, 5).map((post) => (
                            <tr key={post.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {post.title}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                  {post.category}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(
                                  post.published_at
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link
                                  href={`/admin/posts/edit/${post.id}`}
                                  className="text-blue-600 hover:text-blue-900 mr-4"
                                >
                                  Edit
                                </Link>
                                <Link
                                  href={`/blog/${post.slug}`}
                                  className="text-gray-600 hover:text-gray-900"
                                  target="_blank"
                                >
                                  View
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {posts.length > 5 && (
                        <div className="px-6 py-3 text-right">
                          <Link
                            href="/admin/posts"
                            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                          >
                            View all posts →
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
