"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The sign in link is no longer valid. It may have expired.",
    Default: "An error occurred during sign in.",
  }

  const errorMessage = error
    ? errorMessages[error] || errorMessages.Default
    : errorMessages.Default

  return (
    <div className="min-h-screen flex items-center justify-center bg-spm-black px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/20 border border-red-800 mb-4">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="text-headline-lg text-white mb-4">
            Authentication Error
          </h1>

          <p className="text-gray-300 mb-2">
            {errorMessage}
          </p>

          {error && (
            <p className="text-sm text-gray-500 font-mono">
              Error code: {error}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Link
            href="/auth/signin"
            className="block w-full px-6 py-3 bg-spm-purple hover:bg-spm-purple-light text-white rounded-lg font-semibold transition-all"
          >
            Try signing in again
          </Link>

          <Link
            href="/"
            className="block text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-spm-black" />}>
      <ErrorContent />
    </Suspense>
  )
}
