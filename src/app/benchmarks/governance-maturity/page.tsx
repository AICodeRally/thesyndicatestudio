import { NoirCard, NoirCardContent } from '@/components/spm/cards/NoirCard';

export const metadata = { title: 'Governance Maturity | Benchmarks' };

export default function GovernanceMaturityPage() {
  return (
    <div className="w-full">
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-spm-black via-spm-purple-dark/20 to-spm-black" />
          <div className="absolute inset-0 crosshatch opacity-30" />
        </div>
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-display text-white mb-6">GOVERNANCE MATURITY</h1>
          <p className="text-headline text-gray-200 max-w-3xl mx-auto">
            Where does your SPM governance stand? Assessment model + roadmap.
          </p>
        </div>
      </section>
      <section className="py-20 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <NoirCard variant="elevated">
            <NoirCardContent className="p-12">
              <h2 className="text-headline-lg text-spm-purple mb-6">SPM Governance Maturity Model</h2>
              <p className="text-gray-300 text-lg mb-8">
                Five levels from chaos to excellence. Where does your SPM operation stand?
              </p>
              <div className="space-y-4">
                {[
                  { level: '1. Chaos', desc: 'No change process. Excel everywhere. Comp breaks quarterly.' },
                  { level: '2. Reactive', desc: 'SPM system in place but governance is ad-hoc. Fire-fighting mode.' },
                  { level: '3. Defined', desc: 'Change management process exists. Still manual, but documented.' },
                  { level: '4. Managed', desc: 'Automated workflows. Proper controls. Audit trails.' },
                  { level: '5. Optimized', desc: 'Continuous improvement. Predictive analytics. Strategic SPM.' },
                ].map((stage, i) => (
                  <div key={i} className="border-l-4 border-spm-purple pl-6 py-3">
                    <h3 className="text-lg font-headline text-white mb-1">{stage.level}</h3>
                    <p className="text-gray-400">{stage.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-8">
                Full maturity assessment model coming soon.
              </p>
            </NoirCardContent>
          </NoirCard>
        </div>
      </section>
    </div>
  );
}
