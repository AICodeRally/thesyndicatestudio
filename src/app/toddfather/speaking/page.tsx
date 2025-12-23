import { NoirCard, NoirCardContent, NoirCardTitle, NoirCardDescription } from '@/components/spm/cards/NoirCard';

export const metadata = {
  title: 'Speaking | The Toddfather',
  description: 'Keynotes, workshops, and executive sessions on SPM governance, comp strategy, and implementation reality.',
};

export default function SpeakingPage() {
  return (
    <div className="w-full">
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-spm-black via-spm-purple-dark/20 to-spm-black" />
          <div className="absolute inset-0 crosshatch opacity-30" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-display text-white mb-6">SPEAKING</h1>
          <p className="text-headline text-gray-200 max-w-3xl mx-auto">
            Keynotes, workshops, and executive sessions. No slides. No buzzwords. Just truth.
          </p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <NoirCard variant="elevated">
            <NoirCardContent className="p-12">
              <h2 className="text-headline-lg text-spm-purple mb-8 text-center">
                Speaking Topics
              </h2>

              <div className="space-y-6">
                <div className="border-l-4 border-spm-purple pl-6">
                  <h3 className="text-xl font-headline text-white mb-2">
                    SPM Governance: The Operating Model That Prevents Chaos
                  </h3>
                  <p className="text-gray-300">
                    How to build change management, approval workflows, and controls that scale.
                    For RevOps leaders, Finance teams, and SPM admins.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">60-90 min • Workshop or Keynote</p>
                </div>

                <div className="border-l-4 border-spm-purple pl-6">
                  <h3 className="text-xl font-headline text-white mb-2">
                    Vendor Reality: Who's Good at What, Who Breaks Where
                  </h3>
                  <p className="text-gray-300">
                    Real implementation truth about SPM vendors. Not the demo, not the sales pitch—what actually happens.
                    For teams evaluating vendors or fixing broken implementations.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">45-60 min • Keynote</p>
                </div>

                <div className="border-l-4 border-spm-purple pl-6">
                  <h3 className="text-xl font-headline text-white mb-2">
                    Comp Design Patterns: What Works, What Breaks, and Why
                  </h3>
                  <p className="text-gray-300">
                    Deep dive into quota models, accelerator structures, territory design, and the patterns that survive contact with reality.
                    For Sales Ops and Compensation teams.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">90 min • Workshop</p>
                </div>

                <div className="border-l-4 border-spm-purple pl-6">
                  <h3 className="text-xl font-headline text-white mb-2">
                    Executive Briefing: SPM as Strategic Lever
                  </h3>
                  <p className="text-gray-300">
                    How comp design shapes sales behavior, revenue outcomes, and operational complexity.
                    For CROs, CFOs, and executive teams.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">30-45 min • Executive Session</p>
                </div>
              </div>
            </NoirCardContent>
          </NoirCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <NoirCard variant="elevated">
              <NoirCardContent className="p-8">
                <NoirCardTitle className="mb-4">Format</NoirCardTitle>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-spm-purple mr-3">•</span>
                    <span>No PowerPoint slides (just conversation + whiteboard)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-spm-purple mr-3">•</span>
                    <span>No vendor marketing speak</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-spm-purple mr-3">•</span>
                    <span>No consultant frameworks</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-spm-purple mr-3">•</span>
                    <span>Just real examples, real patterns, real truth</span>
                  </li>
                </ul>
              </NoirCardContent>
            </NoirCard>

            <NoirCard variant="elevated">
              <NoirCardContent className="p-8">
                <NoirCardTitle className="mb-4">Audience</NoirCardTitle>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-spm-purple mr-3">•</span>
                    <span>Sales Performance Management teams</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-spm-purple mr-3">•</span>
                    <span>RevOps and Sales Operations leaders</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-spm-purple mr-3">•</span>
                    <span>CFO/CRO executive teams</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-spm-purple mr-3">•</span>
                    <span>Compensation and Finance teams</span>
                  </li>
                </ul>
              </NoirCardContent>
            </NoirCard>
          </div>

          <NoirCard variant="interactive" hover>
            <NoirCardContent className="p-12 text-center">
              <h2 className="text-headline-lg text-white mb-6">
                Book The Toddfather
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Conference keynote, internal workshop, or executive briefing. Let's talk about whether it's a fit.
              </p>
              <a
                href="mailto:todd@intelligentspm.com?subject=Speaking Inquiry"
                className="inline-block px-12 py-4 bg-spm-purple hover:bg-spm-purple-light text-white text-lg font-semibold rounded-lg transition-all hover:shadow-purple-glow hover:scale-105"
              >
                Start the Conversation
              </a>
            </NoirCardContent>
          </NoirCard>
        </div>
      </section>
    </div>
  );
}
