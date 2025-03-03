import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getPostBySlug, getAllPosts, formatDate } from "@/lib/blog/posts";
import type { Metadata } from "next";

export const dynamic = "force-dynamic"; // Disable caching, force fresh data on each request
export const revalidate = 0; // Additionally disable caching

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found | Rowand's Tech Insights",
    };
  }

  return {
    title: `${post.title} | Rowand's Tech Insights`,
    description: post.excerpt,
  };
}

// Generate static params for all posts
export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Get related posts (same category, excluding current post)
  const allPosts = await getAllPosts();
  const relatedPosts = allPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <article className="max-w-4xl mx-auto">
          {/* Post Header */}
          <header className="mb-8">
            <div className="flex items-center mb-4 text-sm">
              <Link
                href={`/blog?category=${post.category}`}
                className="text-blue-600 font-medium hover:text-blue-800"
              >
                {post.category}
              </Link>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-gray-500">
                {formatDate(post.published_at)}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>

            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                  {post.author.charAt(0)}
                </div>
              </div>
              <div>
                <p className="text-gray-900 font-medium">{post.author}</p>
              </div>
            </div>
          </header>

          {/* Cover Image */}
          {post.cover_image && (
            <div className="mb-8 rounded-xl overflow-hidden shadow-md">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-auto object-cover max-h-[500px]"
              />
            </div>
          )}

          {/* Tags */}
          <div className="mb-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* Share Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Share this article
            </h3>
            <div className="flex space-x-4">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  post.title
                )}&url=${encodeURIComponent(
                  `https://rowandstechinsights.com/blog/${post.slug}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-500"
              >
                Twitter
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  `https://rowandstechinsights.com/blog/${post.slug}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-700"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="max-w-4xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.id} className="card">
                  <div className="p-6">
                    <div className="flex items-center mb-3 text-sm">
                      <span className="text-blue-600 font-medium">
                        {relatedPost.category}
                      </span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-gray-500">
                        {formatDate(relatedPost.published_at)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-gray-900">
                      {relatedPost.title}
                    </h3>
                    <Link
                      href={`/blog/${relatedPost.slug}`}
                      className="text-blue-600 font-medium hover:text-blue-800 inline-flex items-center group mt-3"
                    >
                      Read Article
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="max-w-4xl mx-auto mt-16 bg-blue-50 rounded-lg p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Enjoyed this article?
            </h3>
            <p className="text-gray-600 mb-6">
              Subscribe to get notified about new tech insights and guides.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <button className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
