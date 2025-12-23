import { NoirCard, NoirCardContent, NoirCardTitle, NoirCardDescription } from '@/components/spm/cards/NoirCard';

export const metadata = {
  title: 'Vendor Scorecards | Intelligent SPM',
  description: 'SPM vendor reality: who\'s good at what, who breaks where, implementation truth.',
};

export default function VendorsPage() {
  return (
    <div className="w-full">
      <section className="relative py-32 overflow-hidden vignette">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-spm-black via-spm-purple-dark/20 to-spm-black" />
          <div className="absolute inset-0 crosshatch opacity-30" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-display text-white mb-6">VENDORS</h1>
          <p className="text-headline text-gray-200 max-w-3xl mx-auto">
            Who's good at what. Who breaks where. The implementation reality no one tells you.
          </p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <NoirCard variant="elevated">
            <NoirCardContent className="p-12">
              <h2 className="text-headline-lg text-spm-purple mb-6">
                The Vendor Scorecard System
              </h2>
              <div className="space-y-4 text-gray-300">
                <p className="text-lg">
                  Every SPM vendor has strengths. Every vendor has gotchas. The question is:
                  which gotchas can you live with, and which ones will sink your rollout?
                </p>
                <p className="text-lg">
                  The Toddfather's vendor scorecards cut through the marketing, the demos, and the
                  sales promises to deliver the truth: what works, what breaks, and why.
                </p>
                <div className="mt-8 p-6 bg-spm-black/40 rounded-lg border border-spm-purple-dark/30">
                  <h3 className="text-xl font-headline text-spm-purple mb-4">
                    Scorecard Coverage
                  </h3>
                  <ul className="space-y-2 text-gray-400">
                    <li>• Implementation Reality (not the demo)</li>
                    <li>• Integration Gotchas (the stuff that breaks)</li>
                    <li>• Admin Overhead (the hidden tax)</li>
                    <li>• Flexibility vs. Complexity (the tradeoff)</li>
                    <li>• When to Use (and when to avoid)</li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 text-center">
                <span className="text-gray-500">Vendor scorecards coming in Phase 2</span>
              </div>
            </NoirCardContent>
          </NoirCard>
        </div>
      </section>
    </div>
  );
}
