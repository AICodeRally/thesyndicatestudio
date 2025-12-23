import { NoirCard, NoirCardContent, NoirCardTitle, NoirCardDescription } from '@/components/spm/cards/NoirCard';

export const metadata = {
  title: 'Benchmarks | Intelligent SPM',
  description: 'SPM benchmarks: payout curves, quota patterns, governance maturity models.',
};

export default function BenchmarksPage() {
  return (
    <div className="w-full">
      <section className="relative py-32 overflow-hidden vignette">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-spm-black via-spm-purple-dark/20 to-spm-black" />
          <div className="absolute inset-0 crosshatch opacity-30" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-display text-white mb-6">BENCHMARKS</h1>
          <p className="text-headline text-gray-200 max-w-3xl mx-auto">
            Real data on what works: payout curves, quota patterns, and governance maturity
          </p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <NoirCard variant="interactive" hover>
            <NoirCardContent className="p-8">
              <NoirCardTitle>Payout Curves</NoirCardTitle>
              <NoirCardDescription>
                Analyze comp curves across industries. See what accelerates, what caps, what works.
              </NoirCardDescription>
              <div className="mt-6">
                <span className="text-gray-500 text-sm">Coming Soon</span>
              </div>
            </NoirCardContent>
          </NoirCard>

          <NoirCard variant="interactive" hover>
            <NoirCardContent className="p-8">
              <NoirCardTitle>Quota Patterns</NoirCardTitle>
              <NoirCardDescription>
                Distribution models, attainment curves, and the reality of quota setting.
              </NoirCardDescription>
              <div className="mt-6">
                <span className="text-gray-500 text-sm">Coming Soon</span>
              </div>
            </NoirCardContent>
          </NoirCard>

          <NoirCard variant="interactive" hover>
            <NoirCardContent className="p-8">
              <NoirCardTitle>Governance Maturity</NoirCardTitle>
              <NoirCardDescription>
                Where does your SPM governance stand? Assessment model + roadmap.
              </NoirCardDescription>
              <div className="mt-6">
                <span className="text-gray-500 text-sm">Coming Soon</span>
              </div>
            </NoirCardContent>
          </NoirCard>
        </div>
      </section>
    </div>
  );
}
