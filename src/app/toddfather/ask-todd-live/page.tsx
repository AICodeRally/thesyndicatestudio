import Link from 'next/link';
import { NoirCard, NoirCardContent, NoirCardTitle, NoirCardDescription } from '@/components/spm/cards/NoirCard';

export const metadata = {
  title: 'Ask Todd Live | The Toddfather',
  description: 'Monthly live Q&A with The Toddfather. Real questions. Unfiltered answers on comp design, governance, and SPM reality.',
};

export default function AskToddLivePage() {
  const sessions = [
    {
      title: 'Why Intelligent SPM Starts With What You Say No To',
      date: 'TBD',
      duration: '45–60 minutes',
      topics: [
        'What features actually matter in a comp plan',
        'When complexity is a red flag',
        'How to avoid engineering gotchas',
      ],
      status: 'Upcoming',
    },
  ];

  const questionCategories = [
    {
      title: 'Comp Design',
      examples: [
        'Is this plan fair?',
        'How would you model this?',
        'What would you kill first?',
      ],
    },
    {
      title: 'Governance',
      examples: [
        'How do we control exceptions?',
        'What auditing actually works?',
        'When does compliance become broken?',
      ],
    },
    {
      title: 'Implementation',
      examples: [
        'Why is our vendor failing?',
        'What does "configuration" really mean?',
        'How much custom code is too much?',
      ],
    },
    {
      title: 'AI & SPM',
      examples: [
        'Where does AI actually help?',
        'What should never be automated?',
        'How do we audit AI decisions?',
      ],
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
          <h1 className="text-display text-transparent bg-clip-text bg-gradient-to-r from-spm-orange via-spm-purple to-spm-copper mb-6">
            ASK TODD LIVE
          </h1>
          <p className="text-headline text-gray-100 max-w-3xl mx-auto">
            Monthly live Q&A. Your SPM questions. Unfiltered answers from The Toddfather.
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
                  <h3 className="text-lg font-headline text-white mb-2">Cadence</h3>
                  <p className="text-sm">Monthly. Always at the same time. Real people, real questions, real answers.</p>
                </div>
                <div className="border-l-4 border-spm-orange pl-6">
                  <h3 className="text-lg font-headline text-white mb-2">Duration</h3>
                  <p className="text-sm">45–60 minutes. Starts sharp. Ends sharp. No padding.</p>
                </div>
                <div className="border-l-4 border-spm-copper pl-6">
                  <h3 className="text-lg font-headline text-white mb-2">Topics</h3>
                  <p className="text-sm">Comp, governance, AI, SPM tools, career paths, implementation reality—anything SPM-adjacent.</p>
                </div>
                <div className="border-l-4 border-spm-purple-light pl-6">
                  <h3 className="text-lg font-headline text-white mb-2">Access</h3>
                  <p className="text-sm">Live for registered participants. Archived as video, podcast, and clipped shorts.</p>
                </div>
              </div>
            </NoirCardContent>
          </NoirCard>
        </div>
      </section>

      {/* Session Structure */}
      <section className="py-20 bg-spm-black-soft">
        <div className="container mx-auto px-6">
          <h2 className="text-headline-lg text-center text-white mb-16">Session Structure</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <NoirCard variant="interactive">
              <NoirCardContent className="p-8 bg-spm-purple/5">
                <div className="flex items-start gap-4">
                  <span className="text-3xl font-headline text-spm-purple">1</span>
                  <div>
                    <h3 className="text-lg font-headline text-white mb-2">Opening Thesis (5 min)</h3>
                    <p className="text-gray-300">One prepared idea. Sets the tone. Example: "This month's theme: why AI exposes bad comp design faster than humans ever could."</p>
                  </div>
                </div>
              </NoirCardContent>
            </NoirCard>

            <NoirCard variant="interactive">
              <NoirCardContent className="p-8 bg-spm-orange/5">
                <div className="flex items-start gap-4">
                  <span className="text-3xl font-headline text-spm-orange">2</span>
                  <div>
                    <h3 className="text-lg font-headline text-white mb-2">Live Questions (30–40 min)</h3>
                    <p className="text-gray-300 mb-3">Unfiltered, practical questions from the audience.</p>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-spm-orange flex-shrink-0">•</span>
                        <span>"Is this plan fair?"</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-spm-orange flex-shrink-0">•</span>
                        <span>"How would you model this?"</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-spm-orange flex-shrink-0">•</span>
                        <span>"What would you kill first?"</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </NoirCardContent>
            </NoirCard>

            <NoirCard variant="interactive">
              <NoirCardContent className="p-8 bg-spm-copper/5">
                <div className="flex items-start gap-4">
                  <span className="text-3xl font-headline text-spm-copper">3</span>
                  <div>
                    <h3 className="text-lg font-headline text-white mb-2">Todd's Line (5 min)</h3>
                    <p className="text-gray-300">One blunt conclusion. Example: "If your plan needs exceptions every quarter, it's not flexible — it's broken."</p>
                  </div>
                </div>
              </NoirCardContent>
            </NoirCard>

            <NoirCard variant="interactive">
              <NoirCardContent className="p-8 bg-spm-purple-light/5">
                <div className="flex items-start gap-4">
                  <span className="text-3xl font-headline text-spm-purple-light">4</span>
                  <div>
                    <h3 className="text-lg font-headline text-white mb-2">Hard Stop</h3>
                    <p className="text-gray-300">No rambling. Authority respects time.</p>
                  </div>
                </div>
              </NoirCardContent>
            </NoirCard>
          </div>
        </div>
      </section>

      {/* Question Categories */}
      <section className="py-20 container mx-auto px-6">
        <div className="container mx-auto">
          <h2 className="text-headline-lg text-center text-white mb-16">Question Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {questionCategories.map((category, idx) => (
              <NoirCard key={idx} variant="interactive" hover>
                <NoirCardContent className="p-8">
                  <NoirCardTitle className="text-spm-purple mb-4">{category.title}</NoirCardTitle>
                  <div className="space-y-3">
                    {category.examples.map((example, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-spm-purple flex-shrink-0">→</span>
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

      {/* Upcoming Sessions */}
      <section className="py-20 bg-spm-black-soft">
        <div className="container mx-auto px-6">
          <h2 className="text-headline-lg text-center text-white mb-16">Upcoming Sessions</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {sessions.map((session, idx) => (
              <NoirCard key={idx} variant="elevated">
                <NoirCardContent className="p-8">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-headline text-white mb-2">{session.title}</h3>
                      <p className="text-sm text-gray-400">{session.date} • {session.duration}</p>
                    </div>
                    <span className="text-xs px-3 py-1 bg-spm-orange/20 text-spm-orange rounded-full font-semibold">
                      {session.status}
                    </span>
                  </div>
                  <div className="space-y-2 mb-6">
                    {session.topics.map((topic, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-spm-orange flex-shrink-0">•</span>
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                  <button className="px-6 py-2 bg-spm-purple hover:bg-spm-purple-light text-white rounded-lg font-semibold transition-all text-sm">
                    Register to Join
                  </button>
                </NoirCardContent>
              </NoirCard>
            ))}
          </div>
        </div>
      </section>

      {/* Content Reuse */}
      <section className="py-20 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <NoirCard variant="elevated">
            <NoirCardContent className="p-12">
              <h2 className="text-headline-lg text-spm-purple mb-8">After Each Session</h2>
              <p className="text-gray-300 mb-8">
                Every Ask Todd Live is archived and clipped into multiple formats:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-l-4 border-spm-purple pl-6">
                  <h3 className="text-lg font-headline text-white mb-2">Full Video Archive</h3>
                  <p className="text-sm text-gray-300">Complete session available for registered members.</p>
                </div>
                <div className="border-l-4 border-spm-orange pl-6">
                  <h3 className="text-lg font-headline text-white mb-2">Podcast Feed</h3>
                  <p className="text-sm text-gray-300">Audio version added to The Toddfather podcast.</p>
                </div>
                <div className="border-l-4 border-spm-copper pl-6">
                  <h3 className="text-lg font-headline text-white mb-2">Shorts (3–5)</h3>
                  <p className="text-sm text-gray-300">30–45 second clips from the best moments.</p>
                </div>
                <div className="border-l-4 border-spm-purple-light pl-6">
                  <h3 className="text-lg font-headline text-white mb-2">Blog Transcript</h3>
                  <p className="text-sm text-gray-300">Full transcript published with key timestamps.</p>
                </div>
              </div>
            </NoirCardContent>
          </NoirCard>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-spm-purple-dark/20 via-spm-black to-spm-black border-t border-spm-purple-dark/30">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-headline-lg text-white mb-6">
            Register for Ask Todd Live
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the next monthly session. Get your SPM questions answered in real time, unfiltered and direct.
          </p>
          <Link
            href="/syndicate"
            className="inline-block px-12 py-4 bg-spm-purple hover:bg-spm-purple-light text-white text-lg font-semibold rounded-lg transition-all hover:shadow-purple-glow"
          >
            Get on the List
          </Link>
        </div>
      </section>
    </div>
  );
}
