import { NoirCard, NoirCardContent, NoirCardTitle, NoirCardDescription } from '@/components/spm/cards/NoirCard';

export const metadata = {
  title: 'Analyze | Intelligent SPM',
  description: 'SPM analysis tools: Plan Check, simulators, calculators, and risk scoring.',
};

export default function AnalyzePage() {
  return (
    <div className="w-full">
      <section className="relative py-32 overflow-hidden vignette">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-spm-black via-spm-purple-dark/20 to-spm-black" />
          <div className="absolute inset-0 crosshatch opacity-30" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-display text-white mb-6">ANALYZE</h1>
          <p className="text-headline text-gray-200 max-w-3xl mx-auto">
            Tools to diagnose, simulate, and validate your comp plans before they break
          </p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <NoirCard variant="interactive" hover className="md:col-span-2">
            <NoirCardContent className="p-12 text-center">
              <NoirCardTitle className="text-3xl mb-4">Plan Check</NoirCardTitle>
              <NoirCardDescription className="text-lg mb-6">
                Upload your comp plan and get instant risk scoring, governance recommendations,
                and implementation reality checks. Free. No login required.
              </NoirCardDescription>
              <div className="mt-8">
                <span className="text-gray-500">Coming Soon - Phase 3</span>
              </div>
            </NoirCardContent>
          </NoirCard>

          <NoirCard variant="elevated">
            <NoirCardContent className="p-8">
              <NoirCardTitle>Deal Payout Calculator</NoirCardTitle>
              <NoirCardDescription>
                Model individual deal payouts across different scenarios. See the math before the reps do.
              </NoirCardDescription>
              <div className="mt-6">
                <span className="text-gray-500 text-sm">Phase 4</span>
              </div>
            </NoirCardContent>
          </NoirCard>

          <NoirCard variant="elevated">
            <NoirCardContent className="p-8">
              <NoirCardTitle>Split Manager (SSM)</NoirCardTitle>
              <NoirCardDescription>
                Model credit allocation across complex overlays. Prevent the "who gets credit" wars.
              </NoirCardDescription>
              <div className="mt-6">
                <span className="text-gray-500 text-sm">Phase 4</span>
              </div>
            </NoirCardContent>
          </NoirCard>

          <NoirCard variant="elevated">
            <NoirCardContent className="p-8">
              <NoirCardTitle>Quota Simulator</NoirCardTitle>
              <NoirCardDescription>
                Run what-if scenarios on quota distribution. See attainment curves before you commit.
              </NoirCardDescription>
              <div className="mt-6">
                <span className="text-gray-500 text-sm">Phase 5</span>
              </div>
            </NoirCardContent>
          </NoirCard>

          <NoirCard variant="elevated">
            <NoirCardContent className="p-8">
              <NoirCardTitle>Shadow Accounting</NoirCardTitle>
              <NoirCardDescription>
                Reconcile your SPM system against source systems. Find the discrepancies before comp runs.
              </NoirCardDescription>
              <div className="mt-6">
                <span className="text-gray-500 text-sm">Phase 6</span>
              </div>
            </NoirCardContent>
          </NoirCard>
        </div>
      </section>
    </div>
  );
}
