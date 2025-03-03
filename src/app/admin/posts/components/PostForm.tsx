import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { createPost, updatePost } from "@/lib/blog/posts";
import { TipBanner } from "@/app/components/admin/TipBanner";

type PostFormData = {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category?: string;
  tags?: string[];
  published_at?: string | null;
  cover_image?: string;
  author_image?: string;
};

export function PostForm({
  post,
  mode,
}: {
  post?: any;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [formData, setFormData] = useState<PostFormData>({
    title: post?.title || "",
    slug: post?.slug || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    author: post?.author || "",
    category: post?.category || "",
    tags: post?.tags || [],
    published_at: post?.published_at || null,
    cover_image: post?.cover_image || "",
    author_image: post?.author_image || "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSuccess(false);

    try {
      if (mode === "create") {
        // More detailed error logging
        console.log("Creating new post:", formData);
        const { data, error } = await supabase
          .from("posts")
          .insert([formData])
          .select();

        if (error) {
          console.error("Error creating post:", error);
          setError(`Failed to create post: ${error.message}`);
          return;
        }

        console.log("Post created successfully:", data);
        setSuccess(true);

        // Navigate to the posts page after a small delay
        setTimeout(() => {
          router.push("/admin/posts");
          router.refresh();
        }, 1000);
      } else {
        // Editing an existing post
        console.log("Updating post:", post.id, formData);
        const { data, error } = await supabase
          .from("posts")
          .update(formData)
          .eq("id", post.id)
          .select();

        if (error) {
          console.error("Error updating post:", error);
          setError(`Failed to update post: ${error.message}`);
          return;
        }

        console.log("Post updated successfully:", data);
        setSuccess(true);

        // Navigate to the posts page after a small delay
        setTimeout(() => {
          router.push("/admin/posts");
          router.refresh();
        }, 1000);
      }
    } catch (err: any) {
      console.error("Exception in post form submission:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TipBanner
        title="Image Tips"
        message="Adding a cover image will make your post more engaging. Use high-quality images with a 16:9 aspect ratio (1200x675px recommended) for best results."
        type="info"
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <p className="text-sm mt-1">
            If this persists, try running the SQL fix script in the Super Debug
            page.
          </p>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline">
            {mode === "create" ? "Post created." : "Post updated."}{" "}
            Redirecting...
          </span>
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-gray-700"
        >
          Slug
        </label>
        <input
          type="text"
          name="slug"
          id="slug"
          required
          value={formData.slug}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          Content
        </label>
        <textarea
          name="content"
          id="content"
          rows={10}
          required
          value={formData.content}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
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
          value={formData.excerpt}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
      </div>

      <div>
        <label
          htmlFor="author"
          className="block text-sm font-medium text-gray-700"
        >
          Author
        </label>
        <input
          type="text"
          name="author"
          id="author"
          required
          value={formData.author}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
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
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="https://example.com/image.jpg"
        />
        {formData.cover_image && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-1">Preview:</p>
            <div className="rounded-md overflow-hidden border border-gray-200 h-40 w-full">
              <img
                src={formData.cover_image}
                alt="Cover preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/600x400?text=Invalid+Image+URL";
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.push("/admin/posts")}
          className="bg-gray-200 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mr-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            loading
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          }`}
        >
          {loading
            ? "Saving..."
            : mode === "create"
            ? "Create Post"
            : "Update Post"}
        </button>
      </div>
    </form>
  );
}
