"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { BlogPost } from "@/lib/blog/posts";

type PostFormProps = {
  post?: Partial<BlogPost>;
  onSubmit: (postData: Partial<BlogPost>) => Promise<void>;
  isSubmitting: boolean;
};

export default function PostForm({
  post,
  onSubmit,
  isSubmitting,
}: PostFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: post?.title || "",
    slug: post?.slug || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    author: post?.author || "",
    category: post?.category || "",
    tags: post?.tags || [],
    published_at: post?.published_at || new Date().toISOString(),
    cover_image: post?.cover_image || "",
    author_image: post?.author_image || "",
  });
  const [error, setError] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState(
    Array.isArray(post?.tags) ? post?.tags.join(", ") : ""
  );

  // Create a slug from the title
  useEffect(() => {
    if (!formData.slug && formData.title) {
      setFormData({
        ...formData,
        slug: formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      });
    }
  }, [formData.title, formData.slug]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "tags") {
      setTagsInput(value);
      const tagsArray = value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");
      setFormData({ ...formData, tags: tagsArray });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Basic validation
      if (!formData.title) {
        setError("Title is required");
        return;
      }

      if (!formData.slug) {
        setError("Slug is required");
        return;
      }

      if (!formData.content) {
        setError("Content is required");
        return;
      }

      // All checks passed, submit the form
      await onSubmit({
        ...formData,
        updated_at: new Date().toISOString(), // Always update the updated_at field
      });
    } catch (err: any) {
      console.error("Error in form submission:", err);
      setError(err.message || "An error occurred while saving the post");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          value={formData.title || ""}
          onChange={handleChange}
          disabled={isSubmitting}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-gray-700"
        >
          Slug <span className="text-red-600">*</span>
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            /blog/
          </span>
          <input
            type="text"
            name="slug"
            id="slug"
            required
            value={formData.slug || ""}
            onChange={handleChange}
            disabled={isSubmitting}
            className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-none rounded-r-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          URL-friendly name (automatically generated from title)
        </p>
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          Content <span className="text-red-600">*</span>
        </label>
        <textarea
          name="content"
          id="content"
          rows={15}
          required
          value={formData.content || ""}
          onChange={handleChange}
          disabled={isSubmitting}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
        <p className="mt-1 text-sm text-gray-500">
          Supports Markdown formatting
        </p>
      </div>

      <div>
        <label
          htmlFor="excerpt"
          className="block text-sm font-medium text-gray-700"
        >
          Excerpt
        </label>
        <textarea
          name="excerpt"
          id="excerpt"
          rows={3}
          value={formData.excerpt || ""}
          onChange={handleChange}
          disabled={isSubmitting}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
        <p className="mt-1 text-sm text-gray-500">
          Short description for previews (optional)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-700"
          >
            Author <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="author"
            id="author"
            required
            value={formData.author || ""}
            onChange={handleChange}
            disabled={isSubmitting}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <input
            type="text"
            name="category"
            id="category"
            value={formData.category || ""}
            onChange={handleChange}
            disabled={isSubmitting}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-gray-700"
        >
          Tags
        </label>
        <input
          type="text"
          name="tags"
          id="tags"
          value={tagsInput}
          onChange={handleChange}
          disabled={isSubmitting}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Comma-separated list of tags
        </p>
      </div>

      <div>
        <label
          htmlFor="cover_image"
          className="block text-sm font-medium text-gray-700"
        >
          Cover Image URL
        </label>
        <input
          type="text"
          name="cover_image"
          id="cover_image"
          value={formData.cover_image || ""}
          onChange={handleChange}
          disabled={isSubmitting}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isSubmitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          }`}
        >
          {isSubmitting
            ? "Saving..."
            : post?.id
            ? "Update Post"
            : "Create Post"}
        </button>
      </div>
    </form>
  );
}
