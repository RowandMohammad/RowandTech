import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-white min-h-[70vh] flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Page Not Found
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-lg mx-auto">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary">
            Return Home
          </Link>
          <Link href="/blog" className="btn-secondary">
            Browse Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
