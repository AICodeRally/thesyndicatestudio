import Link from 'next/link';
import Image from 'next/image';
import {
  NoirCard,
  NoirCardContent,
  NoirCardTitle,
  NoirCardDescription,
} from '@/components/spm/cards/NoirCard';

export const metadata = {
  title: 'The Toddfather | SPM Authority',
  description: 'Meet The Toddfather - the voice behind Intelligent SPM. Podcast, speaking, and the reality of sales compensation.',
};

export default function ToddFatherPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* The Toddfather Noir Panel - Pointing */}
          <Image
            src="/images/noir/toddfather_noir_panel_3_right.png"
            alt="The Toddfather"
            fill
            className="object-cover opacity-25"
            priority
            quality={90}
          />

          {/* Noir overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-spm-black/80 via-spm-purple-dark/40 to-spm-black/80" />
          <div className="absolute inset-0 crosshatch opacity-25" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(10,10,10,0.7)_100%)]" />
        </div>

        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-display text-white mb-8">
              THE TODDFATHER
            </h1>
            <p className="text-headline text-gray-200 mb-6">
              The Voice Behind Intelligent SPM
            </p>
            <p className="text-xl text-gray-300 leading-relaxed">
              Twenty years of SPM reality. No fluff, no vendor spin, no consultant theater.
              Just the truth about comp design, governance, and what actually works.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <NoirCard variant="elevated">
            <NoirCardContent className="p-12">
              <h2 className="text-headline-lg text-spm-purple mb-8">
                Who Is The Toddfather?
              </h2>
              <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                <p>
                  The Toddfather is the authoritative voice on Sales Performance Management (SPM) -
                  cutting through vendor marketing, consultant frameworks, and implementation theater
                  to deliver the reality of what works and what breaks.
                </p>
                <p>
                  With two decades of experience across every SPM platform, comp structure, and
                  governance model, The Toddfather has seen it all: the rollout disasters, the
                  "best practice" failures, the vendor promises that vaporize post-contract.
                </p>
                <p>
                  This isn't another thought leadership brand. It's a clearing house for SPM truth -
                  where comp professionals, revenue leaders, and governance teams get the real story
                  before they make million-dollar mistakes.
                </p>
              </div>
            </NoirCardContent>
          </NoirCard>
        </div>
      </section>

      {/* What The Toddfather Does */}
      <section className="py-20 bg-spm-black-soft">
        <div className="container mx-auto px-6">
          <h2 className="text-headline-lg text-center text-white mb-16">
            What The Toddfather Delivers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <NoirCard variant="interactive" hover>
              <NoirCardContent className="p-8">
                <NoirCardTitle>The Podcast</NoirCardTitle>
                <NoirCardDescription className="mb-6">
                  Weekly episodes breaking down SPM reality: vendor scorecards, implementation
                  gotchas, comp design patterns that work (and the ones that fail).
                </NoirCardDescription>
                <Link
                  href="/toddfather/podcast"
                  className="text-spm-purple hover:text-spm-purple-light font-semibold transition-colors"
                >
                  Listen Now →
                </Link>
              </NoirCardContent>
            </NoirCard>

            <NoirCard variant="interactive" hover>
              <NoirCardContent className="p-8">
                <NoirCardTitle>Speaking</NoirCardTitle>
                <NoirCardDescription className="mb-6">
                  Keynotes, workshops, and executive sessions on SPM governance, comp strategy,
                  and implementation reality. No slides. No buzzwords. Just truth.
                </NoirCardDescription>
                <Link
                  href="/toddfather/speaking"
                  className="text-spm-purple hover:text-spm-purple-light font-semibold transition-colors"
                >
                  Book Speaking →
                </Link>
              </NoirCardContent>
            </NoirCard>

            <NoirCard variant="interactive" hover>
              <NoirCardContent className="p-8">
                <NoirCardTitle>The Studio</NoirCardTitle>
                <NoirCardDescription className="mb-6">
                  Where The Toddfather creates: video production, script generation, and the
                  SPM content engine powered by AI + two decades of domain expertise.
                </NoirCardDescription>
                <Link
                  href="/studio"
                  className="text-spm-purple hover:text-spm-purple-light font-semibold transition-colors"
                >
                  Enter Studio →
                </Link>
              </NoirCardContent>
            </NoirCard>
          </div>
        </div>
      </section>

      {/* The Toddfather Promise */}
      <section className="py-20 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <NoirCard variant="elevated">
            <NoirCardContent className="p-12 text-center">
              <h2 className="text-headline-lg text-spm-purple mb-6">
                The Toddfather Promise
              </h2>
              <div className="space-y-4 text-lg text-gray-300">
                <p className="font-semibold">No vendor spin.</p>
                <p className="font-semibold">No consultant theater.</p>
                <p className="font-semibold">No "best practice" bullshit.</p>
                <p className="mt-8 text-xl text-white">
                  Just the truth about what works, what breaks, and why.
                </p>
              </div>
            </NoirCardContent>
          </NoirCard>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-spm-purple-dark/20 via-spm-black to-spm-black border-t border-spm-purple-dark/30">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-headline-lg text-white mb-6">
            Join The Syndicate
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Get weekly SPM reality delivered: vendor scorecards, implementation gotchas,
            and the comp patterns that actually work.
          </p>
          <Link
            href="/syndicate"
            className="inline-block px-12 py-4 bg-spm-purple hover:bg-spm-purple-light text-white text-lg font-semibold rounded-lg transition-all hover:shadow-purple-glow hover:scale-105"
          >
            Subscribe to The Syndicate
          </Link>
        </div>
      </section>
    </div>
  );
}
