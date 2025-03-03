import Link from "next/link";
import { getAllPosts, getAllCategories, formatDate } from "@/lib/blog/posts";

export const dynamic = "force-dynamic"; // Disable caching, force fresh data on each request
export const revalidate = 0; // Additionally disable caching

export const metadata = {
  title: "Search | RowandTech",
  description: "Search articles on RowandTech blog",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const { q = "" } = searchParams;
  const query = q.toLowerCase();
  const allPosts = await getAllPosts();
  const categories = await getAllCategories();

  // Filter posts based on search query
  const searchResults = query
    ? allPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.category.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          post.author.toLowerCase().includes(query)
      )
    : [];

  // Get popular tags from all posts for suggestions
  const allTags = allPosts
    .flatMap((post) => post.tags)
    .reduce((acc: { [key: string]: number }, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});

  // Sort tags by frequency and get top 8
  const popularTags = Object.entries(allTags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag]) => tag);

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {query ? "Search Results" : "Search Articles"}
          </h1>

          {/* Search form */}
          <div className="max-w-2xl mx-auto">
            <form className="mt-6 mb-8 flex" action="/search">
              <input
                type="text"
                name="q"
                placeholder="Search for articles..."
                defaultValue={q}
                className="flex-grow px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                aria-label="Search query"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-r-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {query && (
            <p className="text-lg text-gray-600">
              {searchResults.length === 0
                ? `No results found for "${q}"`
                : `Found ${searchResults.length} result${
                    searchResults.length === 1 ? "" : "s"
                  } for "${q}"`}
            </p>
          )}
        </div>

        {/* If there is a query and we have results */}
        {query && searchResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchResults.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {post.cover_image && (
                  <div className="h-48 w-full overflow-hidden">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}

                <div className="p-6">
                  <Link
                    href={`/blog?category=${post.category}`}
                    className="text-blue-600 text-sm font-medium hover:text-blue-800"
                  >
                    {post.category}
                  </Link>

                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="mt-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="mt-3 text-gray-600 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {formatDate(post.published_at)}
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-blue-600 text-sm font-medium hover:text-blue-800 hover:underline"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* If there is a query but no results */}
        {query && searchResults.length === 0 && (
          <div className="text-center py-8 px-4 mx-auto max-w-3xl bg-gray-50 rounded-xl shadow-sm">
            <div className="mb-8">
              <p className="text-gray-600 mb-6 text-lg">
                No articles found matching your search criteria. Try:
              </p>
              <ul className="text-left text-gray-700 mx-auto max-w-xl space-y-2">
                <li>• Using more general search terms</li>
                <li>• Checking for typos or misspellings</li>
                <li>
                  • Searching by category or tag instead of specific keywords
                </li>
                <li>• Browsing all articles to discover content</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/blog"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto text-center"
              >
                Browse all articles
              </Link>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors w-full sm:w-auto text-center"
              >
                Return to homepage
              </Link>
            </div>
          </div>
        )}

        {/* If there's no query, show suggestions and categories */}
        {!query && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-3">
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Popular Topics
                </h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {popularTags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/search?q=${encodeURIComponent(tag)}`}
                      className="px-4 py-2 bg-white text-gray-700 rounded-full text-sm border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                  Recent Articles
                </h2>
                <div className="space-y-6">
                  {allPosts.slice(0, 3).map((post) => (
                    <div key={post.id} className="flex gap-4">
                      {post.cover_image && (
                        <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="font-medium text-gray-900 hover:text-blue-600"
                        >
                          {post.title}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(post.published_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Categories
                </h2>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href={`/search?q=${encodeURIComponent(category.name)}`}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <span className="text-gray-700 hover:text-blue-700">
                        {category.name}
                      </span>
                      <span className="text-gray-500 text-sm bg-white px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
