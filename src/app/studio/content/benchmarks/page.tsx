'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { NoirCard, NoirCardContent, NoirCardTitle } from '@/components/spm/cards/NoirCard';

export default function BenchmarksAdminPage() {
  const [benchmarks, setBenchmarks] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/content/benchmarks').then(r => r.json()).then(d => setBenchmarks(d.benchmarks || []));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between mb-12">
        <h1 className="text-4xl font-headline text-white">Benchmarks</h1>
        <Link href="/studio/content/benchmarks/new" className="px-6 py-3 bg-spm-purple hover:bg-spm-purple-light text-white rounded-lg font-semibold">
          + Add Benchmark
        </Link>
      </div>
      {benchmarks.length === 0 ? (
        <NoirCard variant="elevated">
          <NoirCardContent className="p-12 text-center">
            <p className="text-gray-400 mb-4">No benchmarks yet. Add your first benchmark to get started.</p>
            <Link href="/studio/content/benchmarks/new" className="inline-block px-6 py-3 bg-spm-purple text-white rounded-lg font-semibold">
              Add First Benchmark
            </Link>
          </NoirCardContent>
        </NoirCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benchmarks.map(b => (
            <NoirCard key={b.id} variant="elevated">
              <NoirCardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <NoirCardTitle className="text-lg">{b.title}</NoirCardTitle>
                  <span className="text-xs px-2 py-1 bg-spm-purple/20 text-spm-purple rounded">{b.type}</span>
                </div>
                <p className="text-sm text-gray-400">{b.description.substring(0, 150)}...</p>
              </NoirCardContent>
            </NoirCard>
          ))}
        </div>
      )}
    </div>
  );
}
