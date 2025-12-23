'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { NoirCard, NoirCardContent, NoirCardTitle, NoirCardDescription } from '@/components/spm/cards/NoirCard';

export default function GlossaryAdminPage() {
  const [terms, setTerms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTerms();
  }, []);

  const loadTerms = async () => {
    try {
      const res = await fetch('/api/content/glossary');
      if (res.ok) {
        const data = await res.json();
        setTerms(data.terms || []);
      }
    } catch (error) {
      console.error('Failed to load glossary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this term?')) return;

    try {
      const res = await fetch(`/api/content/glossary/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setTerms(terms.filter(t => t.id !== id));
      } else {
        alert('Failed to delete term');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete term');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-headline text-white mb-3">
            SPM Glossary
          </h1>
          <p className="text-gray-400">
            {terms.length} terms • Manage terminology
          </p>
        </div>
        <Link
          href="/studio/content/glossary/new"
          className="px-6 py-3 bg-spm-purple hover:bg-spm-purple-light text-white rounded-lg font-semibold transition-all hover:shadow-purple-glow"
        >
          + Add Term
        </Link>
      </div>

      {terms.length === 0 ? (
        <NoirCard variant="elevated">
          <NoirCardContent className="p-12 text-center">
            <NoirCardTitle className="mb-4">No Terms Yet</NoirCardTitle>
            <NoirCardDescription className="mb-6">
              Start building your SPM glossary. Add your first term to get started.
            </NoirCardDescription>
            <Link
              href="/studio/content/glossary/new"
              className="inline-block px-8 py-3 bg-spm-purple hover:bg-spm-purple-light text-white rounded-lg font-semibold transition-all"
            >
              Add First Term
            </Link>
          </NoirCardContent>
        </NoirCard>
      ) : (
        <div className="space-y-4">
          {terms.map((term) => (
            <NoirCard key={term.id} variant="elevated">
              <NoirCardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-headline text-spm-purple">
                        {term.term}
                      </h3>
                      <span className="text-xs px-2 py-1 bg-spm-purple/20 text-spm-purple rounded">
                        {term.category}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">
                      {term.definition.substring(0, 200)}
                      {term.definition.length > 200 ? '...' : ''}
                    </p>
                    {term.aliases.length > 0 && (
                      <p className="text-xs text-gray-500">
                        Aliases: {term.aliases.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link
                      href={`/studio/content/glossary/${term.id}`}
                      className="px-4 py-2 bg-spm-black-soft border border-spm-purple-dark/30 text-gray-300 hover:text-white hover:border-spm-purple rounded text-sm transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(term.id)}
                      className="px-4 py-2 bg-red-950/20 border border-red-800/30 text-red-400 hover:bg-red-950/40 rounded text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </NoirCardContent>
            </NoirCard>
          ))}
        </div>
      )}
    </div>
  );
}
