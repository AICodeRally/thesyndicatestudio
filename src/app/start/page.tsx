import Link from "next/link"
import { auth } from "../../../auth"
import { redirect } from "next/navigation"

export default async function StartPage() {
  const session = await auth()

  // If already signed in, redirect to vault
  if (session?.user) {
    redirect("/vault")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="text-2xl font-bold tracking-tight">
              The Toddfather
            </div>
            <Link
              href="/auth/signin"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
              Welcome to the
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-amber-500 bg-clip-text text-transparent">
                Family Vault
              </span>
            </h1>

            <p className="mt-6 text-xl sm:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
              Collect Counsel. Apply it. Defend it.
            </p>

            <p className="mt-8 text-lg text-zinc-500 dark:text-zinc-500 max-w-2xl mx-auto">
              Intelligent Sales Performance Management starts with structured guidance
              you can trust. Build your library of proven SPM patterns, organize them
              your way, and get AI assistance that actually understands compensation.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/counsel?focus=comp-design"
              className="w-full sm:w-auto px-8 py-4 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-center"
            >
              Fix my comp plan
            </Link>
            <Link
              href="/counsel?focus=governance"
              className="w-full sm:w-auto px-8 py-4 border-2 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg font-semibold hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors text-center"
            >
              Reduce disputes / build governance
            </Link>
            <Link
              href="/counsel?focus=ai-spm"
              className="w-full sm:w-auto px-8 py-4 border-2 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg font-semibold hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors text-center"
            >
              Make AI useful in SPM
            </Link>
          </div>

          {/* Feature Grid */}
          <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div className="text-3xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
                Counsel Library
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Browse structured SPM guidance across planning, payouts, governance,
                and AI integration. Save what matters to your Vault.
              </p>
            </div>

            <div className="p-8 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div className="text-3xl mb-4">🗂️</div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
                Family Vault
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Organize Counsel into collections. Add notes. Export for your team.
                Build your personal SPM playbook.
              </p>
            </div>

            <div className="p-8 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
                Ask The Toddfather
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Get AI assistance grounded in your saved Counsel. SPARCC subscribers
                unlock unlimited context-aware conversations.
              </p>
            </div>
          </div>

          {/* Start CTA */}
          <div className="mt-24 text-center">
            <Link
              href="/auth/signin"
              className="inline-block px-12 py-5 bg-gradient-to-r from-purple-600 to-amber-500 text-white text-lg font-bold rounded-lg hover:from-purple-700 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started - It's Free
            </Link>
            <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-500">
              No spam. No vendors. Just SPM.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-zinc-500 dark:text-zinc-500">
              © 2025 The Toddfather. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <Link
                href="/counsel"
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                Counsel
              </Link>
              <Link
                href="/episodes"
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                Videos
              </Link>
              <a
                href="https://thebackroom.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                The Back Room
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
