import { NoirCard, NoirCardContent, NoirCardTitle, NoirCardDescription } from '@/components/spm/cards/NoirCard';

export const metadata = {
  title: 'Contact | Intelligent SPM',
  description: 'Get in touch with The Toddfather. No sales pitch. Just straight talk about SPM reality.',
};

export default function ContactPage() {
  return (
    <div className="w-full">
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-spm-black via-spm-purple-dark/20 to-spm-black" />
          <div className="absolute inset-0 crosshatch opacity-30" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-display text-white mb-6">CONTACT</h1>
          <p className="text-headline text-gray-200 max-w-3xl mx-auto">
            No sales pitch. No discovery call theater. Just straight talk.
          </p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <NoirCard variant="elevated">
            <NoirCardContent className="p-12">
              <NoirCardTitle className="text-3xl mb-6 text-center">
                Start the Conversation
              </NoirCardTitle>

              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-headline text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-spm-black border-2 border-spm-purple-dark/30 rounded-lg text-white placeholder-gray-500 focus:border-spm-purple outline-none transition-colors"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-headline text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-spm-black border-2 border-spm-purple-dark/30 rounded-lg text-white placeholder-gray-500 focus:border-spm-purple outline-none transition-colors"
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-headline text-gray-300 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-spm-black border-2 border-spm-purple-dark/30 rounded-lg text-white placeholder-gray-500 focus:border-spm-purple outline-none transition-colors"
                    placeholder="Acme Corp"
                  />
                </div>

                <div>
                  <label className="block text-sm font-headline text-gray-300 mb-2">
                    What's on your mind?
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 bg-spm-black border-2 border-spm-purple-dark/30 rounded-lg text-white placeholder-gray-500 focus:border-spm-purple outline-none transition-colors resize-none"
                    placeholder="Tell me about your SPM situation..."
                  />
                </div>
              </div>

              <button
                className="w-full px-8 py-4 bg-spm-purple hover:bg-spm-purple-light text-white text-lg font-semibold rounded-lg transition-all hover:shadow-purple-glow hover:scale-105"
                disabled
              >
                Send Message (Coming Soon)
              </button>

              <div className="mt-8 pt-8 border-t border-spm-purple-dark/20">
                <h3 className="text-lg font-headline text-spm-purple mb-4">
                  Direct Contact
                </h3>
                <div className="space-y-3 text-gray-300">
                  <p>
                    <span className="text-gray-500">Email:</span>{' '}
                    <a href="mailto:todd@intelligentspm.com" className="text-spm-purple hover:text-spm-purple-light transition-colors">
                      todd@intelligentspm.com
                    </a>
                  </p>
                  <p className="text-sm text-gray-400">
                    Response time: Usually within 24 hours. If it's urgent, say so in the subject line.
                  </p>
                </div>
              </div>
            </NoirCardContent>
          </NoirCard>
        </div>
      </section>
    </div>
  );
}
