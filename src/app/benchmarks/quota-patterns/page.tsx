import { NoirCard, NoirCardContent } from '@/components/spm/cards/NoirCard';

export const metadata = { title: 'Quota Patterns | Benchmarks' };

export default function QuotaPatternsPage() {
  return (
    <div className="w-full">
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-spm-black via-spm-purple-dark/20 to-spm-black" />
          <div className="absolute inset-0 crosshatch opacity-30" />
        </div>
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-display text-white mb-6">QUOTA PATTERNS</h1>
          <p className="text-headline text-gray-200 max-w-3xl mx-auto">
            Distribution models, attainment curves, and the reality of quota setting
          </p>
        </div>
      </section>
      <section className="py-20 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <NoirCard variant="elevated">
            <NoirCardContent className="p-12">
              <h2 className="text-headline-lg text-spm-purple mb-6">Quota Pattern Benchmarks</h2>
              <p className="text-gray-300 text-lg mb-6">
                Real data on quota distribution, attainment curves, and allocation patterns across industries.
              </p>
              <div className="bg-spm-black/40 border border-spm-purple-dark/30 rounded-lg p-6">
                <h3 className="text-xl font-headline text-white mb-4">Coming Soon:</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Attainment distribution curves (what % hit quota)</li>
                  <li>• Top-down vs bottom-up allocation</li>
                  <li>• Quota frequency (annual vs quarterly vs monthly)</li>
                  <li>• Adjustment patterns (mid-year changes)</li>
                  <li>• Territory balance (coverage vs capacity)</li>
                </ul>
              </div>
            </NoirCardContent>
          </NoirCard>
        </div>
      </section>
    </div>
  );
}
