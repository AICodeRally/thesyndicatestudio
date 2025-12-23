import Link from 'next/link';
import { NoirCard, NoirCardContent, NoirCardTitle, NoirCardDescription } from '@/components/spm/cards/NoirCard';

export const metadata = {
  title: 'Learn SPM | Intelligent SPM',
  description: 'Master the fundamentals of Sales Performance Management. Glossary, guides, and component cards.',
};

export default function LearnPage() {
  return (
    <div className="w-full">
      <section className="relative py-32 overflow-hidden vignette">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-spm-black via-spm-purple-dark/20 to-spm-black" />
          <div className="absolute inset-0 crosshatch opacity-30" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-display text-white mb-6">LEARN SPM</h1>
          <p className="text-headline text-gray-200 max-w-3xl mx-auto">
            Master the language, patterns, and building blocks of intelligent comp design
          </p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <NoirCard variant="interactive" hover>
            <NoirCardContent className="p-8">
              <NoirCardTitle>SPM Glossary</NoirCardTitle>
              <NoirCardDescription>
                The definitive dictionary of SPM terminology. No jargon, no vendor speak - just clear definitions.
              </NoirCardDescription>
              <div className="mt-6">
                <span className="text-gray-500 text-sm">Coming Soon</span>
              </div>
            </NoirCardContent>
          </NoirCard>

          <NoirCard variant="interactive" hover>
            <NoirCardContent className="p-8">
              <NoirCardTitle>Component Cards</NoirCardTitle>
              <NoirCardDescription>
                Deep dives on every SPM element: quotas, accelerators, splits, territories, hierarchies.
              </NoirCardDescription>
              <div className="mt-6">
                <span className="text-gray-500 text-sm">Coming Soon</span>
              </div>
            </NoirCardContent>
          </NoirCard>

          <NoirCard variant="interactive" hover>
            <NoirCardContent className="p-8">
              <NoirCardTitle>SPM 101</NoirCardTitle>
              <NoirCardDescription>
                Start here if you're new to Sales Performance Management. The essentials in plain English.
              </NoirCardDescription>
              <div className="mt-6">
                <span className="text-gray-500 text-sm">Coming Soon</span>
              </div>
            </NoirCardContent>
          </NoirCard>

          <NoirCard variant="interactive" hover>
            <NoirCardContent className="p-8">
              <NoirCardTitle>Content Library</NoirCardTitle>
              <NoirCardDescription>
                Articles, guides, and deep dives from The Toddfather on SPM reality.
              </NoirCardDescription>
              <div className="mt-6">
                <Link href="/counsel" className="text-spm-purple hover:text-spm-purple-light font-semibold">
                  Browse Counsel →
                </Link>
              </div>
            </NoirCardContent>
          </NoirCard>
        </div>
      </section>
    </div>
  );
}
