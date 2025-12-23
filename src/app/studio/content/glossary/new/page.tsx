'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NoirCard, NoirCardContent, NoirCardTitle } from '@/components/spm/cards/NoirCard';

export default function NewGlossaryTermPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    term: '',
    definition: '',
    category: 'Comp Design',
    aliases: '',
    relatedTerms: '',
    examples: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/content/glossary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          aliases: formData.aliases.split(',').map(a => a.trim()).filter(Boolean),
          relatedTerms: formData.relatedTerms.split(',').map(r => r.trim()).filter(Boolean),
        }),
      });

      if (res.ok) {
        router.push('/studio/content/glossary');
      } else {
        alert('Failed to create term');
      }
    } catch (error) {
      console.error('Error creating term:', error);
      alert('Failed to create term');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-headline text-white mb-8">
        Add Glossary Term
      </h1>

      <NoirCard variant="elevated">
        <NoirCardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-headline text-gray-300 mb-2">
                Term *
              </label>
              <input
                type="text"
                required
                value={formData.term}
                onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                className="w-full px-4 py-3 bg-spm-black border-2 border-spm-purple-dark/30 rounded-lg text-white placeholder-gray-500 focus:border-spm-purple outline-none transition-colors"
                placeholder="e.g., Accelerator"
              />
            </div>

            <div>
              <label className="block text-sm font-headline text-gray-300 mb-2">
                Definition *
              </label>
              <textarea
                required
                rows={4}
                value={formData.definition}
                onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
                className="w-full px-4 py-3 bg-spm-black border-2 border-spm-purple-dark/30 rounded-lg text-white placeholder-gray-500 focus:border-spm-purple outline-none transition-colors resize-none"
                placeholder="Clear, concise definition..."
              />
            </div>

            <div>
              <label className="block text-sm font-headline text-gray-300 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-spm-black border-2 border-spm-purple-dark/30 rounded-lg text-white focus:border-spm-purple outline-none transition-colors"
              >
                <option value="Comp Design">Comp Design</option>
                <option value="Admin">Admin</option>
                <option value="Governance">Governance</option>
                <option value="Analytics">Analytics</option>
                <option value="Strategy">Strategy</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-headline text-gray-300 mb-2">
                Aliases (comma-separated)
              </label>
              <input
                type="text"
                value={formData.aliases}
                onChange={(e) => setFormData({ ...formData, aliases: e.target.value })}
                className="w-full px-4 py-3 bg-spm-black border-2 border-spm-purple-dark/30 rounded-lg text-white placeholder-gray-500 focus:border-spm-purple outline-none transition-colors"
                placeholder="e.g., Kicker, Multiplier, Uplift"
              />
            </div>

            <div>
              <label className="block text-sm font-headline text-gray-300 mb-2">
                Related Terms (comma-separated)
              </label>
              <input
                type="text"
                value={formData.relatedTerms}
                onChange={(e) => setFormData({ ...formData, relatedTerms: e.target.value })}
                className="w-full px-4 py-3 bg-spm-black border-2 border-spm-purple-dark/30 rounded-lg text-white placeholder-gray-500 focus:border-spm-purple outline-none transition-colors"
                placeholder="e.g., Quota, Payout Curve, Attainment"
              />
            </div>

            <div>
              <label className="block text-sm font-headline text-gray-300 mb-2">
                Example (optional)
              </label>
              <textarea
                rows={3}
                value={formData.examples}
                onChange={(e) => setFormData({ ...formData, examples: e.target.value })}
                className="w-full px-4 py-3 bg-spm-black border-2 border-spm-purple-dark/30 rounded-lg text-white placeholder-gray-500 focus:border-spm-purple outline-none transition-colors resize-none"
                placeholder="Concrete example of this term in use..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-8 py-4 bg-spm-purple hover:bg-spm-purple-light text-white text-lg font-semibold rounded-lg transition-all hover:shadow-purple-glow disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create Term'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-4 border-2 border-spm-purple-dark/30 text-gray-300 hover:text-white hover:border-spm-purple rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </NoirCardContent>
      </NoirCard>
    </div>
  );
}
