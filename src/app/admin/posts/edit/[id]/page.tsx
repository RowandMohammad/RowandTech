"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import { getAllPosts, updatePost } from "@/lib/blog/posts";
import type { BlogPost } from "@/lib/blog/posts";

export default function EditPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const postId = parseInt(params.id);

  useEffect(() => {
    async function fetchPost() {
      try {
        // Fetch from Supabase via getAllPosts and filter
        const allPosts = await getAllPosts();
        const foundPost = allPosts.find((p) => p.id === postId);

        if (foundPost) {
          setPost(foundPost);
        } else {
          setError(
            "Post not found. It may have been deleted or you may not have permission to view it."
          );
        }
      } catch (error: any) {
        console.error("Error fetching post:", error);
        setError(`Failed to load post: ${error.message || "Unknown error"}`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPost();
  }, [postId]);

  const handleSubmit = async (postData: Partial<BlogPost>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Updating post:", postId, postData);
      const result = await updatePost(postId, postData);

      if (result.success) {
        console.log("Post updated successfully:", result.data);
        // Navigate to the posts page after successful update
        router.push("/admin/posts");
        router.refresh();
      } else {
        throw result.error;
      }
    } catch (error: any) {
      console.error("Error updating post:", error);
      setError(error.message || "Failed to update post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={() => router.push("/admin/posts")}
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back to Posts
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            )}
            {post && (
              <PostForm
                post={post}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
