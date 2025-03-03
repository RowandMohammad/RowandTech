import Link from "next/link";
import { getAllPosts, getAllCategories, formatDate } from "@/lib/blog/posts";

export const dynamic = "force-dynamic"; // Disable caching, force fresh data on each request
export const revalidate = 0; // Additionally disable caching

export const metadata = {
  title: "Blog | RowandTech",
  description:
    "Explore articles on AI, data engineering, hardware integrations, and enterprise solutions",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const posts = await getAllPosts();
  const categories = await getAllCategories();
  const { category } = searchParams;

  // Filter posts by category if provided
  const filteredPosts = category
    ? posts.filter(
        (post) => post.category.toLowerCase() === category.toLowerCase()
      )
    : posts;

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-3">
            Our Articles
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            RowandTech Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            In-depth articles on AI, data engineering, hardware integrations,
            and enterprise solutions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with categories */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-24 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Categories
              </h2>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/blog"
                    className={`block py-2 px-3 rounded-lg transition-all ${
                      !category
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    All Posts{" "}
                    <span className="text-gray-500 ml-1">({posts.length})</span>
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/blog?category=${cat.name}`}
                      className={`block py-2 px-3 rounded-lg transition-all ${
                        category === cat.name
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {cat.name}{" "}
                      <span className="text-gray-500 ml-1">({cat.count})</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Blog posts grid */}
          <div className="lg:col-span-3">
            {category && (
              <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {category}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Showing {filteredPosts.length} posts in this category
                    </p>
                  </div>
                  <Link
                    href="/blog"
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    <span>Clear filter</span>
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            )}

            {filteredPosts.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700">
                  No posts found
                </h3>
                <p className="text-gray-500 mt-2">
                  Try selecting a different category or check back later.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="card flex flex-col h-full shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden"
                  >
                    {post.cover_image && (
                      <div className="relative w-full h-48 overflow-hidden">
                        <Link href={`/blog/${post.slug}`}>
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                          />
                        </Link>
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center mb-4">
                        <span className="text-sm text-blue-600 font-medium px-2.5 py-0.5 bg-blue-50 rounded-full">
                          {post.category}
                        </span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-sm text-gray-500">
                          {formatDate(post.published_at)}
                        </span>
                      </div>
                      <Link href={`/blog/${post.slug}`} className="group">
                        <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 mb-4 flex-grow">
                        {post.excerpt}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-blue-600 font-medium hover:text-blue-800 inline-flex items-center group"
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
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {post.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {post.tags.length > 2 && (
                              <span className="inline-block text-gray-500 text-xs">
                                +{post.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
