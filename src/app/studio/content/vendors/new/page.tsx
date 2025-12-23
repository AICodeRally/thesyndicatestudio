'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NoirCard, NoirCardContent, NoirCardTitle } from '@/components/spm/cards/NoirCard';

export default function NewVendorPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    vendorName: '',
    slug: '',
    overallRating: 3.0,
    bestFor: '',
    worstFor: '',
    implementationReality: '',
    gotchas: '',
    easeScore: 3,
    flexibilityScore: 3,
    scaleScore: 3,
    uxScore: 3,
    integrationScore: 3,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/content/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorName: formData.vendorName,
          slug: formData.slug || formData.vendorName.toLowerCase().replace(/\s+/g, '-'),
          overallRating: formData.overallRating,
          bestFor: formData.bestFor.split(',').map(b => b.trim()).filter(Boolean),
          worstFor: formData.worstFor.split(',').map(w => w.trim()).filter(Boolean),
          implementationReality: formData.implementationReality,
          gotchas: formData.gotchas.split(',').map(g => g.trim()).filter(Boolean),
          scores: {
            ease: formData.easeScore,
            flexibility: formData.flexibilityScore,
            scale: formData.scaleScore,
            ux: formData.uxScore,
            integration: formData.integrationScore,
          },
        }),
      });

      if (res.ok) {
        router.push('/studio/content/vendors');
      } else {
        alert('Failed to create vendor');
      }
    } catch (error) {
      console.error('Error creating vendor:', error);
      alert('Failed to create vendor');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-headline text-white mb-8">
        Add Vendor Scorecard
      </h1>

      <NoirCard variant="elevated">
        <NoirCardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-headline text-gray-300 mb-2">
                  Vendor Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.vendorName}
                  onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                  className="w-full px-4 py-3 bg-spm-black border-2 border-spm-purple-dark/30 rounded-lg text-white placeholder-gray-500 focus:border-spm-purple outline-none transition-colors"
                  placeholder="e.g., Xactly"
                />
              </div>

              <div>
                <label className="block text-sm font-headline text-gray-300 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-3 bg-spm-black border-2 border-spm-purple-dark/30 rounded-lg text-white placeholder-gray-500 focus:border-spm-purple outline-none transition-colors"
                  placeholder="Auto-generated from name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-headline text-gray-300 mb-2">
                Overall Rating (1-5) *
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={formData.overallRating}
                  onChange={(e) => setFormData({ ...formData, overallRating: parseFloat(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-2xl text-spm-purple font-bold w-16 text-right">
                  {formData.overallRating}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-headline text-gray-300 mb-2">
                Best For (comma-separated) *
              </label>
              <input
                type="text"
                required
                value={formData.bestFor}
                onChange={(e) => setFormData({ ...formData, bestFor: e.target.value })}
                className="w-full px-4 py-3 bg-spm-black border-2 border-spm-purple-dark/30 rounded-lg text-white placeholder-gray-500 focus:border-spm-purple outline-none transition-colors"
                placeholder="e.g., Enterprise scale, Complex hierarchies"
              />
            </div>

            <div>
              <label className="block text-sm font-headline text-gray-300 mb-2">
                Worst For (comma-separated) *
              </label>
              <input
                type="text"
                required
                value={formData.worstFor}
                onChange={(e) => setFormData({ ...formData, worstFor: e.target.value })}
                className="w-full px-4 py-3 bg-spm-black border-2 border-spm-purple-dark/30 rounded-lg text-white placeholder-gray-500 focus:border-spm-purple outline-none transition-colors"
                placeholder="e.g., Fast iteration, Modern UX"
              />
            </div>

            <div>
              <label className="block text-sm font-headline text-gray-300 mb-2">
                Implementation Reality *
              </label>
              <textarea
                required
                rows={4}
                value={formData.implementationReality}
                onChange={(e) => setFormData({ ...formData, implementationReality: e.target.value })}
                className="w-full px-4 py-3 bg-spm-black border-2 border-spm-purple-dark/30 rounded-lg text-white placeholder-gray-500 focus:border-spm-purple outline-none transition-colors resize-none"
                placeholder="What actually happens during implementation..."
              />
            </div>

            <div>
              <label className="block text-sm font-headline text-gray-300 mb-2">
                Gotchas (comma-separated)
              </label>
              <input
                type="text"
                value={formData.gotchas}
                onChange={(e) => setFormData({ ...formData, gotchas: e.target.value })}
                className="w-full px-4 py-3 bg-spm-black border-2 border-spm-purple-dark/30 rounded-lg text-white placeholder-gray-500 focus:border-spm-purple outline-none transition-colors"
                placeholder="e.g., Long implementation times, Expensive services"
              />
            </div>

            <div className="bg-spm-black-soft border border-spm-purple-dark/20 rounded-lg p-6">
              <h3 className="text-lg font-headline text-spm-purple mb-4">
                Detailed Scores (1-5)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'easeScore', label: 'Ease of Use' },
                  { key: 'flexibilityScore', label: 'Flexibility' },
                  { key: 'scaleScore', label: 'Scale' },
                  { key: 'uxScore', label: 'User Experience' },
                  { key: 'integrationScore', label: 'Integration' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm text-gray-400 mb-2">{label}</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={formData[key as keyof typeof formData]}
                        onChange={(e) => setFormData({ ...formData, [key]: parseInt(e.target.value) })}
                        className="flex-1"
                      />
                      <span className="text-spm-purple font-semibold w-8 text-right">
                        {formData[key as keyof typeof formData]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-8 py-4 bg-spm-purple hover:bg-spm-purple-light text-white text-lg font-semibold rounded-lg transition-all hover:shadow-purple-glow disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create Vendor Scorecard'}
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
