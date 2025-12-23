"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import Link from "next/link"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signIn("resend", {
        email,
        redirect: false,
        callbackUrl: "/vault",
      })
      setSent(true)
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/vault" })
  }

  const handleDevSignIn = async () => {
    setLoading(true)
    try {
      await signIn("credentials", {
        email: email || "todd.lebaron@gmail.com",
        redirect: true,
        callbackUrl: "/studio",
      })
    } catch (error) {
      console.error("Dev sign in error:", error)
      setLoading(false)
    }
  }

  const handleAppleSignIn = () => {
    signIn("apple", { callbackUrl: "/vault" })
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              Check your email
            </h1>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              We sent a magic link to <strong>{email}</strong>
            </p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
              Click the link in the email to sign in to your account.
            </p>
          </div>

          <Link
            href="/start"
            className="block text-center text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/start" className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            The Toddfather
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Sign in to your account
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Get access to your Family Vault
          </p>
        </div>

        {/* Sign In Form */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8">
          {/* Email Sign In */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending link..." : "Send magic link"}
            </button>
          </form>

          {/* Dev Mode Quick Login */}
          {process.env.NODE_ENV === 'development' && (
            <>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-amber-200 dark:border-amber-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 font-medium">
                    DEV MODE
                  </span>
                </div>
              </div>

              <button
                onClick={handleDevSignIn}
                type="button"
                className="w-full px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors"
              >
                Quick Dev Login (No Password)
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-500">
          Don't have an account?{" "}
          <Link
            href="/start"
            className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300"
          >
            Get started
          </Link>
        </p>
      </div>
    </div>
  )
}
