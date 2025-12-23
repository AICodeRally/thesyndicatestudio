import Link from 'next/link';
import { NoirCard, NoirCardContent, NoirCardTitle, NoirCardDescription } from '@/components/spm/cards/NoirCard';

export const metadata = {
  title: 'Vendor Scorecards | Intelligent SPM',
  description: 'Real implementation truth about SPM vendors. Who\'s good at what, who breaks where.',
};

const vendors = [
  {
    name: 'Xactly',
    slug: 'xactly',
    rating: 3.5,
    bestFor: ['Enterprise scale', 'Complex hierarchies', 'Regulatory compliance'],
    worstFor: ['Fast iteration', 'Modern UX', 'API flexibility'],
    status: 'Coming Soon',
  },
  {
    name: 'CaptivateIQ',
    slug: 'captivateiq',
    rating: 4.0,
    bestFor: ['Modern UI/UX', 'Fast implementation', 'Technical teams'],
    worstFor: ['Mega-enterprise scale', 'Legacy integrations'],
    status: 'Coming Soon',
  },
  {
    name: 'Spiff',
    slug: 'spiff',
    rating: 3.8,
    bestFor: ['SMB/Mid-market', 'Speed to value', 'Sales rep UX'],
    worstFor: ['Complex comp plans', 'Deep customization'],
    status: 'Coming Soon',
  },
  {
    name: 'Varicent',
    slug: 'varicent',
    rating: 3.7,
    bestFor: ['Pharmaceutical', 'Complex territories', 'Legacy migrations'],
    worstFor: ['Modern UX', 'Developer experience'],
    status: 'Coming Soon',
  },
];

export default function VendorScorecardsPage() {
  return (
    <div className="w-full">
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-spm-black via-spm-purple-dark/20 to-spm-black" />
          <div className="absolute inset-0 crosshatch opacity-30" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-display text-white mb-6">VENDOR SCORECARDS</h1>
          <p className="text-headline text-gray-200 max-w-3xl mx-auto">
            Implementation reality. Not the demo, not the sales pitch.
          </p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <NoirCard variant="elevated" className="mb-12">
            <NoirCardContent className="p-12">
              <h2 className="text-headline-lg text-spm-purple mb-6 text-center">
                The Scorecard System
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl mb-3">✓</div>
                  <h3 className="text-lg font-headline text-white mb-2">Best For</h3>
                  <p className="text-sm text-gray-400">
                    Where this vendor excels. The use cases where it's the right choice.
                  </p>
                </div>
                <div>
                  <div className="text-4xl mb-3">✗</div>
                  <h3 className="text-lg font-headline text-white mb-2">Worst For</h3>
                  <p className="text-sm text-gray-400">
                    Where this vendor breaks. The gotchas that sink implementations.
                  </p>
                </div>
                <div>
                  <div className="text-4xl mb-3">⚠</div>
                  <h3 className="text-lg font-headline text-white mb-2">Reality Check</h3>
                  <p className="text-sm text-gray-400">
                    What actually happens. Not the demo, not the promise.
                  </p>
                </div>
              </div>
            </NoirCardContent>
          </NoirCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {vendors.map((vendor) => (
              <NoirCard key={vendor.slug} variant="interactive" hover>
                <NoirCardContent className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <NoirCardTitle className="text-2xl">{vendor.name}</NoirCardTitle>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-5 h-5 ${star <= vendor.rating ? 'text-spm-purple' : 'text-gray-600'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-headline text-green-400 mb-2">✓ Best For:</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      {vendor.bestFor.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-headline text-red-400 mb-2">✗ Worst For:</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      {vendor.worstFor.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-spm-purple-dark/20 text-center">
                    <span className="text-sm text-gray-500">{vendor.status}</span>
                  </div>
                </NoirCardContent>
              </NoirCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
