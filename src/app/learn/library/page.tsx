import Link from 'next/link';
import { NoirCard, NoirCardContent, NoirCardTitle, NoirCardDescription } from '@/components/spm/cards/NoirCard';

export const metadata = {
  title: 'SPM Library | Learn',
  description: 'Articles, guides, and counsel from The Toddfather on SPM reality.',
};

const counselItems = [
  {
    slug: 'intelligent-sales-foundation',
    title: 'Intelligent Sales Foundation',
    description: 'The core framework for building sales compensation that drives the right behavior.',
    category: 'Strategy',
    difficulty: 'Foundation',
  },
  {
    slug: 'payout-curve-behavior-map',
    title: 'Payout Curve Behavior Map',
    description: 'How comp curves shape seller behavior. The timing effects, cliff risks, and acceleration gotchas.',
    category: 'Comp Design',
    difficulty: 'Intermediate',
  },
  {
    slug: 'planning-assumptions-smell-test',
    title: 'Planning Assumptions Smell Test',
    description: 'Red flags in your planning assumptions that predict rollout failure.',
    category: 'Governance',
    difficulty: 'Intermediate',
  },
  {
    slug: 'strategy-to-comp-translation',
    title: 'Strategy to Comp Translation',
    description: 'How to translate business strategy into actual comp mechanics that work.',
    category: 'Strategy',
    difficulty: 'Advanced',
  },
  {
    slug: 'where-ai-helps-hurts-spm',
    title: 'Where AI Helps (and Hurts) SPM',
    description: 'The truth about AI in sales compensation. What works, what is hype, what breaks.',
    category: 'AI & Analytics',
    difficulty: 'Foundation',
  },
];

export default function LibraryPage() {
  return (
    <div className="w-full">
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-spm-black via-spm-purple-dark/20 to-spm-black" />
          <div className="absolute inset-0 crosshatch opacity-30" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-display text-white mb-6">SPM LIBRARY</h1>
          <p className="text-headline text-gray-200 max-w-3xl mx-auto">
            Counsel, guides, and truth from two decades of SPM reality
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-12 bg-spm-black-soft border-y border-spm-purple-dark/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {['All', 'Strategy', 'Comp Design', 'Governance', 'AI & Analytics', 'Admin'].map((filter) => (
              <button
                key={filter}
                className={
                  filter === 'All'
                    ? 'px-4 py-2 bg-spm-purple text-white text-sm rounded-lg font-semibold'
                    : 'px-4 py-2 bg-spm-black border border-spm-purple-dark/30 text-gray-300 hover:text-white hover:border-spm-purple text-sm rounded-lg transition-colors'
                }
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-20 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {counselItems.map((item) => (
            <Link key={item.slug} href={`/counsel/${item.slug}`}>
              <NoirCard variant="interactive" hover className="h-full">
                <NoirCardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-spm-purple font-semibold">
                      {item.category}
                    </span>
                    <span className="text-xs px-2 py-1 bg-spm-purple/20 text-spm-purple rounded">
                      {item.difficulty}
                    </span>
                  </div>
                  <NoirCardTitle className="text-xl mb-3">
                    {item.title}
                  </NoirCardTitle>
                  <NoirCardDescription>
                    {item.description}
                  </NoirCardDescription>
                  <div className="mt-4 text-spm-purple hover:text-spm-purple-light font-semibold transition-colors text-sm">
                    Read Counsel →
                  </div>
                </NoirCardContent>
              </NoirCard>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
