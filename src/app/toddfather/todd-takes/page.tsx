import Link from 'next/link';
import { NoirCard, NoirCardContent, NoirCardTitle, NoirCardDescription } from '@/components/spm/cards/NoirCard';

export const metadata = {
  title: 'Todd Takes | The Toddfather',
  description: 'Weekly short-form video insights on SPM reality: comp design failures, governance, and how AI exposes broken plans.',
};

export default function ToddTakesPage() {
  const contentPillars = [
    {
      title: 'SPM Reality Checks',
      description: 'What people think works vs what actually does.',
      examples: [
        'Why accelerators break forecasting',
        'The quiet way draw programs destroy trust',
        'Why most quota relief policies are mathematically unfair',
      ],
      color: 'text-spm-purple',
      bg: 'bg-spm-purple/5',
    },
    {
      title: 'AI × Compensation',
      description: 'Real AI applications, not slideware.',
      examples: [
        'Where AI helps comp design — and where it absolutely shouldn\'t',
        'Why LLMs fail without plan math constraints',
        'Human override is not optional in SPM AI',
      ],
      color: 'text-spm-orange',
      bg: 'bg-spm-orange/5',
    },
    {
      title: 'Behavioral Mechanics',
      description: 'Pay drives behavior whether you admit it or not.',
      examples: [
        'Your comp plan is your operating system',
        'Why reps optimize for certainty, not upside',
        'SPIFs are dopamine, not strategy',
      ],
      color: 'text-spm-copper',
      bg: 'bg-spm-copper/5',
    },
    {
      title: 'Governance & Control',
      description: 'The stuff nobody wants to fund — until it\'s too late.',
      examples: [
        'Auditability is not bureaucracy',
        'Why comp disputes are design failures',
        'What "defensible payouts" actually means',
      ],
      color: 'text-spm-purple-light',
      bg: 'bg-spm-purple-light/5',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-spm-black via-spm-purple-dark/20 to-spm-black" />
          <div className="absolute inset-0 crosshatch opacity-30" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-display text-transparent bg-clip-text bg-gradient-to-r from-spm-purple via-spm-orange to-spm-copper mb-6">
            TODD TAKES
          </h1>
          <p className="text-headline text-gray-100 max-w-3xl mx-auto">
            Weekly short-form video insights on comp design failures, governance, and SPM reality.
          </p>
        </div>
      </section>

      {/* Format Section */}
      <section className="py-20 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <NoirCard variant="elevated">
            <NoirCardContent className="p-12">
              <h2 className="text-headline-lg text-spm-purple mb-8">The Format</h2>
              <div className="space-y-6 text-gray-300">
                <div className="border-l-4 border-spm-purple pl-6">
                  <h3 className="text-lg font-headline text-white mb-2">Length</h3>
                  <p className="text-sm">4–7 minutes. Sharp, focused, no filler.</p>
                </div>
                <div className="border-l-4 border-spm-orange pl-6">
                  <h3 className="text-lg font-headline text-white mb-2">Delivery</h3>
                  <p className="text-sm">Avatar (Toddfather) + your voice. Black background. High contrast.</p>
                </div>
                <div className="border-l-4 border-spm-copper pl-6">
                  <h3 className="text-lg font-headline text-white mb-2">Cadence</h3>
                  <p className="text-sm">Weekly. Recorded, published, done. No streaming theater.</p>
                </div>
                <div className="border-l-4 border-spm-purple-light pl-6">
                  <h3 className="text-lg font-headline text-white mb-2">Structure</h3>
                  <p className="text-sm">Cold open → Reality statement → Mechanism → Takeaway → Soft close</p>
                </div>
              </div>
            </NoirCardContent>
          </NoirCard>
        </div>
      </section>

      {/* Content Pillars */}
      <section className="py-20 bg-spm-black-soft">
        <div className="container mx-auto px-6">
          <h2 className="text-headline-lg text-center text-white mb-16">Content Pillars</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {contentPillars.map((pillar, idx) => (
              <NoirCard key={idx} variant="interactive" hover>
                <NoirCardContent className={`p-8 ${pillar.bg}`}>
                  <NoirCardTitle className={`mb-2 ${pillar.color}`}>{pillar.title}</NoirCardTitle>
                  <NoirCardDescription className="mb-4">{pillar.description}</NoirCardDescription>
                  <div className="space-y-2">
                    {pillar.examples.map((example, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className={`flex-shrink-0 ${pillar.color}`}>•</span>
                        <span>{example}</span>
                      </div>
                    ))}
                  </div>
                </NoirCardContent>
              </NoirCard>
            ))}
          </div>
        </div>
      </section>

      {/* Example Structure */}
      <section className="py-20 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-headline-lg text-white mb-8">Example: Todd Takes Structure</h2>
          <NoirCard variant="elevated">
            <NoirCardContent className="p-12 space-y-8">
              <div>
                <h3 className="text-sm font-headline text-spm-purple-light mb-2 uppercase tracking-wider">Cold Open (10–15s)</h3>
                <p className="text-gray-300 italic mb-2">Start with friction:</p>
                <p className="text-gray-200 font-mono text-sm bg-spm-black/50 p-4 rounded-lg">
                  "If your AI needs training data to understand your comp plan, you already lost."
                </p>
              </div>

              <div>
                <h3 className="text-sm font-headline text-spm-purple-light mb-2 uppercase tracking-wider">Reality Statement</h3>
                <p className="text-gray-300 italic mb-2">Name the misconception:</p>
                <p className="text-gray-200 font-mono text-sm bg-spm-black/50 p-4 rounded-lg">
                  "Most SPM tools assume plans are coherent. They're not."
                </p>
              </div>

              <div>
                <h3 className="text-sm font-headline text-spm-purple-light mb-2 uppercase tracking-wider">Mechanism</h3>
                <p className="text-gray-300 italic mb-2">Explain why — briefly (one system flaw, one behavioral effect, one consequence):</p>
                <p className="text-gray-200 font-mono text-sm bg-spm-black/50 p-4 rounded-lg">
                  "Plans layer exceptions on exceptions. AI can't parse the intent. It trains on noise."
                </p>
              </div>

              <div>
                <h3 className="text-sm font-headline text-spm-purple-light mb-2 uppercase tracking-wider">Takeaway</h3>
                <p className="text-gray-300 italic mb-2">Clean mental model:</p>
                <p className="text-gray-200 font-mono text-sm bg-spm-black/50 p-4 rounded-lg">
                  "Comp plans aren't incentives. They're constraints."
                </p>
              </div>

              <div>
                <h3 className="text-sm font-headline text-spm-purple-light mb-2 uppercase tracking-wider">Close (soft)</h3>
                <p className="text-gray-300 italic mb-2">No CTA begging:</p>
                <p className="text-gray-200 font-mono text-sm bg-spm-black/50 p-4 rounded-lg">
                  "This is why intelligent SPM starts with math and governance — not dashboards."
                </p>
              </div>
            </NoirCardContent>
          </NoirCard>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-20 bg-spm-black-soft">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <NoirCard variant="elevated">
              <NoirCardContent className="p-12 text-center">
                <h2 className="text-2xl font-headline bg-gradient-to-r from-spm-purple to-spm-orange bg-clip-text text-transparent mb-4">
                  Todd Takes Coming Soon
                </h2>
                <p className="text-gray-200 mb-8">
                  Recording studio is being set up. Avatar is locked. First episode in production.
                </p>
                <p className="text-gray-300 mb-8">
                  <span className="font-semibold">Status:</span> Avatar framework defined. Content pillars locked.
                  Recording begins next week.
                </p>
                <Link
                  href="/syndicate"
                  className="inline-block px-8 py-3 bg-spm-purple hover:bg-spm-purple-light text-white rounded-lg font-semibold transition-all"
                >
                  Get Notified When Live
                </Link>
              </NoirCardContent>
            </NoirCard>
          </div>
        </div>
      </section>
    </div>
  );
}
