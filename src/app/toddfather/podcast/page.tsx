import Link from 'next/link';
import { NoirCard, NoirCardContent, NoirCardTitle, NoirCardDescription } from '@/components/spm/cards/NoirCard';

export const metadata = {
  title: 'The Toddfather Podcast | SPM Reality',
  description: 'Weekly episodes on SPM reality: vendor scorecards, implementation gotchas, comp design patterns that work.',
};

export default function PodcastPage() {
  return (
    <div className="w-full">
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-spm-black via-spm-purple-dark/30 to-spm-black" />
          <div className="absolute inset-0 crosshatch opacity-40" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-display text-white mb-6">THE PODCAST</h1>
          <p className="text-headline text-gray-200 max-w-3xl mx-auto">
            Weekly SPM reality. No fluff, no vendor spin, no consultant theater.
          </p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <NoirCard variant="elevated">
            <NoirCardContent className="p-12">
              <h2 className="text-headline-lg text-spm-purple mb-6">
                What You Get
              </h2>
              <div className="space-y-4 text-gray-300 text-lg">
                <p>
                  <strong className="text-white">Vendor Scorecards:</strong> Who's good at what, who breaks where, and the gotchas no one tells you in the demo.
                </p>
                <p>
                  <strong className="text-white">Implementation Reality:</strong> What actually happens during SPM rollouts. The failures, the surprises, the hidden costs.
                </p>
                <p>
                  <strong className="text-white">Comp Design Patterns:</strong> What works, what breaks, and why. Real patterns from real companies.
                </p>
                <p>
                  <strong className="text-white">Governance Truth:</strong> How to prevent SPM chaos. Process, controls, and the operating model that scales.
                </p>
              </div>
            </NoirCardContent>
          </NoirCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <NoirCard variant="interactive" hover>
              <NoirCardContent className="p-8 text-center">
                <NoirCardTitle>Latest Episodes</NoirCardTitle>
                <NoirCardDescription className="mb-6">
                  Browse all episodes from The Toddfather podcast. New episodes weekly.
                </NoirCardDescription>
                <Link href="/episodes" className="text-spm-purple hover:text-spm-purple-light font-semibold transition-colors">
                  View All Episodes →
                </Link>
              </NoirCardContent>
            </NoirCard>

            <NoirCard variant="interactive" hover>
              <NoirCardContent className="p-8 text-center">
                <NoirCardTitle>Subscribe</NoirCardTitle>
                <NoirCardDescription className="mb-6">
                  Get new episodes delivered. Plus weekly SPM reality digest.
                </NoirCardDescription>
                <Link href="/syndicate" className="text-spm-purple hover:text-spm-purple-light font-semibold transition-colors">
                  Join The Syndicate →
                </Link>
              </NoirCardContent>
            </NoirCard>
          </div>

          <NoirCard variant="elevated">
            <NoirCardContent className="p-12">
              <h2 className="text-headline-lg text-spm-purple mb-6 text-center">
                The Toddfather Promise
              </h2>
              <div className="space-y-4 text-center">
                <p className="text-xl text-white font-semibold">No vendor spin.</p>
                <p className="text-xl text-white font-semibold">No consultant theater.</p>
                <p className="text-xl text-white font-semibold">No "best practice" bullshit.</p>
                <p className="text-2xl text-spm-purple mt-8">
                  Just the truth about what works, what breaks, and why.
                </p>
              </div>
            </NoirCardContent>
          </NoirCard>
        </div>
      </section>
    </div>
  );
}
