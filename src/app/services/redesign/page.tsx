import { NoirCard, NoirCardContent } from '@/components/spm/cards/NoirCard';

export const metadata = { title: 'Comp Plan Redesign | Services' };

export default function RedesignPage() {
  return (
    <div className="w-full">
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-spm-black via-spm-purple-dark/20 to-spm-black" />
          <div className="absolute inset-0 crosshatch opacity-30" />
        </div>
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-display text-white mb-6">PLAN REDESIGN</h1>
          <p className="text-headline text-gray-200 max-w-3xl mx-auto">
            Not the consultant framework. Not the vendor template. A design that fits your reality.
          </p>
        </div>
      </section>
      <section className="py-20 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <NoirCard variant="elevated">
            <NoirCardContent className="p-12">
              <h2 className="text-headline-lg text-spm-purple-light mb-6">Full Comp Plan Overhaul</h2>
              <p className="text-gray-300 text-lg mb-8">
                When your current plan isn't salvageable, you need a redesign. Not a template. A design that fits your business model, sales motion, and governance reality.
              </p>
              <div className="space-y-4 text-gray-300">
                <div className="border-l-4 border-spm-purple pl-6">
                  <h3 className="text-lg font-headline text-white mb-2">Discovery</h3>
                  <p className="text-sm">Understand your sales motion, revenue model, and strategic objectives. What behavior do you actually need?</p>
                </div>
                <div className="border-l-4 border-spm-copper pl-6">
                  <h3 className="text-lg font-headline text-white mb-2">Design</h3>
                  <p className="text-sm">Build comp structure that drives the right behavior. Quotas, accelerators, splits, territories - designed for your reality.</p>
                </div>
                <div className="border-l-4 border-spm-gold pl-6">
                  <h3 className="text-lg font-headline text-white mb-2">Validation</h3>
                  <p className="text-sm">Model the plan against historical data. Find the gotchas before rollout. Stress-test edge cases.</p>
                </div>
                <div className="border-l-4 border-spm-purple-light pl-6">
                  <h3 className="text-lg font-headline text-white mb-2">Documentation</h3>
                  <p className="text-sm">Clear plan documentation. Admin guide. Dispute resolution framework. Everything you need to run it.</p>
                </div>
              </div>
              <div className="mt-8 text-center">
                <a href="mailto:todd@intelligentspm.com?subject=Plan Redesign" className="inline-block px-12 py-4 bg-spm-purple hover:bg-spm-purple-light text-white text-lg font-semibold rounded-lg transition-all">
                  Start Redesign Conversation
                </a>
              </div>
            </NoirCardContent>
          </NoirCard>
        </div>
      </section>
    </div>
  );
}
