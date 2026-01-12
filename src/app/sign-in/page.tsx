'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function SignInForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const urlError = searchParams.get('error')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setSent(true)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to send magic link')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {urlError && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
          {urlError === 'expired' && 'This link has expired. Please request a new one.'}
          {urlError === 'invalid' && 'Invalid sign-in link. Please try again.'}
          {urlError === 'failed' && 'Sign-in failed. Please try again.'}
        </div>
      )}

      {sent ? (
        <div className="bg-gray-850 border-gray-800 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">📬</div>
          <h2 className="text-xl font-semibold color-white mb-2">Check your inbox</h2>
          <p className="color-gray-500 mb-4">
            We sent a magic link to <span className="color-linear">{email}</span>
          </p>
          <p className="color-gray-600 text-sm">
            Click the link in the email to sign in. It expires in 15 minutes.
          </p>
          <button
            onClick={() => setSent(false)}
            className="mt-6 color-linear hover:underline text-sm"
          >
            Use a different email
          </button>
        </div>
      ) : (
        <div className="bg-gray-850 border-gray-800 rounded-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label className="block color-gray-500 text-sm mb-2">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
            />

            <button
              type="submit"
              disabled={loading}
              className="btn btn-linear hover-up w-full mt-4 py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>

            <p className="mt-4 text-center color-gray-600 text-sm">
              No password needed. We'll email you a link to sign in.
            </p>
          </form>
        </div>
      )}
    </>
  )
}

export default function SignInPage() {
  return (
    <>
      {/* Header */}
      <header className="header sticky-bar bg-gray-900">
        <div className="container">
          <div className="main-header">
            <div className="header-logo">
              <Link className="d-flex" href="/">
                <span className="text-2xl font-bold text-white">Intelligent<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">SPM</span></span>
              </Link>
            </div>
            <div className="header-nav">
              <nav className="nav-main-menu d-none d-xl-block">
                <ul className="main-menu">
                  <li><Link className="color-gray-500" href="/services">Services</Link></li>
                  <li><Link className="color-gray-500" href="/toddfather">The Toddfather</Link></li>
                  <li><Link className="color-gray-500" href="/counsel">Counsel</Link></li>
                  <li><Link className="color-gray-500" href="/episodes">Episodes</Link></li>
                  <li><Link className="color-gray-500" href="/contact">Contact</Link></li>
                </ul>
              </nav>
              <div className="burger-icon burger-icon-white">
                <span className="burger-icon-top"></span>
                <span className="burger-icon-mid"></span>
                <span className="burger-icon-bottom"></span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="cover-home1">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-5 col-lg-6 col-md-8">
                <div className="pt-100 pb-100">
                  <div className="text-center mb-8">
                    <h1 className="color-gray-50 mb-3">
                      Sign <span className="color-linear">In</span>
                    </h1>
                    <p className="color-gray-500">
                      Enter your email to get a magic link
                    </p>
                  </div>

                  <Suspense fallback={
                    <div className="bg-gray-850 border-gray-800 rounded-lg p-8 text-center">
                      <div className="color-gray-500">Loading...</div>
                    </div>
                  }>
                    <SignInForm />
                  </Suspense>

                  <div className="text-center mt-8">
                    <Link href="/" className="color-gray-500 hover:color-linear text-sm">
                      ← Back to home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
