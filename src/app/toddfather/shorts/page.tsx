import Link from 'next/link';
import { NoirCard, NoirCardContent, NoirCardTitle, NoirCardDescription } from '@/components/spm/cards/NoirCard';

export const metadata = {
  title: 'Shorts | The Toddfather',
  description: '30–45 second clips from Todd Takes and Ask Todd Live. One sharp idea per clip. Built for social, built for learning.',
};

export default function ShortsPage() {
  const shortCategories = [
    {
      name: 'SPM Reality',
      count: 'TBD',
      color: 'text-spm-purple',
      bg: 'bg-spm-purple/10',
    },
    {
      name: 'AI × Comp',
      count: 'TBD',
      color: 'text-spm-orange',
      bg: 'bg-spm-orange/10',
    },
    {
      name: 'Governance',
      count: 'TBD',
      color: 'text-spm-copper',
      bg: 'bg-spm-copper/10',
    },
    {
      name: 'Behavior',
      count: 'TBD',
      color: 'text-spm-purple-light',
      bg: 'bg-spm-purple-light/10',
    },
  ];

  const exampleStructure = {
    title: 'Most comp plans reward compliance, not performance.',
    explanation: 'That\'s because quotas lag reality.',
    consequence: 'And AI makes that lag impossible to hide.',
  };

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-spm-black via-spm-purple-dark/20 to-spm-black" />
          <div className="absolute inset-0 crosshatch opacity-30" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-display text-transparent bg-clip-text bg-gradient-to-r from-spm-copper via-spm-purple to-spm-orange mb-6">
            SHORTS
          </h1>
          <p className="text-headline text-gray-100 max-w-3xl mx-auto">
            30–45 second clips. One sharp idea. Punchline first. Built for social and learning.
          </p>
        </div>
      </section>

      {/* Format */}
      <section className="py-20 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <NoirCard variant="elevated">
            <NoirCardContent className="p-12">
              <h2 className="text-headline-lg text-spm-purple mb-8">The Format</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-headline text-white mb-4">Length</h3>
                  <p className="text-gray-300">30–45 seconds. No padding. No intros. Starts strong.</p>
                </div>

                <div>
                  <h3 className="text-lg font-headline text-white mb-4">Source</h3>
                  <p className="text-gray-300 mb-3">Clipped from Todd Takes and Ask Todd Live sessions.</p>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-spm-purple flex-shrink-0">•</span>
                      <span>Best moments from recorded takes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-spm-purple flex-shrink-0">•</span>
                      <span>Notable Q&A exchanges from live sessions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-spm-purple flex-shrink-0">•</span>
                      <span>Sharp conclusions and takeaways</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-headline text-white mb-4">Distribution</h3>
                  <p className="text-gray-300 mb-3">Built for everywhere:</p>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-spm-purple flex-shrink-0">•</span>
                      <span>LinkedIn video feed (max 60 sec)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-spm-purple flex-shrink-0">•</span>
                      <span>YouTube Shorts (max 60 sec)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-spm-purple flex-shrink-0">•</span>
                      <span>TikTok (if applicable)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-spm-purple flex-shrink-0">•</span>
                      <span>Embedded in Intelligent SPM site</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-headline text-white mb-4">Visual Rules</h3>
                  <p className="text-gray-300 mb-3">Keep them consistent and controlled:</p>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-spm-purple flex-shrink-0">•</span>
                      <span>Black background (match site aesthetic)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-spm-purple flex-shrink-0">•</span>
                      <span>White or purple Toddfather avatar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-spm-purple flex-shrink-0">•</span>
                      <span>High-contrast white subtitles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-spm-purple flex-shrink-0">•</span>
                      <span>Minimal motion. No kinetic typography.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </NoirCardContent>
          </NoirCard>
        </div>
      </section>

      {/* Example Structure */}
      <section className="py-20 bg-spm-black-soft">
        <div className="container mx-auto px-6">
          <h2 className="text-headline-lg text-center text-white mb-16">Example Short Structure</h2>
          <div className="max-w-3xl mx-auto">
            <NoirCard variant="elevated">
              <NoirCardContent className="p-12 space-y-8">
                <div className="bg-spm-purple/10 rounded-lg p-6 border-l-4 border-spm-purple">
                  <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold mb-2">
                    Line 1: Conclusion (punchline first)
                  </p>
                  <p className="text-white font-headline text-lg">
                    "{exampleStructure.title}"
                  </p>
                </div>

                <div className="bg-spm-orange/10 rounded-lg p-6 border-l-4 border-spm-orange">
                  <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold mb-2">
                    Line 2: Why (mechanics)
                  </p>
                  <p className="text-white font-headline text-lg">
                    "{exampleStructure.explanation}"
                  </p>
                </div>

                <div className="bg-spm-copper/10 rounded-lg p-6 border-l-4 border-spm-copper">
                  <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold mb-2">
                    Line 3: Consequence (so what)
                  </p>
                  <p className="text-white font-headline text-lg">
                    "{exampleStructure.consequence}"
                  </p>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 text-center">
                  <p className="text-gray-400 text-sm">
                    Duration: 30–40 seconds with subtitle timing optimized for mobile viewing
                  </p>
                </div>
              </NoirCardContent>
            </NoirCard>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 container mx-auto px-6">
        <h2 className="text-headline-lg text-center text-white mb-16">Short Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {shortCategories.map((category, idx) => (
            <NoirCard key={idx} variant="interactive" hover>
              <NoirCardContent className={`p-8 text-center ${category.bg}`}>
                <h3 className={`text-lg font-headline ${category.color} mb-2`}>{category.name}</h3>
                <p className="text-2xl font-headline text-white mb-2">{category.count}</p>
                <p className="text-xs text-gray-400">shorts</p>
              </NoirCardContent>
            </NoirCard>
          ))}
        </div>
      </section>

      {/* Strategy */}
      <section className="py-20 bg-spm-black-soft">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <NoirCard variant="elevated">
              <NoirCardContent className="p-12">
                <h2 className="text-headline-lg text-spm-purple mb-8">Distribution Strategy</h2>
                <div className="space-y-6 text-gray-300">
                  <p>
                    <span className="text-spm-orange font-semibold">Every week:</span> 1 Todd Takes episode produces
                    1–2 shorts (opening insight + conclusion).
                  </p>
                  <p>
                    <span className="text-spm-orange font-semibold">Every month:</span> Ask Todd Live produces
                    3–5 shorts (best Q&A moments).
                  </p>
                  <p>
                    <span className="text-spm-orange font-semibold">Publishing:</span> Staggered across LinkedIn,
                    YouTube, and site. Same core content, optimized per platform.
                  </p>
                  <p>
                    <span className="text-spm-orange font-semibold">Repurposing:</span> Every short becomes a blog
                    snippet + podcast quote + syndicate email pull-out.
                  </p>
                </div>
              </NoirCardContent>
            </NoirCard>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-20 container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <NoirCard variant="elevated">
            <NoirCardContent className="p-12 text-center">
              <h2 className="text-2xl font-headline bg-gradient-to-r from-spm-orange to-spm-purple bg-clip-text text-transparent mb-4">
                Shorts Library Coming Soon
              </h2>
              <p className="text-gray-200 mb-8">
                First Todd Takes and Ask Todd Live sessions will begin shipping shorts immediately.
              </p>
              <p className="text-gray-300 mb-8">
                <span className="font-semibold">Current status:</span> Recording pipeline set up. Clipping templates locked.
                Shorts will roll out weekly starting with first Todd Takes episode.
              </p>
              <Link
                href="/toddfather/todd-takes"
                className="inline-block px-8 py-3 bg-spm-purple hover:bg-spm-purple-light text-white rounded-lg font-semibold transition-all"
              >
                Watch Todd Takes
              </Link>
            </NoirCardContent>
          </NoirCard>
        </div>
      </section>
    </div>
  );
}
