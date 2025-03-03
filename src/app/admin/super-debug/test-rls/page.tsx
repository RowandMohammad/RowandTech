"use client";

import { useState, useEffect } from "react";
import { useSupabaseAuthContext } from "@/lib/contexts/SupabaseAuthContext";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

export default function TestRlsPage() {
  const { user, isAdmin } = useSupabaseAuthContext();
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      runTests();
    } else {
      setLoading(false);
    }
  }, [user]);

  const runTests = async () => {
    setLoading(true);
    setError(null);

    const results: Record<string, any> = {};

    try {
      // Test 1: Can query admins table
      try {
        const { data, error } = await supabase.from("admins").select("*");
        results.canQueryAdmins = {
          success: !error,
          data: data ? data.length : 0,
          error: error ? error.message : null,
        };
      } catch (err: any) {
        results.canQueryAdmins = {
          success: false,
          error: err.message,
        };
      }

      // Test 2: Can find self in admins table
      try {
        const { data, error } = await supabase
          .from("admins")
          .select("*")
          .eq("user_id", user?.id || "");

        results.isInAdminsTable = {
          success: !error && data && data.length > 0,
          data: data || [],
          error: error ? error.message : null,
        };
      } catch (err: any) {
        results.isInAdminsTable = {
          success: false,
          error: err.message,
        };
      }

      // Test 3: Can query posts table
      try {
        const { data, error } = await supabase.from("posts").select("*");
        results.canQueryPosts = {
          success: !error,
          data: data ? data.length : 0,
          error: error ? error.message : null,
        };
      } catch (err: any) {
        results.canQueryPosts = {
          success: false,
          error: err.message,
        };
      }

      // Test 4: Simple direct SQL access
      try {
        const { data, error } = await supabase.rpc("simple_test", {});
        results.rpcTest = {
          success: !error,
          data: data,
          error: error ? error.message : null,
        };
      } catch (err: any) {
        results.rpcTest = {
          success: false,
          error: err.message,
          note: "This test needs the 'simple_test' function to be defined in Supabase",
        };
      }

      setTestResults(results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link
          href="/admin/super-debug"
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Super Debug
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">RLS Policy Test</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Testing RLS Policies</h2>

        {loading ? (
          <div className="flex items-center justify-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <p className="font-bold">Error Running Tests</p>
            <p>{error}</p>
          </div>
        ) : (
          <div>
            <div className="space-y-4">
              <div
                className={`p-4 rounded ${
                  testResults.canQueryAdmins?.success
                    ? "bg-green-100"
                    : "bg-red-100"
                }`}
              >
                <p className="font-semibold">
                  Test 1: Query admins table -{" "}
                  {testResults.canQueryAdmins?.success ? "Success" : "Failed"}
                </p>
                <p className="text-sm mt-1">
                  {testResults.canQueryAdmins?.success
                    ? `Found ${testResults.canQueryAdmins?.data} records`
                    : `Error: ${testResults.canQueryAdmins?.error}`}
                </p>
              </div>

              <div
                className={`p-4 rounded ${
                  testResults.isInAdminsTable?.success
                    ? "bg-green-100"
                    : "bg-red-100"
                }`}
              >
                <p className="font-semibold">
                  Test 2: Find self in admins table -{" "}
                  {testResults.isInAdminsTable?.success ? "Success" : "Failed"}
                </p>
                <p className="text-sm mt-1">
                  {testResults.isInAdminsTable?.success
                    ? `You are in the admins table!`
                    : `You are not in the admins table or an error occurred: ${testResults.isInAdminsTable?.error}`}
                </p>
              </div>

              <div
                className={`p-4 rounded ${
                  testResults.canQueryPosts?.success
                    ? "bg-green-100"
                    : "bg-red-100"
                }`}
              >
                <p className="font-semibold">
                  Test 3: Query posts table -{" "}
                  {testResults.canQueryPosts?.success ? "Success" : "Failed"}
                </p>
                <p className="text-sm mt-1">
                  {testResults.canQueryPosts?.success
                    ? `Found ${testResults.canQueryPosts?.data} posts`
                    : `Error: ${testResults.canQueryPosts?.error}`}
                </p>
              </div>

              <div
                className={`p-4 rounded ${
                  testResults.rpcTest?.success
                    ? "bg-green-100"
                    : testResults.rpcTest?.note
                    ? "bg-yellow-100"
                    : "bg-red-100"
                }`}
              >
                <p className="font-semibold">
                  Test 4: RPC Function Test -{" "}
                  {testResults.rpcTest?.success
                    ? "Success"
                    : testResults.rpcTest?.note
                    ? "Skipped"
                    : "Failed"}
                </p>
                <p className="text-sm mt-1">
                  {testResults.rpcTest?.success
                    ? `RPC function executed successfully`
                    : testResults.rpcTest?.note
                    ? testResults.rpcTest?.note
                    : `Error: ${testResults.rpcTest?.error}`}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={runTests}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
              >
                Run Tests Again
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">SQL Function to Create</h2>
        <p className="mb-4">
          For Test 4 to work, create this function in your Supabase SQL editor:
        </p>

        <pre className="bg-gray-800 text-gray-100 p-4 rounded text-sm overflow-x-auto">
          {`-- Simple test function that always returns true
CREATE OR REPLACE FUNCTION simple_test()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;`}
        </pre>
      </div>
    </div>
  );
}
