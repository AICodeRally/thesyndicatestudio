import { NewsletterSignup } from '@/components/NewsletterSignup';
import { NoirCard, NoirCardContent, NoirCardTitle } from '@/components/spm/cards/NoirCard';

export const metadata = {
  title: 'Subscribe | Intelligent SPM',
  description: 'Subscribe to The SPM Syndicate. Weekly reality on comp design, vendors, and governance.',
};

export default function SubscribePage() {
  return (
    <div className="w-full">
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-spm-black via-spm-purple-dark/30 to-spm-black" />
          <div className="absolute inset-0 crosshatch opacity-40" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-display text-white mb-6">SUBSCRIBE</h1>
          <p className="text-headline text-gray-200 max-w-3xl mx-auto">
            Join The SPM Syndicate. Weekly reality delivered.
          </p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <NoirCard variant="elevated">
              <NoirCardContent className="p-8">
                <NoirCardTitle className="mb-4">Weekly Digest</NoirCardTitle>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-spm-purple mt-1">•</span>
                    <span>Vendor scorecards (updated weekly)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-spm-purple mt-1">•</span>
                    <span>Implementation gotchas (real stories)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-spm-purple mt-1">•</span>
                    <span>Comp design patterns (what works)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-spm-purple mt-1">•</span>
                    <span>Governance reality (how to prevent chaos)</span>
                  </li>
                </ul>
              </NoirCardContent>
            </NoirCard>

            <NoirCard variant="elevated">
              <NoirCardContent className="p-8">
                <NoirCardTitle className="mb-4">Podcast Drops</NoirCardTitle>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-spm-copper mt-1">•</span>
                    <span>New episodes every week</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-spm-copper mt-1">•</span>
                    <span>Behind-the-scenes breakdowns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-spm-copper mt-1">•</span>
                    <span>Extended cuts and outtakes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-spm-copper mt-1">•</span>
                    <span>Q&A with The Toddfather</span>
                  </li>
                </ul>
              </NoirCardContent>
            </NoirCard>
          </div>

          <NewsletterSignup />

          <NoirCard variant="elevated">
            <NoirCardContent className="p-12 text-center">
              <h2 className="text-headline-lg text-white mb-4">
                The Toddfather Promise
              </h2>
              <div className="space-y-3">
                <p className="text-xl text-white font-semibold">No vendor spin.</p>
                <p className="text-xl text-white font-semibold">No consultant theater.</p>
                <p className="text-xl text-white font-semibold">No "best practice" bullshit.</p>
                <p className="text-2xl text-spm-purple mt-6">
                  Just the truth about what works, what breaks, and why.
                </p>
              </div>
            </NoirCardContent>
          </NoirCard>
        </div>
      </section>
    </div>
  );
}
