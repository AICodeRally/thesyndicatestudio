'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NoirCard, NoirCardContent, NoirCardTitle, NoirCardDescription } from '@/components/spm/cards/NoirCard';

export default function PlanCheckPage() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/analyze/plan-check', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const analysis = await res.json();
        setResults(analysis);
      } else {
        alert('Analysis failed. Please try again.');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="w-full">
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-spm-black via-spm-purple-dark/20 to-spm-black" />
          <div className="absolute inset-0 crosshatch opacity-30" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-display text-white mb-6">PLAN CHECK</h1>
          <p className="text-headline text-gray-200 max-w-3xl mx-auto">
            Upload your comp plan. Get instant risk scoring in 60 seconds.
          </p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {!results ? (
            <NoirCard variant="elevated">
              <NoirCardContent className="p-12">
                <NoirCardTitle className="text-3xl mb-6 text-center">
                  Upload Your Comp Plan
                </NoirCardTitle>

                <div className="space-y-8">
                  {/* File Upload */}
                  <div className="border-2 border-dashed border-spm-purple-dark/30 rounded-lg p-12 text-center hover:border-spm-purple transition-colors">
                    <input
                      type="file"
                      id="planUpload"
                      className="hidden"
                      accept=".pdf,.xlsx,.xls,.docx,.doc"
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="planUpload" className="cursor-pointer">
                      <div className="mb-4">
                        <svg className="w-16 h-16 mx-auto text-spm-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      {file ? (
                        <p className="text-lg text-white mb-2">{file.name}</p>
                      ) : (
                        <p className="text-lg text-gray-300 mb-2">Drop your comp plan here or click to browse</p>
                      )}
                      <p className="text-sm text-gray-500">
                        PDF, Excel, or Word • Max 10MB
                      </p>
                    </label>
                  </div>

                  {/* What We Check */}
                  <div>
                    <h3 className="text-lg font-headline text-spm-purple mb-4 text-center">
                      What We Analyze
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        'Payout curve gotchas',
                        'Split rule edge cases',
                        'Territory overlap risks',
                        'Governance gaps',
                        'Change management process',
                        'Data integrity checks',
                        'Rollout readiness',
                        'Vendor fit assessment',
                      ].map((item) => (
                        <div key={item} className="flex items-center text-sm text-gray-300">
                          <svg className="w-5 h-5 text-spm-purple mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={handleAnalyze}
                    disabled={!file || analyzing}
                    className="w-full px-8 py-4 bg-spm-purple hover:bg-spm-purple-light text-white text-lg font-semibold rounded-lg transition-all hover:shadow-purple-glow hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {analyzing ? 'Analyzing...' : 'Run Plan Check'}
                  </button>

                  <p className="text-center text-sm text-gray-500">
                    Free • No login required • Results in 60 seconds
                  </p>
                </div>
              </NoirCardContent>
            </NoirCard>
          ) : (
            <div className="space-y-8">
              {/* Results Summary */}
              <NoirCard variant="elevated">
                <NoirCardContent className="p-12">
                  <div className="text-center mb-8">
                    <div className="inline-block mb-4">
                      <div className="text-6xl font-display text-spm-purple">
                        {results.score}
                      </div>
                      <div className="text-sm text-gray-500">/ 100</div>
                    </div>
                    <h2 className="text-headline-lg text-white mb-2">
                      {results.overallRisk} Risk
                    </h2>
                    <p className="text-gray-400">
                      Your comp plan has some gotchas. Here's what we found.
                    </p>
                  </div>

                  {/* Findings */}
                  <div className="space-y-4">
                    {results.findings.map((finding: any, i: number) => (
                      <div
                        key={i}
                        className={`p-4 rounded-lg border ${
                          finding.type === 'error'
                            ? 'bg-red-950/20 border-red-800/30'
                            : finding.type === 'warning'
                            ? 'bg-amber-950/20 border-amber-800/30'
                            : 'bg-green-950/20 border-green-800/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`text-lg ${
                            finding.type === 'error' ? 'text-red-400' :
                            finding.type === 'warning' ? 'text-amber-400' :
                            'text-green-400'
                          }`}>
                            {finding.type === 'error' ? '✗' : finding.type === 'warning' ? '⚠' : '✓'}
                          </span>
                          <p className={`text-sm ${
                            finding.type === 'error' ? 'text-red-200' :
                            finding.type === 'warning' ? 'text-amber-200' :
                            'text-green-200'
                          }`}>
                            {finding.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </NoirCardContent>
              </NoirCard>

              {/* CTAs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <NoirCard variant="interactive" hover>
                  <NoirCardContent className="p-8 text-center">
                    <NoirCardTitle className="mb-4">Get the Full Report</NoirCardTitle>
                    <NoirCardDescription className="mb-6">
                      Deep dive analysis with specific recommendations and governance templates.
                    </NoirCardDescription>
                    <Link href="/services/assessment" className="text-spm-purple hover:text-spm-purple-light font-semibold">
                      Learn More →
                    </Link>
                  </NoirCardContent>
                </NoirCard>

                <NoirCard variant="interactive" hover>
                  <NoirCardContent className="p-8 text-center">
                    <NoirCardTitle className="mb-4">Check Another Plan</NoirCardTitle>
                    <NoirCardDescription className="mb-6">
                      Run the Plan Check again with a different comp plan document.
                    </NoirCardDescription>
                    <button
                      onClick={() => { setResults(null); setFile(null); }}
                      className="text-spm-purple hover:text-spm-purple-light font-semibold"
                    >
                      Start Over →
                    </button>
                  </NoirCardContent>
                </NoirCard>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
