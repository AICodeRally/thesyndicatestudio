'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

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
        <div className="bg-[#1A1A2F] border border-[#2A2A3A] rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">📬</div>
          <h2 className="text-xl font-semibold text-white mb-2">Check your inbox</h2>
          <p className="text-gray-400 mb-4">
            We sent a magic link to <span className="text-purple-400">{email}</span>
          </p>
          <p className="text-gray-500 text-sm">
            Click the link in the email to sign in. It expires in 15 minutes.
          </p>
          <button
            onClick={() => setSent(false)}
            className="mt-6 text-purple-400 hover:text-purple-300 text-sm"
          >
            Use a different email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-[#1A1A2F] border border-[#2A2A3A] rounded-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <label className="block text-gray-300 text-sm mb-2">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            className="w-full px-4 py-3 bg-[#2A2A3A] border border-[#3A3A4A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>

          <p className="mt-4 text-center text-gray-500 text-sm">
            No password needed. We'll email you a link to sign in.
          </p>
        </form>
      )}
    </>
  )
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            The Syndicate Studio
          </h1>
          <p className="mt-2 text-gray-400">
            Sign in with your email
          </p>
        </div>

        <Suspense fallback={
          <div className="bg-[#1A1A2F] border border-[#2A2A3A] rounded-lg p-8 text-center">
            <div className="text-gray-400">Loading...</div>
          </div>
        }>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  )
}
