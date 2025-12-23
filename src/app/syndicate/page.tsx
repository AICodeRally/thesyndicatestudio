import { NoirCard, NoirCardContent, NoirCardTitle, NoirCardDescription } from '@/components/spm/cards/NoirCard';

export const metadata = {
  title: 'The SPM Syndicate | Community',
  description: 'Join The SPM Syndicate: weekly reality, office hours, and the community that gets it.',
};

export default function SyndicatePage() {
  return (
    <div className="w-full">
      <section className="relative py-32 overflow-hidden vignette">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-spm-black via-spm-purple-dark/30 to-spm-black" />
          <div className="absolute inset-0 crosshatch opacity-40" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-display text-white mb-6">THE SYNDICATE</h1>
          <p className="text-headline text-gray-200 max-w-3xl mx-auto">
            The community of SPM professionals who know the reality
          </p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <NoirCard variant="elevated">
            <NoirCardContent className="p-12">
              <h2 className="text-headline-lg text-spm-purple mb-6">
                What The Syndicate Gets
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                <div>
                  <h3 className="text-lg font-headline text-white mb-2">Weekly Reality</h3>
                  <p>Email digest of SPM truth: vendor updates, implementation gotchas, governance patterns.</p>
                </div>
                <div>
                  <h3 className="text-lg font-headline text-white mb-2">Office Hours</h3>
                  <p>Monthly Q&A with The Toddfather. Bring your toughest SPM questions.</p>
                </div>
                <div>
                  <h3 className="text-lg font-headline text-white mb-2">Early Access</h3>
                  <p>First look at new tools, benchmarks, and vendor scorecards.</p>
                </div>
                <div>
                  <h3 className="text-lg font-headline text-white mb-2">The Network</h3>
                  <p>Connect with SPM professionals who've been there, solved that.</p>
                </div>
              </div>
            </NoirCardContent>
          </NoirCard>

          <NoirCard variant="interactive" hover>
            <NoirCardContent className="p-12 text-center">
              <h2 className="text-headline-lg text-white mb-4">
                Join The Syndicate
              </h2>
              <p className="text-gray-300 mb-8">
                Free. No spam. Just SPM reality delivered weekly.
              </p>
              <div className="max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-6 py-4 bg-spm-black border-2 border-spm-purple-dark/30 rounded-lg text-white placeholder-gray-500 focus:border-spm-purple outline-none mb-4"
                  disabled
                />
                <button
                  className="w-full px-8 py-4 bg-spm-purple hover:bg-spm-purple-light text-white font-semibold rounded-lg transition-all hover:shadow-purple-glow"
                  disabled
                >
                  Coming Soon
                </button>
              </div>
            </NoirCardContent>
          </NoirCard>
        </div>
      </section>
    </div>
  );
}
