'use client';

import { useState } from 'react';
import { NoirCard, NoirCardContent, NoirCardTitle } from '@/components/spm/cards/NoirCard';

export default function SplitsCalculatorPage() {
  const [dealSize, setDealSize] = useState(100000);
  const [splits, setSplits] = useState([
    { role: 'Account Executive', percentage: 60 },
    { role: 'Sales Engineer', percentage: 40 },
  ]);

  const addSplit = () => {
    setSplits([...splits, { role: '', percentage: 0 }]);
  };

  const removeSplit = (index: number) => {
    setSplits(splits.filter((_, i) => i !== index));
  };

  const updateSplit = (index: number, field: 'role' | 'percentage', value: any) => {
    const newSplits = [...splits];
    newSplits[index] = { ...newSplits[index], [field]: value };
    setSplits(newSplits);
  };

  const totalPercentage = splits.reduce((sum, s) => sum + (s.percentage || 0), 0);
  const isValid = totalPercentage === 100;

  const results = splits.map(s => ({
    ...s,
    credit: (dealSize * (s.percentage / 100)),
  }));

  return (
    <div className="w-full">
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-spm-black via-spm-purple-dark/20 to-spm-black" />
          <div className="absolute inset-0 crosshatch opacity-30" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-display text-white mb-6">SPLIT MANAGER</h1>
          <p className="text-headline text-gray-200 max-w-3xl mx-auto">
            Model credit allocation across overlays. Prevent the "who gets credit" wars.
          </p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <NoirCard variant="elevated">
            <NoirCardContent className="p-8">
              <NoirCardTitle className="mb-6">Deal Credit Allocation</NoirCardTitle>

              <div className="mb-8">
                <label className="block text-sm text-gray-400 mb-2">Deal Size ($)</label>
                <input
                  type="number"
                  value={dealSize}
                  onChange={(e) => setDealSize(parseFloat(e.target.value))}
                  className="w-full px-4 py-3 bg-spm-black border-2 border-spm-purple-dark/30 rounded-lg text-white text-2xl font-bold focus:border-spm-purple outline-none"
                />
              </div>

              <div className="space-y-4 mb-6">
                {splits.map((split, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <input
                      type="text"
                      placeholder="Role"
                      value={split.role}
                      onChange={(e) => updateSplit(index, 'role', e.target.value)}
                      className="flex-1 px-4 py-3 bg-spm-black border-2 border-spm-purple-dark/30 rounded-lg text-white focus:border-spm-purple outline-none"
                    />
                    <input
                      type="number"
                      placeholder="%"
                      value={split.percentage}
                      onChange={(e) => updateSplit(index, 'percentage', parseFloat(e.target.value) || 0)}
                      className="w-24 px-4 py-3 bg-spm-black border-2 border-spm-purple-dark/30 rounded-lg text-white text-center focus:border-spm-purple outline-none"
                    />
                    {splits.length > 1 && (
                      <button
                        onClick={() => removeSplit(index)}
                        className="px-4 py-3 bg-red-950/20 border border-red-800/30 text-red-400 rounded-lg hover:bg-red-950/40 transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={addSplit}
                className="w-full px-4 py-3 border-2 border-dashed border-spm-purple-dark/30 text-gray-400 hover:border-spm-purple hover:text-white rounded-lg transition-colors mb-6"
              >
                + Add Role
              </button>

              <div className={`p-4 rounded-lg border-2 ${isValid ? 'bg-green-950/20 border-green-800/30' : 'bg-amber-950/20 border-amber-800/30'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">Total:</span>
                  <span className={`text-2xl font-bold ${isValid ? 'text-green-400' : 'text-amber-400'}`}>
                    {totalPercentage}%
                  </span>
                </div>
                {!isValid && (
                  <p className="text-xs text-amber-400 mt-2">
                    Total must equal 100%
                  </p>
                )}
              </div>

              {isValid && (
                <div className="mt-8 pt-8 border-t border-spm-purple-dark/20">
                  <h3 className="text-xl font-headline text-spm-purple mb-4">Credit Distribution</h3>
                  <div className="space-y-3">
                    {results.map((r, i) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-spm-black/40 rounded-lg">
                        <div>
                          <div className="text-white font-semibold">{r.role || `Role ${i + 1}`}</div>
                          <div className="text-sm text-gray-400">{r.percentage}% of deal</div>
                        </div>
                        <div className="text-2xl font-bold text-spm-purple">
                          ${r.credit.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </NoirCardContent>
          </NoirCard>
        </div>
      </section>
    </div>
  );
}
