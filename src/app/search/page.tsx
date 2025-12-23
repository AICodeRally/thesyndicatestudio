'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NoirCard, NoirCardContent, NoirCardTitle, NoirCardDescription } from '@/components/spm/cards/NoirCard';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);

    try {
      // Search across multiple content types
      const [glossaryRes, counselRes] = await Promise.all([
        fetch(`/api/content/glossary?search=${encodeURIComponent(query)}`),
        fetch(`/api/counsel?search=${encodeURIComponent(query)}`),
      ]);

      const glossaryData = await glossaryRes.json();
      const counselData = await counselRes.json();

      const combined = [
        ...(glossaryData.terms || []).map((t: any) => ({ ...t, type: 'glossary' })),
        ...(counselData.counsel || []).map((c: any) => ({ ...c, type: 'counsel' })),
      ];

      setResults(combined);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="w-full">
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-spm-black via-spm-purple-dark/20 to-spm-black" />
          <div className="absolute inset-0 crosshatch opacity-30" />
        </div>

        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-display text-white mb-6 text-center">SEARCH</h1>
            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search SPM content..."
                  className="flex-1 px-6 py-4 bg-spm-black border-2 border-spm-purple-dark/30 rounded-lg text-white text-lg placeholder-gray-500 focus:border-spm-purple outline-none transition-colors"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={searching}
                  className="px-8 py-4 bg-spm-purple hover:bg-spm-purple-light text-white rounded-lg font-semibold transition-all hover:shadow-purple-glow disabled:opacity-50"
                >
                  {searching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="py-12 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {results.length > 0 ? (
            <div className="space-y-4">
              <p className="text-gray-400 mb-6">
                Found {results.length} results for "{query}"
              </p>
              {results.map((result, i) => (
                <NoirCard key={i} variant="elevated">
                  <NoirCardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <NoirCardTitle className="text-xl">
                            {result.term || result.title}
                          </NoirCardTitle>
                          <span className="text-xs px-2 py-1 bg-spm-purple/20 text-spm-purple rounded">
                            {result.type}
                          </span>
                        </div>
                        <NoirCardDescription>
                          {result.definition || result.oneLiner}
                        </NoirCardDescription>
                      </div>
                    </div>
                    <Link
                      href={result.type === 'glossary' ? '/learn/glossary' : `/counsel/${result.slug}`}
                      className="text-spm-purple hover:text-spm-purple-light font-semibold text-sm transition-colors"
                    >
                      View →
                    </Link>
                  </NoirCardContent>
                </NoirCard>
              ))}
            </div>
          ) : query && !searching ? (
            <NoirCard variant="elevated">
              <NoirCardContent className="p-12 text-center">
                <p className="text-gray-400">
                  No results found for "{query}"
                </p>
              </NoirCardContent>
            </NoirCard>
          ) : null}
        </div>
      </section>
    </div>
  );
}
