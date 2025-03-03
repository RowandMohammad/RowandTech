"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Search, User, Shield } from "lucide-react";
import { useSupabaseAuthContext } from "@/lib/contexts/SupabaseAuthContext";
import { useRouter } from "next/navigation";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAdmin } = useSupabaseAuthContext();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const openSearch = () => {
    setIsSearchOpen(true);
    // Focus the search input after the dialog opens
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 10);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open search dialog with '/' key if not in an input field
      if (
        e.key === "/" &&
        !isSearchOpen &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        openSearch();
      }

      // Close with Escape key
      if (e.key === "Escape" && isSearchOpen) {
        closeSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  // Handle outside click to close search dialog
  useEffect(() => {
    if (!isSearchOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const searchDialog = document.getElementById("search-dialog");
      if (searchDialog && !searchDialog.contains(e.target as Node)) {
        closeSearch();
      }
    };

    // Add after a small delay to prevent it from immediately triggering when opening
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  return (
    <header className="bg-white shadow-sm py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-merriweather font-bold text-gray-900 hover:text-blue-600 transition-colors"
          >
            Rowand<span className="text-blue-600">Tech</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium px-2 py-1 rounded hover:bg-gray-50 transition-all"
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="text-gray-700 hover:text-blue-600 font-medium px-2 py-1 rounded hover:bg-gray-50 transition-all"
            >
              Blog
            </Link>
            <Link
              href="/projects"
              className="text-gray-700 hover:text-blue-600 font-medium px-2 py-1 rounded hover:bg-gray-50 transition-all"
            >
              Projects
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600 font-medium px-2 py-1 rounded hover:bg-gray-50 transition-all"
            >
              About
            </Link>
            <button
              aria-label="Search"
              aria-haspopup="dialog"
              aria-expanded={isSearchOpen}
              className="text-gray-700 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 transition-all flex items-center"
              onClick={openSearch}
            >
              <Search size={20} />
              <span className="sr-only">Search</span>
            </button>
            <Link
              href="/admin/super-debug"
              className={`font-medium flex items-center px-3 py-2 rounded transition-all ${
                isAdmin
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              {isAdmin ? (
                <>
                  <Shield size={16} className="mr-1.5" />
                  Admin
                </>
              ) : (
                <>
                  <User size={16} className="mr-1.5" />
                  Login
                </>
              )}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              aria-label="Search"
              className="text-gray-700 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 mr-1"
              onClick={openSearch}
            >
              <Search size={20} />
            </button>
            <button
              className="text-gray-700 focus:outline-none p-2 rounded-full hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav
            className="mt-4 flex flex-col space-y-2 md:hidden bg-white rounded-lg shadow-lg p-4 absolute left-4 right-4 z-50"
            aria-label="Mobile Navigation"
          >
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium py-2 px-3 rounded hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="text-gray-700 hover:text-blue-600 font-medium py-2 px-3 rounded hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/projects"
              className="text-gray-700 hover:text-blue-600 font-medium py-2 px-3 rounded hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600 font-medium py-2 px-3 rounded hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/admin/super-debug"
              className={`font-medium py-2 px-3 rounded flex items-center ${
                isAdmin
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-50 text-blue-700"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {isAdmin ? (
                <>
                  <Shield size={16} className="mr-2" /> Admin Dashboard
                </>
              ) : (
                <>
                  <User size={16} className="mr-2" /> Login
                </>
              )}
            </Link>
          </nav>
        )}
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="search-dialog-title"
          onClick={(e) => {
            // Close when clicking the backdrop, but not when clicking the dialog
            if (e.target === e.currentTarget) {
              closeSearch();
            }
          }}
        >
          <div
            id="search-dialog"
            className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2
                id="search-dialog-title"
                className="text-xl font-bold text-gray-900"
              >
                Search Blog
              </h2>
              <button
                onClick={closeSearch}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                aria-label="Close search"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit}>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for articles..."
                  className="flex-grow px-4 py-3 focus:outline-none"
                  required
                  ref={searchInputRef}
                  aria-label="Search query"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors"
                  aria-label="Submit search"
                >
                  <Search size={20} />
                </button>
              </div>
              <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                <p>Search by title, content, category, tags or author</p>
                <div className="text-gray-500">
                  <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">
                    ESC
                  </kbd>{" "}
                  to close,
                  <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs ml-1">
                    /
                  </kbd>{" "}
                  to open
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
