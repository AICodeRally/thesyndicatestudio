import { NoirCard, NoirCardContent, NoirCardTitle, NoirCardDescription } from '@/components/spm/cards/NoirCard';

export const metadata = {
  title: 'Services | Intelligent SPM',
  description: 'SPM consulting services: assessment, redesign, governance, ongoing operations.',
};

export default function ServicesPage() {
  return (
    <div className="w-full">
      <section className="relative py-32 overflow-hidden vignette">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-spm-black via-spm-purple-dark/20 to-spm-black" />
          <div className="absolute inset-0 crosshatch opacity-30" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-display text-white mb-6">SERVICES</h1>
          <p className="text-headline text-gray-200 max-w-3xl mx-auto">
            Assessment → Redesign → Governance → Ongoing Ops
          </p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
          <NoirCard variant="elevated">
            <NoirCardContent className="p-10">
              <NoirCardTitle className="text-3xl mb-4">Assessment</NoirCardTitle>
              <NoirCardDescription className="text-lg">
                Deep dive into your current SPM setup. What's working, what's broken, what's a time bomb.
                Includes vendor fit analysis, governance maturity, and implementation roadmap.
              </NoirCardDescription>
              <div className="mt-6">
                <span className="text-gray-500">Phase 3</span>
              </div>
            </NoirCardContent>
          </NoirCard>

          <NoirCard variant="elevated">
            <NoirCardContent className="p-10">
              <NoirCardTitle className="text-3xl mb-4">Redesign</NoirCardTitle>
              <NoirCardDescription className="text-lg">
                Full comp plan overhaul. Not the consultant framework. Not the vendor template.
                A design that fits your business model, your sales motion, and your governance reality.
              </NoirCardDescription>
              <div className="mt-6">
                <span className="text-gray-500">Phase 3</span>
              </div>
            </NoirCardContent>
          </NoirCard>

          <NoirCard variant="elevated">
            <NoirCardContent className="p-10">
              <NoirCardTitle className="text-3xl mb-4">Governance</NoirCardTitle>
              <NoirCardDescription className="text-lg">
                Build the operating model that prevents SPM chaos. Change management process,
                approval workflows, documentation standards, and the controls that keep comp from breaking.
              </NoirCardDescription>
              <div className="mt-6">
                <span className="text-gray-500">Phase 4</span>
              </div>
            </NoirCardContent>
          </NoirCard>

          <NoirCard variant="elevated">
            <NoirCardContent className="p-10">
              <NoirCardTitle className="text-3xl mb-4">Ongoing Ops</NoirCardTitle>
              <NoirCardDescription className="text-lg">
                Fractional SPM leadership. The experience you need without the full-time cost.
                Plan reviews, vendor management, escalation support, and the strategic guidance that keeps you ahead.
              </NoirCardDescription>
              <div className="mt-6">
                <span className="text-gray-500">Phase 5</span>
              </div>
            </NoirCardContent>
          </NoirCard>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-spm-purple-dark/20 via-spm-black to-spm-black border-t border-spm-purple-dark/30">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-headline-lg text-white mb-6">
            Ready to Talk?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            No sales pitch. No discovery call theater. Just a straight conversation about
            whether The Toddfather's approach fits your SPM reality.
          </p>
          <a
            href="mailto:todd@intelligentspm.com"
            className="inline-block px-12 py-4 bg-spm-purple hover:bg-spm-purple-light text-white text-lg font-semibold rounded-lg transition-all hover:shadow-purple-glow hover:scale-105"
          >
            Start the Conversation
          </a>
        </div>
      </section>
    </div>
  );
}
