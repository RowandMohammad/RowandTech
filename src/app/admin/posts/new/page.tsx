"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import type { BlogPost } from "@/lib/blog/posts";
import { createPost } from "@/lib/blog/posts";
import { TipBanner } from "@/app/components/admin/TipBanner";

export default function NewPostPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (postData: Partial<BlogPost>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Creating new post:", postData);
      const result = await createPost(postData as Omit<BlogPost, "id">);

      if (result.success) {
        console.log("Post created successfully:", result.data);
        // Navigate to the posts page after successful creation
        router.push("/admin/posts");
        router.refresh();
      } else {
        throw result.error;
      }
    } catch (error: any) {
      console.error("Error creating post:", error);
      setError(error.message || "Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <TipBanner
              title="Blog Post Best Practices"
              message="For the best reader experience: 1) Use a compelling cover image, 2) Write a clear, concise excerpt, 3) Choose relevant tags, and 4) Organize content with headings and short paragraphs."
              type="info"
            />

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            )}
            <PostForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </div>
        </div>
      </div>
    </div>
  );
}
