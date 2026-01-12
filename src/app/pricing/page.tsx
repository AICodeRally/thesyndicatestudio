import Link from 'next/link'
import { auth } from '@/lib/auth'

export const metadata = {
  title: 'Pricing | Intelligent SPM',
  description: 'Simple, transparent pricing. Free tier to explore, SPARCC tier for full power.',
}

const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const XIcon = () => (
  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export default async function PricingPage() {
  const { userId } = await auth()
  const isLoggedIn = !!userId

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0F] via-purple-900/10 to-[#0A0A0F]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6">
            Simple Pricing
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            No enterprise sales theater. No hidden fees. Pick a tier and get started.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Tier */}
            <div className="cosmic-card p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-serif font-bold text-white mb-2">Free</h2>
                <p className="text-gray-400">Explore what Intelligent SPM has to offer</p>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-bold text-white">$0</span>
                <span className="text-gray-500 ml-2">forever</span>
              </div>

              <Link
                href={isLoggedIn ? '/vault' : '/sign-in'}
                className="block w-full px-6 py-3 border-2 border-purple-500/50 text-purple-400 rounded-lg font-semibold text-center hover:bg-purple-500/10 transition-colors mb-8"
              >
                {isLoggedIn ? 'Go to Vault' : 'Get Started Free'}
              </Link>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <div>
                    <p className="text-white font-medium">Counsel Library</p>
                    <p className="text-sm text-gray-500">Full access to all Counsel articles</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <div>
                    <p className="text-white font-medium">Glossary</p>
                    <p className="text-sm text-gray-500">60+ SPM term definitions</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <div>
                    <p className="text-white font-medium">Plan Check Tool</p>
                    <p className="text-sm text-gray-500">Analyze your comp plans</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="text-yellow-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">Ask The Toddfather</p>
                    <p className="text-sm text-gray-500">3 AI messages total</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="text-yellow-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">Family Vault</p>
                    <p className="text-sm text-gray-500">3 collections max</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XIcon />
                  <div>
                    <p className="text-gray-500 font-medium">Working Models</p>
                    <p className="text-sm text-gray-600">View only</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XIcon />
                  <div>
                    <p className="text-gray-500 font-medium">Export to PDF</p>
                    <p className="text-sm text-gray-600">Not available</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* SPARCC Tier */}
            <div className="relative cosmic-card p-8 border-2 border-purple-500/50">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-sm font-semibold text-white">
                Most Popular
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-serif font-bold text-white mb-2">SPARCC</h2>
                <p className="text-gray-400">Full access to everything</p>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-bold text-white">$29</span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>

              <Link
                href={isLoggedIn ? '/settings/billing' : '/sign-in'}
                className="block w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-semibold text-center transition-colors mb-8"
              >
                {isLoggedIn ? 'Upgrade Now' : 'Start Free, Upgrade Later'}
              </Link>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <div>
                    <p className="text-white font-medium">Everything in Free</p>
                    <p className="text-sm text-gray-500">All free tier features included</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <div>
                    <p className="text-white font-medium">Unlimited AI Chat</p>
                    <p className="text-sm text-gray-500">Ask The Toddfather anything, anytime</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <div>
                    <p className="text-white font-medium">Unlimited Collections</p>
                    <p className="text-sm text-gray-500">Organize your entire SPM knowledge base</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <div>
                    <p className="text-white font-medium">Working Models</p>
                    <p className="text-sm text-gray-500">Interactive calculators with full access</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <div>
                    <p className="text-white font-medium">Export to PDF & Markdown</p>
                    <p className="text-sm text-gray-500">Take your knowledge with you</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <div>
                    <p className="text-white font-medium">Priority Support</p>
                    <p className="text-sm text-gray-500">Direct access to Todd</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-white text-center mb-12">
            Common Questions
          </h2>

          <div className="space-y-6">
            <div className="cosmic-card p-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">
                What's SPARCC?
              </h3>
              <p className="text-gray-400">
                SPARCC stands for Sales Performance Analytics, Reporting, Calculation & Crediting. It's the full scope of what SPM covers. The SPARCC tier gives you full access to tools and resources for all of it.
              </p>
            </div>

            <div className="cosmic-card p-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-400">
                Yes. No contracts, no commitments. Cancel with one click and you'll keep access until your billing period ends. No questions asked.
              </p>
            </div>

            <div className="cosmic-card p-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">
                Do you offer team pricing?
              </h3>
              <p className="text-gray-400">
                Not yet. If you need access for multiple people, reach out directly and we'll figure something out. I'm not going to nickel-and-dime you with per-seat pricing theater.
              </p>
            </div>

            <div className="cosmic-card p-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">
                What's included in "Ask The Toddfather"?
              </h3>
              <p className="text-gray-400">
                It's an AI assistant trained on SPM best practices, common pitfalls, and real-world implementation experience. Ask it anything about comp design, governance, vendor selection, or troubleshooting.
              </p>
            </div>

            <div className="cosmic-card p-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">
                What if I need more than tools?
              </h3>
              <p className="text-gray-400">
                Check out the <Link href="/services" className="text-purple-400 hover:text-purple-300">Services</Link> page. I do assessments, redesigns, and ongoing ops support. The subscription helps you learn; services help you execute.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="cosmic-card p-10">
            <h2 className="text-2xl font-serif font-bold text-white mb-4">
              Ready to stop guessing?
            </h2>
            <p className="text-gray-400 mb-8">
              Whether you're debugging a broken plan or building from scratch, the tools and knowledge are here.
            </p>
            <Link
              href={isLoggedIn ? '/counsel' : '/sign-in'}
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-semibold transition-colors"
            >
              {isLoggedIn ? 'Explore Counsel Library' : 'Get Started Free'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
