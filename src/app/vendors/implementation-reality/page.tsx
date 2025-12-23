import { NoirCard, NoirCardContent, NoirCardTitle, NoirCardDescription } from '@/components/spm/cards/NoirCard';

export const metadata = {
  title: 'Implementation Reality | Vendors',
};

export default function ImplementationRealityPage() {
  return (
    <div className="w-full">
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-spm-black via-spm-purple-dark/20 to-spm-black" />
          <div className="absolute inset-0 crosshatch opacity-30" />
        </div>
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-display text-white mb-6">IMPLEMENTATION REALITY</h1>
          <p className="text-headline text-gray-200 max-w-3xl mx-auto">
            What actually happens during SPM rollouts
          </p>
        </div>
      </section>
      <section className="py-20 container mx-auto px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <NoirCard variant="elevated">
            <NoirCardContent className="p-12">
              <h2 className="text-headline-lg text-spm-purple-light mb-6">The Truth About SPM Implementations</h2>
              <p className="text-gray-300 text-lg">
                Every SPM vendor promises smooth implementation. Here's what actually happens:
              </p>
            </NoirCardContent>
          </NoirCard>

          <NoirCard variant="elevated">
            <NoirCardContent className="p-8">
              <NoirCardTitle className="mb-4">Data Pipeline Takes 3x Longer</NoirCardTitle>
              <NoirCardDescription>
                Your CRM data is messier than you think. Territory gaps, product hierarchy mismatches, duplicate accounts. What vendor estimated at 2 weeks becomes 8 weeks of cleanup.
              </NoirCardDescription>
            </NoirCardContent>
          </NoirCard>

          <NoirCard variant="elevated">
            <NoirCardContent className="p-8">
              <NoirCardTitle className="mb-4">Configuration = Custom Code</NoirCardTitle>
              <NoirCardDescription>
                Your edge cases aren't supported. Split rules for overlays? Custom code. Promotion handling? Custom code. "Highly configurable" means billable professional services.
              </NoirCardDescription>
            </NoirCardContent>
          </NoirCard>

          <NoirCard variant="elevated">
            <NoirCardContent className="p-8">
              <NoirCardTitle className="mb-4">Testing Reveals Gotchas</NoirCardTitle>
              <NoirCardDescription>
                Demo looked perfect. Then you test with real data: territory changes don't work right, splits don't cascade, reporting doesn't match finance requirements.
              </NoirCardDescription>
            </NoirCardContent>
          </NoirCard>
        </div>
      </section>
    </div>
  );
}
