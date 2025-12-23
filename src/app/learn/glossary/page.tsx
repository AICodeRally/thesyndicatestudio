import { NoirCard, NoirCardContent, NoirCardTitle, NoirCardDescription } from '@/components/spm/cards/NoirCard';

export const metadata = {
  title: 'SPM Glossary | Learn',
  description: 'The definitive dictionary of SPM terminology. No jargon, no vendor speak - just clear definitions.',
};

const glossaryTerms = [
  {
    term: 'Accelerator',
    definition: 'A payout multiplier that increases when performance exceeds a threshold. Commonly misunderstood as a revenue driver - actually a timing device that shapes when deals close, not which deals close.',
    category: 'Comp Design',
    aliases: ['Kicker', 'Multiplier', 'Uplift'],
    relatedTerms: ['Quota', 'Payout Curve', 'Attainment'],
    example: '100% accelerator at 100% quota means earning 2x on revenue beyond quota.',
  },
  {
    term: 'Quota',
    definition: 'The performance target used to calculate comp payout. Not the same as a forecast, a goal, or capacity. Quota is the number that determines what you earn.',
    category: 'Comp Design',
    aliases: ['Target', 'Goal (incorrect)'],
    relatedTerms: ['Attainment', 'Accelerator', 'Territory'],
    example: 'Annual quota of $1M ARR for an Enterprise AE. Hit $1M = 100% attainment.',
  },
  {
    term: 'Split',
    definition: 'Credit allocation across multiple reps on the same deal. The math that prevents "who gets credit" wars. Also the cause of most SPM disputes when done wrong.',
    category: 'Admin',
    aliases: ['Credit Split', 'Deal Split', 'Overlay Credit'],
    relatedTerms: ['Overlay', 'Territory', 'Crediting Rules'],
    example: 'AE gets 60%, SE gets 40% on a $100K deal. AE credited $60K, SE credited $40K.',
  },
  {
    term: 'Territory',
    definition: 'The defined market segment a rep can sell into. Can be geographic, account-based, vertical-based, or product-based. The boundary that determines who gets credit for what.',
    category: 'Governance',
    aliases: ['Patch', 'Book of Business', 'Assigned Accounts'],
    relatedTerms: ['Split', 'Coverage Model', 'Routing Rules'],
    example: 'West Coast Enterprise accounts with >$50M revenue in Financial Services vertical.',
  },
  {
    term: 'Attainment',
    definition: 'Performance as a percentage of quota. The number that determines where you land on the payout curve. 100% attainment = hit quota exactly.',
    category: 'Comp Design',
    aliases: ['Quota Attainment', 'Performance %'],
    relatedTerms: ['Quota', 'Payout Curve', 'Accelerator'],
    example: 'Closed $850K against $1M quota = 85% attainment.',
  },
  {
    term: 'Payout Curve',
    definition: 'The function that maps attainment to comp payout. Defines thresholds, accelerators, caps, and the behavior incentives built into your plan.',
    category: 'Comp Design',
    aliases: ['Comp Curve', 'Commission Structure', 'Payout Schedule'],
    relatedTerms: ['Accelerator', 'Attainment', 'Quota'],
    example: '0-70%: $0, 70-100%: 1x, 100-150%: 2x, 150%+: capped at 2x.',
  },
  {
    term: 'Measure',
    definition: 'The metric used to calculate comp. Revenue, bookings, ARR, pipeline, activity—whatever you pay on. The source of truth for "what counts."',
    category: 'Admin',
    aliases: ['Metric', 'KPI', 'Performance Measure'],
    relatedTerms: ['Quota', 'Crediting', 'Data Source'],
    example: 'New ARR (Annual Recurring Revenue) as primary measure for SaaS sales comp.',
  },
  {
    term: 'SPM System',
    definition: 'The software platform that calculates, tracks, and pays out sales compensation. Not your CRM. Not your ERP. The dedicated system for comp math.',
    category: 'Admin',
    aliases: ['Incentive Comp Platform', 'ICM System', 'Comp Platform'],
    relatedTerms: ['Vendor', 'Integration', 'Data Pipeline'],
    example: 'Vendors: Xactly, CaptivateIQ, Spiff, Varicent, SAP, Anaplan.',
  },
];

export default function GlossaryPage() {
  return (
    <div className="w-full">
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-spm-black via-spm-purple-dark/20 to-spm-black" />
          <div className="absolute inset-0 crosshatch opacity-30" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-display text-white mb-6">SPM GLOSSARY</h1>
          <p className="text-headline text-gray-200 max-w-3xl mx-auto">
            The definitive dictionary of SPM terminology
          </p>
        </div>
      </section>

      {/* Alphabet Navigation */}
      <section className="py-6 bg-spm-black-soft border-y border-spm-purple-dark/30 sticky top-16 z-40">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-2 justify-center text-xs">
            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map((letter) => (
              <a
                key={letter}
                href={`#${letter}`}
                className="w-8 h-8 flex items-center justify-center rounded border border-spm-purple-dark/30 text-gray-400 hover:bg-spm-purple hover:text-white transition-colors"
              >
                {letter}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Glossary Terms */}
      <section className="py-20 container mx-auto px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {glossaryTerms.map((item) => (
            <NoirCard key={item.term} variant="elevated" id={item.term[0].toUpperCase()}>
              <NoirCardContent className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-headline text-spm-purple mb-1">
                      {item.term}
                    </h3>
                    {item.aliases.length > 0 && (
                      <p className="text-xs text-gray-500">
                        Also known as: {item.aliases.join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="text-xs px-3 py-1 bg-spm-purple/20 text-spm-purple rounded">
                    {item.category}
                  </span>
                </div>

                <p className="text-gray-300 mb-4 leading-relaxed">
                  {item.definition}
                </p>

                {item.example && (
                  <div className="bg-spm-black/40 border border-spm-purple-dark/20 rounded-lg p-4 mb-4">
                    <p className="text-xs font-headline text-gray-500 mb-2">EXAMPLE</p>
                    <p className="text-sm text-gray-400">{item.example}</p>
                  </div>
                )}

                {item.relatedTerms.length > 0 && (
                  <div className="pt-4 border-t border-spm-purple-dark/20">
                    <p className="text-xs text-gray-500 mb-2">Related Terms:</p>
                    <div className="flex flex-wrap gap-2">
                      {item.relatedTerms.map((term) => (
                        <a
                          key={term}
                          href={`#${term[0]}`}
                          className="text-xs px-2 py-1 bg-spm-black border border-spm-purple-dark/30 text-spm-purple-light hover:bg-spm-purple hover:text-white rounded transition-colors"
                        >
                          {term}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </NoirCardContent>
            </NoirCard>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Missing a term? <a href="/contact" className="text-spm-purple hover:text-spm-purple-light transition-colors">Let us know →</a>
          </p>
        </div>
      </section>
    </div>
  );
}
