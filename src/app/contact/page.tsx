import { ContactForm } from '@/components/contact/ContactForm'

export const metadata = {
  title: 'Contact | Intelligent SPM',
  description: 'Get in touch with The Toddfather. No sales pitch. Just straight talk about SPM reality.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0F] via-purple-900/10 to-[#0A0A0F]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6">
            Contact
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            No sales pitch. No discovery call theater. Just straight talk about your SPM reality.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12 px-6">
        <div className="max-w-xl mx-auto">
          <div className="cosmic-card p-8 md:p-12">
            <h2 className="text-2xl font-serif font-bold text-white mb-8 text-center">
              Start the Conversation
            </h2>

            <ContactForm />

            {/* Direct Contact */}
            <div className="mt-10 pt-8 border-t border-[#2A2A3A]">
              <h3 className="text-lg font-semibold text-purple-400 mb-4">
                Direct Contact
              </h3>
              <div className="space-y-3 text-gray-300">
                <p>
                  <span className="text-gray-500">Email:</span>{' '}
                  <a
                    href="mailto:todd@intelligentspm.com"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    todd@intelligentspm.com
                  </a>
                </p>
                <p className="text-sm text-gray-500">
                  Response time: Usually within 24 hours. If it's urgent, say so in the subject line.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-serif font-bold text-white mb-8 text-center">
            Common Questions
          </h2>

          <div className="space-y-6">
            <div className="cosmic-card p-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">
                Do you do free consultations?
              </h3>
              <p className="text-gray-400">
                I don't do "discovery calls" where we dance around pricing. Tell me what you need, I'll tell you if I can help and what it costs. Simple.
              </p>
            </div>

            <div className="cosmic-card p-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">
                Can you recommend a vendor?
              </h3>
              <p className="text-gray-400">
                Yes, but I'll also tell you what that vendor is bad at. Check out the Vendor Scorecards for detailed breakdowns, or ask me directly about your specific situation.
              </p>
            </div>

            <div className="cosmic-card p-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">
                What's your availability?
              </h3>
              <p className="text-gray-400">
                It varies. Big projects need advance booking. Quick reviews and assessments can usually happen within a week. Just reach out and we'll figure it out.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
