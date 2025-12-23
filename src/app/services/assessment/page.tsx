import Link from 'next/link';
import { NoirCard, NoirCardContent, NoirCardTitle, NoirCardDescription } from '@/components/spm/cards/NoirCard';

export const metadata = { title: 'SPM Assessment | Services' };

export default function AssessmentPage() {
  return (
    <div className="w-full">
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-spm-black via-spm-purple-dark/20 to-spm-black" />
          <div className="absolute inset-0 crosshatch opacity-30" />
        </div>
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-display text-white mb-6">SPM ASSESSMENT</h1>
          <p className="text-headline text-gray-200 max-w-3xl mx-auto">
            Deep dive into your current setup. What works, what's broken, what's a time bomb.
          </p>
        </div>
      </section>
      <section className="py-20 container mx-auto px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <NoirCard variant="elevated">
            <NoirCardContent className="p-12">
              <h2 className="text-headline-lg text-spm-purple-light mb-6">What You Get</h2>
              <div className="space-y-6 text-gray-300">
                <div className="border-l-4 border-spm-purple pl-6">
                  <h3 className="text-xl font-headline text-white mb-2">Comp Plan Analysis</h3>
                  <p>Full teardown of your current plan. What's working, what's creating bad behavior, what's about to break.</p>
                </div>
                <div className="border-l-4 border-spm-copper pl-6">
                  <h3 className="text-xl font-headline text-white mb-2">Vendor Fit Analysis</h3>
                  <p>If you're evaluating SPM systems, we'll tell you which vendor actually fits your use case (not who has the best demo).</p>
                </div>
                <div className="border-l-4 border-spm-gold pl-6">
                  <h3 className="text-xl font-headline text-white mb-2">Governance Maturity</h3>
                  <p>Where you stand on the maturity model. What controls are missing. What's going to cause chaos at scale.</p>
                </div>
                <div className="border-l-4 border-spm-purple-light pl-6">
                  <h3 className="text-xl font-headline text-white mb-2">Implementation Roadmap</h3>
                  <p>Prioritized recommendations. What to fix now, what to fix later, what to live with.</p>
                </div>
              </div>
            </NoirCardContent>
          </NoirCard>
          <NoirCard variant="interactive" hover>
            <NoirCardContent className="p-12 text-center">
              <h2 className="text-headline-lg text-white mb-6">Ready to Start?</h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                No sales pitch. No discovery call theater. Just a straight conversation about your SPM reality.
              </p>
              <a href="mailto:todd@intelligentspm.com?subject=SPM Assessment" className="inline-block px-12 py-4 bg-spm-purple hover:bg-spm-purple-light text-white text-lg font-semibold rounded-lg transition-all hover:shadow-purple-glow">
                Start the Conversation
              </a>
            </NoirCardContent>
          </NoirCard>
        </div>
      </section>
    </div>
  );
}
