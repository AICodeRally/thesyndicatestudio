import Link from 'next/link';
import { NoirCard, NoirCardContent, NoirCardTitle, NoirCardDescription } from '@/components/spm/cards/NoirCard';

export const metadata = {
  title: 'Content Management | Studio',
  description: 'Manage SPM content: glossary, vendors, benchmarks, component cards.',
};

export default function ContentManagementPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-headline text-white mb-3">
          Content Management
        </h1>
        <p className="text-gray-400">
          Manage all SPM clearing house content from one place
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Glossary */}
        <Link href="/studio/content/glossary">
          <NoirCard variant="interactive" hover>
            <NoirCardContent className="p-8">
              <NoirCardTitle className="text-2xl mb-4">
                SPM Glossary
              </NoirCardTitle>
              <NoirCardDescription className="mb-6">
                Manage SPM terminology. Add, edit, and organize term definitions, aliases, and examples.
              </NoirCardDescription>
              <div className="text-spm-purple font-semibold">
                Manage Glossary →
              </div>
            </NoirCardContent>
          </NoirCard>
        </Link>

        {/* Vendor Scorecards */}
        <Link href="/studio/content/vendors">
          <NoirCard variant="interactive" hover>
            <NoirCardContent className="p-8">
              <NoirCardTitle className="text-2xl mb-4">
                Vendor Scorecards
              </NoirCardTitle>
              <NoirCardDescription className="mb-6">
                Manage vendor analysis. Add ratings, best/worst for, implementation reality, and gotchas.
              </NoirCardDescription>
              <div className="text-spm-purple font-semibold">
                Manage Vendors →
              </div>
            </NoirCardContent>
          </NoirCard>
        </Link>

        {/* Benchmarks */}
        <Link href="/studio/content/benchmarks">
          <NoirCard variant="interactive" hover>
            <NoirCardContent className="p-8">
              <NoirCardTitle className="text-2xl mb-4">
                Benchmarks
              </NoirCardTitle>
              <NoirCardDescription className="mb-6">
                Manage benchmark data. Payout curves, quota patterns, governance maturity models.
              </NoirCardDescription>
              <div className="text-spm-purple font-semibold">
                Manage Benchmarks →
              </div>
            </NoirCardContent>
          </NoirCard>
        </Link>

        {/* Component Cards */}
        <Link href="/studio/content/components">
          <NoirCard variant="interactive" hover>
            <NoirCardContent className="p-8">
              <NoirCardTitle className="text-2xl mb-4">
                SPM Component Cards
              </NoirCardTitle>
              <NoirCardDescription className="mb-6">
                Manage component card library. Plan elements, rule types, admin objects explained.
              </NoirCardDescription>
              <div className="text-spm-purple font-semibold">
                Manage Components →
              </div>
            </NoirCardContent>
          </NoirCard>
        </Link>
      </div>
    </div>
  );
}
