import Link from "next/link";
import Image from "next/image";
import { getAllPosts, formatDate } from "@/lib/blog/posts";

export const dynamic = "force-dynamic"; // Disable caching, force fresh data on each request
export const revalidate = 0; // Additionally disable caching

export default async function Home() {
  // Fetch posts from Supabase to use as featured articles
  const allPosts = await getAllPosts();
  // Use the first 3 posts as featured articles
  const featuredArticles = allPosts.slice(0, 3);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              Welcome to RowandTech
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Powering Solutions with{" "}
              <span className="text-blue-600">AI & Data Engineering</span>
            </h1>
            <p className="text-xl text-gray-700 mb-10 leading-relaxed">
              Deep-dive insights on AI, data engineering, and hardware
              integrations for tech professionals solving real-world challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blog"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium text-lg shadow-sm transition-colors inline-flex items-center justify-center"
              >
                Explore Articles
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                href="/admin/super-debug"
                className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 px-6 py-3 rounded-lg font-medium text-lg shadow-sm transition-colors inline-flex items-center justify-center"
              >
                Admin Access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-3">
                Latest Insights
              </span>
              <h2 className="text-3xl font-bold text-gray-900">
                Featured Articles
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                Dive into our latest technical insights and guides
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArticles.map((article) => (
                <article
                  key={article.id}
                  className="card flex flex-col h-full overflow-hidden transform hover:translate-y-[-5px] transition-all duration-300 shadow-md hover:shadow-lg rounded-xl"
                >
                  {article.cover_image && (
                    <div className="relative w-full h-48 overflow-hidden">
                      <Link href={`/blog/${article.slug}`}>
                        <img
                          src={article.cover_image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                        />
                      </Link>
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center mb-4">
                      <span className="text-sm text-blue-600 font-medium px-2.5 py-0.5 bg-blue-50 rounded-full">
                        {article.category}
                      </span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-sm text-gray-500">
                        {formatDate(article.published_at)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 flex-grow">
                      {article.excerpt}
                    </p>
                    <Link
                      href={`/blog/${article.slug}`}
                      className="text-blue-600 font-medium hover:text-blue-800 inline-flex items-center group"
                    >
                      Read More
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
                </article>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/blog"
                className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                View All Articles
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section
        id="newsletter"
        className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl mx-4 sm:mx-8 my-16"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
              Newsletter
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stay Updated
            </h2>
            <p className="text-gray-600 mb-8">
              Subscribe to get notified about new articles and tech insights
              delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center sm:bg-white sm:p-2 sm:rounded-lg sm:shadow-md">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:border-0 sm:focus:ring-0 sm:focus:border-0"
              />
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap">
                Subscribe Now
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              By subscribing, you agree to our Privacy Policy and Terms of
              Service.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
