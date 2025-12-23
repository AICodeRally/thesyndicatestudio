import Link from 'next/link';
import Image from 'next/image';
import {
  NoirCard,
  NoirCardContent,
  NoirCardTitle,
  NoirCardDescription,
} from '@/components/spm/cards/NoirCard';
import {
  LearnIcon,
  AnalyzeIcon,
  BenchmarksIcon,
  VendorsIcon,
  CommunityIcon,
  ServicesIcon,
  UploadIcon,
  LibraryIcon,
  ScorecardIcon,
} from '@/components/spm/icons/NoirIcons';

export default function Homepage() {
  return (
    <div className="w-full">
      {/* Hero Section - Category Ownership */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background: Pure Noir Aesthetic with Toddfather Silhouette */}
        <div className="absolute inset-0 z-0">
          {/* Deep black base */}
          <div className="absolute inset-0 bg-spm-black" />

          {/* Toddfather noir panel - subtle silhouette on right */}
          <Image
            src="/images/noir/toddfather_noir_panel_1_left.png"
            alt=""
            width={600}
            height={900}
            className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none mix-blend-screen"
            aria-hidden="true"
          />

          {/* Purple spotlight from top */}
          <div className="absolute inset-0 bg-gradient-to-b from-spm-purple-dark/30 via-transparent to-spm-black" />

          {/* Diagonal purple accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-spm-purple-dark/10 to-transparent" />

          {/* Crosshatch texture (woodcut effect) */}
          <div className="absolute inset-0 crosshatch opacity-30" />

          {/* Halftone dots */}
          <div className="absolute inset-0 halftone opacity-15" />

          {/* Dramatic vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(10,10,10,0.6)_70%,rgba(10,10,10,0.95)_100%)]" />

          {/* Bottom fade to black */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-spm-black" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-display text-white mb-6 drop-shadow-noir-lg">
            INTELLIGENT SPM
          </h1>

          <p className="text-headline-lg text-gray-200 mb-8 max-w-3xl mx-auto">
            The clearing house for sales compensation, governance, and
            performance truth.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/analyze/plan-check"
              className="px-8 py-4 bg-spm-purple hover:bg-spm-purple-light text-white text-lg font-semibold rounded-lg transition-all hover:shadow-purple-glow hover:scale-105"
            >
              Run a Plan Check
            </Link>
            <Link
              href="/learn/library"
              className="px-8 py-4 border-2 border-spm-purple text-spm-purple hover:bg-spm-purple hover:text-white text-lg font-semibold rounded-lg transition-all"
            >
              Explore the SPM Library
            </Link>
          </div>

          {/* Proof bar */}
          <div className="text-gray-400 text-sm tracking-wider">
            Tools • Benchmarks • Vendor Reality • Community
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-spm-purple-glow"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Fast Paths (3 Tiles) */}
      <section className="py-20 container mx-auto px-6">
        <h2 className="text-headline-lg text-center text-white mb-4">
          Start Here
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          Three fast paths into the Intelligent SPM clearing house
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tile 1 */}
          <NoirCard variant="interactive" hover>
            <NoirCardContent className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <UploadIcon className="w-16 h-16 text-spm-purple" />
              </div>
              <NoirCardTitle>Upload & Diagnose</NoirCardTitle>
              <NoirCardDescription>
                Run a Plan QA check in 60 seconds. Upload your comp plan and get instant risk scoring.
              </NoirCardDescription>
              <Link href="/analyze/plan-check" className="inline-block mt-6 text-spm-purple hover:text-spm-purple-light font-semibold transition-colors">
                Start Plan Check →
              </Link>
            </NoirCardContent>
          </NoirCard>

          {/* Tile 2 */}
          <NoirCard variant="interactive" hover>
            <NoirCardContent className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <LibraryIcon className="w-16 h-16 text-spm-purple" />
              </div>
              <NoirCardTitle>SPM Component Cards</NoirCardTitle>
              <NoirCardDescription>
                Learn the building blocks of comp design. Glossary, best practices, and gotchas for every SPM element.
              </NoirCardDescription>
              <Link href="/learn/component-cards" className="inline-block mt-6 text-spm-purple hover:text-spm-purple-light font-semibold transition-colors">
                Browse Library →
              </Link>
            </NoirCardContent>
          </NoirCard>

          {/* Tile 3 */}
          <NoirCard variant="interactive" hover>
            <NoirCardContent className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <ScorecardIcon className="w-16 h-16 text-spm-purple" />
              </div>
              <NoirCardTitle>Vendor Scorecards</NoirCardTitle>
              <NoirCardDescription>
                Who's good at what, who breaks where. Real implementation reality from actual rollouts.
              </NoirCardDescription>
              <Link href="/vendors" className="inline-block mt-6 text-spm-purple hover:text-spm-purple-light font-semibold transition-colors">
                View Scorecards →
              </Link>
            </NoirCardContent>
          </NoirCard>
        </div>
      </section>

      {/* What We Are (6-lane grid) */}
      <section className="py-20 bg-spm-black-soft">
        <div className="container mx-auto px-6">
          <h2 className="text-headline-lg text-center text-white mb-4">
            What We Are
          </h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            The comprehensive SPM clearing house - six integrated capabilities
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/learn">
              <NoirCard variant="interactive" hover className="h-full">
                <NoirCardContent className="p-8 text-center">
                  <div className="mb-6 flex items-center justify-center">
                    <LearnIcon className="w-20 h-20 text-spm-purple" />
                  </div>
                  <NoirCardTitle>Learn</NoirCardTitle>
                  <NoirCardDescription>Glossary, guides, component cards</NoirCardDescription>
                </NoirCardContent>
              </NoirCard>
            </Link>

            <Link href="/analyze">
              <NoirCard variant="interactive" hover className="h-full">
                <NoirCardContent className="p-8 text-center">
                  <div className="mb-6 flex items-center justify-center">
                    <AnalyzeIcon className="w-20 h-20 text-spm-purple" />
                  </div>
                  <NoirCardTitle>Analyze</NoirCardTitle>
                  <NoirCardDescription>Plan QA, risk scoring, simulators</NoirCardDescription>
                </NoirCardContent>
              </NoirCard>
            </Link>

            <Link href="/benchmarks">
              <NoirCard variant="interactive" hover className="h-full">
                <NoirCardContent className="p-8 text-center">
                  <div className="mb-6 flex items-center justify-center">
                    <BenchmarksIcon className="w-20 h-20 text-spm-purple" />
                  </div>
                  <NoirCardTitle>Benchmarks</NoirCardTitle>
                  <NoirCardDescription>Curves, quota patterns, governance</NoirCardDescription>
                </NoirCardContent>
              </NoirCard>
            </Link>

            <Link href="/vendors">
              <NoirCard variant="interactive" hover className="h-full">
                <NoirCardContent className="p-8 text-center">
                  <div className="mb-6 flex items-center justify-center">
                    <VendorsIcon className="w-20 h-20 text-spm-purple" />
                  </div>
                  <NoirCardTitle>Vendors</NoirCardTitle>
                  <NoirCardDescription>Scorecards, implementation reality</NoirCardDescription>
                </NoirCardContent>
              </NoirCard>
            </Link>

            <Link href="/syndicate">
              <NoirCard variant="interactive" hover className="h-full">
                <NoirCardContent className="p-8 text-center">
                  <div className="mb-6 flex items-center justify-center">
                    <CommunityIcon className="w-20 h-20 text-spm-purple" />
                  </div>
                  <NoirCardTitle>Community</NoirCardTitle>
                  <NoirCardDescription>Syndicate, office hours, newsletter</NoirCardDescription>
                </NoirCardContent>
              </NoirCard>
            </Link>

            <Link href="/services">
              <NoirCard variant="interactive" hover className="h-full">
                <NoirCardContent className="p-8 text-center">
                  <div className="mb-6 flex items-center justify-center">
                    <ServicesIcon className="w-20 h-20 text-spm-purple" />
                  </div>
                  <NoirCardTitle>Services</NoirCardTitle>
                  <NoirCardDescription>Assessment → redesign → governance</NoirCardDescription>
                </NoirCardContent>
              </NoirCard>
            </Link>
          </div>
        </div>
      </section>

      {/* SPM Reality Feed Preview */}
      <section className="py-20 container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-headline-lg text-white mb-2">
              The SPM Reality
            </h2>
            <p className="text-gray-400">
              Latest insights on comp design, governance, and performance truth
            </p>
          </div>

          <div className="flex gap-2 mt-4 md:mt-0 flex-wrap">
            {['All', 'Comp Design', 'Governance', 'Analytics', 'AI'].map((filter) => (
              <button
                key={filter}
                className={
                  filter === 'All'
                    ? 'px-4 py-2 bg-spm-purple text-white text-sm rounded-lg font-semibold'
                    : 'px-4 py-2 bg-spm-black-soft border border-spm-purple-dark/30 text-gray-300 hover:text-white text-sm rounded-lg transition-colors'
                }
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <NoirCard key={i} variant="elevated">
              <NoirCardContent className="p-6">
                <div className="text-xs text-spm-purple font-semibold mb-2">
                  PODCAST • DEC {20 + i}, 2024
                </div>
                <NoirCardTitle className="text-xl mb-3">
                  Coming Soon: SPM Content
                </NoirCardTitle>
                <NoirCardDescription>
                  Episodes, articles, and insights from The Toddfather on SPM reality. Content will be populated from the studio and counsel library.
                </NoirCardDescription>
                <div className="mt-4 flex gap-2">
                  <span className="px-2 py-1 bg-spm-purple/20 text-spm-purple text-xs rounded">Governance</span>
                  <span className="px-2 py-1 bg-spm-purple/20 text-spm-purple text-xs rounded">Implementation</span>
                </div>
              </NoirCardContent>
            </NoirCard>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/learn/library" className="inline-block px-6 py-3 border-2 border-spm-purple text-spm-purple hover:bg-spm-purple hover:text-white rounded-lg font-semibold transition-all">
            View All Content
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-spm-purple-dark/20 via-spm-black to-spm-black border-t border-spm-purple-dark/30">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-headline-lg text-white mb-6">
            Ready to Check Your Plan?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Upload your comp plan and get instant risk scoring, governance recommendations, and implementation reality checks.
          </p>
          <Link href="/analyze/plan-check" className="inline-block px-12 py-4 bg-spm-purple hover:bg-spm-purple-light text-white text-lg font-semibold rounded-lg transition-all hover:shadow-purple-glow hover:scale-105">
            Run a Plan Check — Free
          </Link>
        </div>
      </section>
    </div>
  );
}
