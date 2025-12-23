import Link from "next/link"

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 mb-4">
            <svg
              className="w-8 h-8 text-purple-600 dark:text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Check your email
          </h1>

          <p className="text-zinc-600 dark:text-zinc-400 mb-2">
            A sign in link has been sent to your email address.
          </p>

          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Click the link in the email to sign in. The link will expire in 24 hours.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/auth/signin"
            className="block text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Try a different email
          </Link>

          <Link
            href="/start"
            className="block text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
