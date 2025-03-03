import { supabase } from "../supabase/client";
import { format } from "date-fns";

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published_at: string;
  updated_at: string;
  category: string;
  tags: string[];
  author: string;
  author_image?: string;
  cover_image?: string;
};

export type BlogCategory = {
  name: string;
  slug: string;
  count: number;
};

// For development/demo purposes, we'll use mock data
// In production, you would fetch this from Supabase
const mockPosts: BlogPost[] = [
  {
    id: 1,
    title: "Building AI-Powered Data Pipelines with Python and Docker",
    slug: "ai-data-pipelines",
    content:
      "# Building AI-Powered Data Pipelines with Python and Docker\n\nThis is a sample blog post about AI-powered data pipelines.",
    excerpt:
      "Learn how to create efficient, scalable data pipelines that leverage machine learning for real-time insights.",
    published_at: "2025-03-10T10:00:00Z",
    updated_at: "2025-03-10T10:00:00Z",
    category: "AI/ML",
    tags: ["Python", "Docker", "Machine Learning", "Data Engineering"],
    author: "Rowand Mohammad",
  },
  {
    id: 2,
    title: "Raspberry Pi Cluster: Building a Mini Kubernetes Environment",
    slug: "raspberry-pi-kubernetes",
    content:
      "# Raspberry Pi Cluster: Building a Mini Kubernetes Environment\n\nThis is a sample blog post about building a Raspberry Pi Kubernetes cluster.",
    excerpt:
      "A step-by-step guide to creating your own mini K8s cluster for learning and development.",
    published_at: "2025-03-05T14:30:00Z",
    updated_at: "2025-03-05T14:30:00Z",
    category: "Hardware Integration",
    tags: ["Raspberry Pi", "Kubernetes", "DevOps", "Homelab"],
    author: "Rowand Mohammad",
  },
  {
    id: 3,
    title: "Implementing Zero-Trust Security in Enterprise Environments",
    slug: "zero-trust-security",
    content:
      "# Implementing Zero-Trust Security in Enterprise Environments\n\nThis is a sample blog post about implementing zero-trust security.",
    excerpt:
      "How to architect and deploy modern security principles in complex organizational setups.",
    published_at: "2025-02-28T09:15:00Z",
    updated_at: "2025-02-28T09:15:00Z",
    category: "Enterprise Solutions",
    tags: ["Security", "Zero-Trust", "Enterprise", "Cybersecurity"],
    author: "Rowand Mohammad",
  },
];

// Function to get all blog posts
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    // Fetch from Supabase
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Error fetching blog posts:", error);
      // Fall back to mock data if there's an error
      return mockPosts;
    }

    // If no posts in database yet, return mock data
    if (!data || data.length === 0) {
      return mockPosts;
    }

    return data;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return mockPosts;
  }
}

// Function to get a single blog post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // Fetch from Supabase
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error(`Error fetching post with slug ${slug}:`, error);
      // Fall back to mock data if there's an error
      const post = mockPosts.find((post) => post.slug === slug);
      return post || null;
    }

    return data;
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    const post = mockPosts.find((post) => post.slug === slug);
    return post || null;
  }
}

// Function to get all categories with post counts
export async function getAllCategories(): Promise<BlogCategory[]> {
  try {
    // Fetch from Supabase
    const { data, error } = await supabase.from("posts").select("category");

    if (error) {
      console.error("Error fetching categories:", error);
      // Fall back to mock data if there's an error
      const categories = mockPosts.reduce(
        (acc: Record<string, number>, post) => {
          acc[post.category] = (acc[post.category] || 0) + 1;
          return acc;
        },
        {}
      );

      return Object.entries(categories).map(([name, count]) => ({
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        count,
      }));
    }

    // If no posts in database yet, calculate from mock data
    if (!data || data.length === 0) {
      const categories = mockPosts.reduce(
        (acc: Record<string, number>, post) => {
          acc[post.category] = (acc[post.category] || 0) + 1;
          return acc;
        },
        {}
      );

      return Object.entries(categories).map(([name, count]) => ({
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        count,
      }));
    }

    // Count posts per category
    const categories = data.reduce((acc: Record<string, number>, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(categories).map(([name, count]) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      count,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Function to get posts by category
export async function getPostsByCategory(
  category: string
): Promise<BlogPost[]> {
  try {
    // Fetch from Supabase
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("category", category)
      .order("published_at", { ascending: false });

    if (error) {
      console.error(`Error fetching posts for category ${category}:`, error);
      // Fall back to mock data if there's an error
      return mockPosts.filter(
        (post) => post.category.toLowerCase() === category.toLowerCase()
      );
    }

    // If no posts in database yet, filter mock data
    if (!data || data.length === 0) {
      return mockPosts.filter(
        (post) => post.category.toLowerCase() === category.toLowerCase()
      );
    }

    return data;
  } catch (error) {
    console.error(`Error fetching posts for category ${category}:`, error);
    return [];
  }
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "MMMM d, yyyy");
}

// Function to create a new post
export async function createPost(
  postData: Omit<BlogPost, "id">
): Promise<{ success: boolean; data?: BlogPost; error?: any }> {
  try {
    const { data, error } = await supabase
      .from("posts")
      .insert([postData])
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error creating post:", error);
    return { success: false, error };
  }
}

// Function to update an existing post
export async function updatePost(
  id: number,
  postData: Partial<BlogPost>
): Promise<{ success: boolean; data?: BlogPost; error?: any }> {
  try {
    const { data, error } = await supabase
      .from("posts")
      .update(postData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error updating post:", error);
    return { success: false, error };
  }
}

// Function to delete a post
export async function deletePost(
  id: number
): Promise<{ success: boolean; error?: any }> {
  try {
    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false, error };
  }
}
