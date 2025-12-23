import { NoirCard, NoirCardContent, NoirCardTitle, NoirCardDescription } from '@/components/spm/cards/NoirCard';

export const metadata = {
  title: 'Payout Curves | Benchmarks',
  description: 'Analyze comp curves across industries. See what accelerates, what caps, what works.',
};

export default function PayoutCurvesPage() {
  return (
    <div className="w-full">
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-spm-black via-spm-purple-dark/20 to-spm-black" />
          <div className="absolute inset-0 crosshatch opacity-30" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-display text-white mb-6">PAYOUT CURVES</h1>
          <p className="text-headline text-gray-200 max-w-3xl mx-auto">
            Benchmark data on comp curves across industries
          </p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <NoirCard variant="elevated">
            <NoirCardContent className="p-12">
              <h2 className="text-headline-lg text-spm-purple mb-6">
                Payout Curve Benchmarks
              </h2>
              <div className="space-y-6 text-gray-300">
                <p className="text-lg">
                  The Toddfather is collecting real payout curve data across industries, company sizes, and sales motions.
                </p>
                <div className="bg-spm-black/40 border border-spm-purple-dark/30 rounded-lg p-6">
                  <h3 className="text-xl font-headline text-white mb-4">What You'll Get:</h3>
                  <ul className="space-y-2">
                    <li>• Threshold ranges (50%, 70%, 80% - what's common)</li>
                    <li>• Accelerator rates (1.5x, 2x, 2.5x by industry)</li>
                    <li>• Cap strategies (where to cap, when to uncap)</li>
                    <li>• Cliff gotchas (timing manipulation patterns)</li>
                    <li>• Decelerator data (rare but effective)</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-400">
                  Data collection in progress. Join The Syndicate to get early access when benchmarks drop.
                </p>
              </div>
            </NoirCardContent>
          </NoirCard>
        </div>
      </section>
    </div>
  );
}
